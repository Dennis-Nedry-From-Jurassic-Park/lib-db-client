import {DataSource} from "typeorm";
import {v4 as uuidv4} from "uuid";
import {db, host, password, schema, user} from "./pg.constants";
import stringify from "safe-stable-stringify";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

export const PostgresConnectionOptionsDefault: PostgresConnectionOptions = {
    name: "default",
    type: "postgres",
    url: `postgresql://${user}:${password}@${host}/${db}`,
    synchronize: false,
    logging: true,
    schema: "public", // для создания таблицы истории миграций
    migrationsTableName: "migrations",
    migrations: ["src/migrations/**/*.ts"]
}

/**
 * const pg = new PgDataSource(PostgresConnectionOptionsDefault);
 * await pg.initialize()
 * export {pg};
 */
export class PgDataSource extends DataSource {
    constructor(postgresConnectionOptions: PostgresConnectionOptions) {
        super(postgresConnectionOptions);
    }

    get data_source() {
        return this;
    }

    saveError = async (error: string) => {
        const query = `INSERT INTO "${db}"."${schema}"."errors" VALUES (now(), 0, '${this.prepareStringForQueryReplace(stringify(error))}', '${uuidv4()}')`;
        try {
            await this.query(query);
        } catch (err) {
            console.error(err);
        }
    };

    prepareStringForQueryReplace(str: string): string {
        return str
            .replace(/`/g, "``")
            .replace(/"/g, '""')
            .replace(/'/g, "''");
    }
}