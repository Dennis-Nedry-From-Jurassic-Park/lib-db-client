import {ClickHouseClient, createClient} from '@clickhouse/client'
import {v4} from "uuid";
import Stream from "stream";

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
}): ClickHouseClient<Stream.Readable> => {
    return createClient({
        host: 'http://' + host + ':' + port, // http://localhost:8123 ; Port 9000 is for clickhouse-client program.
        application: app,
        username: 'default',
        password: '',
        //session_id: session_id
    })
}
// https://clickhouse.com/docs/en/integrations/language-clients/nodejs
// TODO: Nested Types and Array(Tuple())
export const clickhouse_beta: any = createClickHouseClient({
    app: 'AR', host: 'localhost', port: 8123, session_id: v4(), debug: false, raw: false
})


