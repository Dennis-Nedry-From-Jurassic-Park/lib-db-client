import {DataSource} from "typeorm";
import {Table} from "../../types/table";
import {usageInfo} from "../../ai/gpt";
import {deunionize} from "telegraf";
import {v4 as uuidv4} from "uuid";
import {ModelGPT} from "../../types/gpt.model";
import {db, host, password, schema, user} from "./pg.constants";
import stringify from "safe-stable-stringify";
import {getRoleId, Role} from "../../ai/gpt.types";

export const pg_url = `postgresql://${user}:${password}@${host}/${db}`

export class PgDataSource extends DataSource {
    constructor(
        logging: boolean = true,
        migrationsTableName: string = "migrations",
        migrations: string[] = ["src/migrations/**/*.ts"]
    ) {
        super({
            name: "default",
            type: "postgres",
            url: pg_url,
            synchronize: false,
            logging: logging,
            schema: "public", // для создания таблицы истории миграций
            migrationsTableName: migrationsTableName,
            migrations: migrations,
        });

        //console.log('params: ' + `postgresql://${user}:${password}@${host}/${db}`);
    }

    get data_source() {
        return this;
    }

    async init(): Promise<any> {
        this.initialize().catch((err) => console.log(err));
    }

    error = async (ctx: any, error: string) => {
        const message = ctx.message;
        const username_id = message.from.id;

        const query = `INSERT INTO "${db}"."${schema}"."errors" VALUES (now(), ${username_id}, '${error}')`;
        try {
            await this.query(query);
        } catch (err) {
            console.error(err);
        }
    };

    saveError = async (error: string) => {
        const query = `INSERT INTO "${db}"."${schema}"."errors" VALUES (now(), 0, '${this.prepareStringForQueryReplace(stringify(error))}', '${uuidv4()}')`;
        try {
            await this.query(query);
        } catch (err) {
            console.error(err);
        }
    };

    getGptRateLimits = async () => {
        // TODO: убрали RPD ??
        const query = `
            SELECT 
            timestamp,
            "x-ratelimit-remaining-requests" as rpm,
            "x-ratelimit-remaining-tokens" as tpd,
            "x-ratelimit-reset-requests" as resetRequests,
            "x-ratelimit-reset-tokens" as resetTokens
            FROM "${db}"."${schema}"."stats_rate_limit" order by timestamp desc limit 1
        `;
        try {
            return await this.query(query);
        } catch (err) {
            console.error(err);
        }
    };

    saveStatsUsageWithRateLimit = async (
        data: any,
        response: any,
        messages: any[],
        userId,
    ) => {
        const usage = data?.usage ?? {
            // при stream=true, поле usage не приходит
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
        };
        const headers = response.headers;

        const usedTokens = usageInfo(ModelGPT.default, messages).usedTokens;
        const usedUSD = usageInfo(ModelGPT.default, messages).usedUSD;

        const query = `INSERT INTO "${db}"."${schema}"."stats_rate_limit" VALUES (
                '${uuidv4()}',
                '${headers.get("openai-model")}',
                '${headers.get("openai-version")}',
                '${headers.get("openai-processing-ms")}',
                 ${headers.get("x-ratelimit-limit-requests")},
                 ${headers.get("x-ratelimit-limit-tokens")},
                 ${headers.get("x-ratelimit-limit-tokens_usage_based")},
                 ${headers.get("x-ratelimit-remaining-requests")},
                 ${headers.get("x-ratelimit-remaining-tokens")},
                 ${headers.get("x-ratelimit-remaining-tokens_usage_based")},
                 '${headers.get("x-ratelimit-reset-requests")}',
                 '${headers.get("x-ratelimit-reset-tokens")}',
                 '${headers.get("x-ratelimit-reset-tokens_usage_based")}',
                 '${headers.get("x-request-id")}', 
                 now(),
                 ${usage.prompt_tokens},
                 ${usage.completion_tokens},
                 ${usage.total_tokens},
                 ${usedTokens},
                 ${usedUSD},
                 ${userId}) ON CONFLICT ("id") DO NOTHING;`;
        try {
            await this.query(query);
        } catch (err) {
            console.error(err);
        }
    };

    clearSession = async (id: number) => {
        try {
            await this.query(
                `DELETE FROM public."telegraf-sessions" WHERE "key" = '${id}:${id}'`,
            );
        } catch (err) {
            console.error(err);
        }
    };

    getBannedUsersIds = async () => {
        const query = `
            select 
            "message.from.id" as userId
            FROM bot_unpacker.users
            where is_ban = true
        `;
        try {
            return (await this.query(query)).map((it) => {
                return +it.userid;
            });
        } catch (err) {
            console.error(err);
        }
        return [];
    };
    saveUser = async (ctx: any, is_sub: boolean) => {
        let message: any;

        if (ctx.message) {
            message = ctx.message;
        } else {
            message = ctx;
        }

        const username_id = message.from.id;

        const from = message.from;

        const username = from.username;
        const is_bot = from.is_bot;
        const first_name = from.first_name;
        const last_name = from.last_name;
        const language_code = from.language_code;

        const query =
            `INSERT INTO "${db}"."${schema}"."users" VALUES (${username_id}, '${username}', ${is_bot}, '${first_name}', '${last_name}', '${language_code}', now(), '${is_sub}')` +
            ` ON CONFLICT ("message.from.id") DO UPDATE SET is_sub = ${is_sub};`;
        try {
            await this.query(query);
        } catch (err) {
            console.error(err);
        }
    };

    prepareStringForQueryReplace(str: string): string {
        return str.replace(/`/g, "``").replace(/"/g, '""').replace(/'/g, "''");
    }

    saveToHistory = async (
        ctx: any,
        role: Role,
        uuid: string,
        content: string,
        table: Table,
        sessionUUID: string,
        step: number,
    ) => {
        try {
            let message: any;

            if (ctx.message) {
                message = deunionize(ctx.message);
            } else if (ctx.update) {
                message = deunionize(ctx.update);
            }

            let date: any;
            let username_id: any;

            if (message.callback_query) {
                date = message.callback_query.message.date;
                username_id = message.callback_query.from.id;
            } else {
                date = message.date;
                username_id = message.from.id;
            }

            ctx.username_id = username_id

            const roleId = getRoleId(role);

            const query = `INSERT INTO "${db}"."${schema}"."${table}" VALUES ('${uuid}', ${username_id}, ${date}, '${this.prepareStringForQueryReplace(content)}', ${roleId}, now(), '${sessionUUID}', ${step})`;

            await this.query(query);
        } catch (err) {
            if (err instanceof TypeError) {
                await pg.saveError(err.message);
                console.error("TypeError occured! " + err.message);
            } else {
                await pg.saveError(err);
                console.error("Pg_err occured! " + err.message);
            }
        }
    };
}

const pg = new PgDataSource();
pg.init().then((r) => r);
export {pg};
