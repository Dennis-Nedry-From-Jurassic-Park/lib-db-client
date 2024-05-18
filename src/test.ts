import {PgDataSource, PostgresConnectionOptionsDefault} from "./postgres/pg";
import {clickhouse_beta, createClickHouseClient} from "./clickhouse/clickhouse.beta";
import {v4} from "uuid";
import {DataFormat} from "@clickhouse/client";

const exec = async () => {
    // const pg = new PgDataSource(PostgresConnectionOptionsDefault);
    // await pg.initialize()
    //
    // const res = await pg.query("select now()")
    // console.log({res});

    // https://github.com/ClickHouse/clickhouse-js/blob/main/examples/select_data_formats_overview.ts#L1
    const format: DataFormat = 'JSONEachRow'

    const res = await clickhouse_beta.query({
        query: "SELECT now();",
        //format: format
    })
    console.log({res: await (await res.json()).data});

    const obj = {
        transactions: [
            {
                v: "0x1",
                r: "0x25f48e6c7c6b00c7b049b7cc20981ec4410697d89bef0dbbc21d72909c0a2b20",
                s: "0x38053d2218876526463ffd6734a0456cb4971c811e12e31dbd2d983ae904ff00",
                nonce: "0x127",
                blockNumber: "0x1270b3b",
                from: "0x2a552844353579636085097082041a0303bb58be",
                to: "0x11fa5be01476295200cb162b952972d2c9c6c599",
                gas: "0x5208",
                gasPrice: "0xfc9b52f8e",
                input: "0x",
                transactionIndex: "0x11c",
                blockHash: "0x6b75d2527875fae899ba9dceccdfdc9132ec68b88ca6ccf66953804913929c6e",
                value: "0x482a1c7300080000",
                type: "0x2",
                cumulativeGasUsed: "0x1433e39",
                gasUsed: "0x5208",
                hash: "0xbda0ee33cfe0e687121b59e1e67bc40aeb77810ce4933152fca0d6edd3addff5",
                status: "0x1",
                blockchain: "eth",
                timestamp: "0x65e0fdc3"
            },
            {
                v: "0x1",
                r: "0x31445c4f2f9f4287a23268164f4cd85bf25f45d9e665b18ac65229477b313522",
                s: "0xf8b40df1c13de166d418feef0cffe3688788de69b8c08cae27ccf2bd6335811",
                nonce: "0x1",
                blockNumber: "0x1272689",
                from: "0x11fa5be01476295200cb162b952972d2c9c6c599",
                to: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
                gas: "0x29292",
                gasPrice: "0x1768fb4166",
                input: "0x7ff36ab500000000000000000000000000000000000000000000850320fe8e59d3a05a83000000000000000000000000000000000000000000000000000000000000008000000000000000000000000011fa5be01476295200cb162b952972d2c9c6c5990000000000000000000000000000000000000000000000000000000065e2495c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000058cb30368ceb2d194740b144eab4c2da8a917dcb",
                transactionIndex: "0x0",
                blockHash: "0x3b4b0f7b571ab02300b10a96e48e92f14c6d08ca6087604c9a3792024709b798",
                value: "0x1bc16d674ec80000",
                type: "0x2",
                cumulativeGasUsed: "0x1f315",
                gasUsed: "0x1f315",
                logs: [],
                hash: "0xa4bcede3f6c4aa982f3792f8622479a5b665f0e0cf5d677fb3e9a81d7ee5565a",
                status: "0x1",
                blockchain: "eth",
                timestamp: "0x65e2470f"
            }
        ],
        nextPageToken: "3SLRoHVUtC9wHHhrdRYkRmiZsS3Q4fx28xkdUaPt49zSEn7jCZ75hY4GnigtVrypmxGp9wgWVLxNDhVmw6QgX78imsuxYGQAxjmX786dU3duVfTYxAj1aahvfsezv5FLJnTYHzWfdZoy4rx63XSUBeEUxCowhz8",
        syncStatus: {timestamp: 1716014819, lag: "-2m", status: "synced"}
    }

    const json = JSON.stringify(obj)
    console.log({json});
    // const res2 = await clickhouse_beta.query({
    //     query: `INSERT INTO wwt.ankr_getTransactionsByAddress VALUES (now64(), '${json}')`,
    //     //format: format
    // })
    // console.log({res2});

    const res3 = await clickhouse_beta.insert({
        table: "wwt.ankr_getTransactionsByAddress",
        values: [
            { timestamp: new Date(), data: obj },
        ],
        clickhouse_settings: {
            // Allows to insert serialized JS Dates (such as '2023-12-06T10:54:48.000Z')
            date_time_input_format: 'best_effort',
        },
        format: 'JSONEachRow',
    })

}
