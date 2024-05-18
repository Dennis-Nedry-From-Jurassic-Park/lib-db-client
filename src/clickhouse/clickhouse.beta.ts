import {ClickHouseClient, createClient} from '@clickhouse/client'
import {v4} from "uuid";
import Stream from "stream";

// TODO: https://github.com/ClickHouse/clickhouse-js/blob/ad8611e736a82d98416c1d99d903240df02d7ace/examples/url_configuration.ts

export const createClickHouseClient = ({
                                           app,
                                           host,
                                           port,
                                           session_id,
                                           debug,
                                           raw,
                                       }: {
    app?: string,
    host: string,
    port: number,
    session_id: string,
    debug: boolean,
    raw: boolean,
}): ClickHouseClient => { // TODO: <Stream.Readable>
    return createClient({
        host: 'http://' + host + ':' + port, // http://localhost:8123 ; Port 9000 is for clickhouse-client program.
        application: app,
        username: 'default',
        password: '',
        session_id: session_id
    })
}
// async insertData<T>(table: string, data: T[]) {
//     const values = data.map((v, i) => ({...v, id: i + 1}))
//     console.log(values);
//     await this.clickhouse_beta.insert({
//         table,
//         values,
//         format: 'JSONEachRow',
//     })
// }
// https://clickhouse.com/docs/en/integrations/language-clients/nodejs
// TODO: Nested Types and Array(Tuple())
export const clickhouse_beta: ClickHouseClient = createClickHouseClient({
    app: 'app', host: 'localhost', port: 8123, session_id: v4(), debug: true, raw: false
})


