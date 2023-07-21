import clickhouse from "./clickhouse/clickhouse";
import {clickhouse_beta} from "./clickhouse/clickhouse.beta";

const data = [{
    ts: '2023-07-19 18:34:27.706',
    exchange: 'imoex',
    message: 'err 1311111',
},{
    ts: '2023-07-19 18:36:27.706',
    exchange: 'imoex',
    message: 'err 1311111',
}]

const lob: any[] = [{
    ts: '2023-07-19 18:34:27.706',
    ticker: 'mgnt',
    exchange: 'imoex',
    limitUp: 60.5,
    limitDown: 55.5,
    bestAsk: 57.5,
    bestBid: 51.5,
    spread: 0.6,
    fee: 0.5,
    diff: 0.4,
    midpoint: 0.1,
    //asks: [5, 10.5 , 7, 16.5 ],
    //
    //bids: [5, 10.5 , 7, 16.5 ],
    //bids: [[5, 10.5], [7, 16.5] ],
    //asks: [[5, 10.5], [7, 16.5] ],
    asks: [{ quantity: 1, price: 0.5 }, { quantity: 6, price: 111.5 }],
    bids: [{ quantity: 1, price: 0.5 }, { quantity: 6, price: 111.5 }],
    message: 'err 1311111',
    figi: 'uuid00-1',
    isConsistent: 1,
    depth: 50
}]

async function insertData<T>(table: string, data: T[]) {
    const values = data.map((v, i) => ({ ...v, id: i + 1 }))
    console.log(values);
    await clickhouse_beta.insert({
        table,
        values,
        format: 'JSONEachRow',
    })
}

const main = async () => {
    // const resp = await clickhouse.query('select now()').toPromise();
    // console.log(resp);
    //
    // const result = await clickhouse.insert_rows(
    //     'atr_cex_tinkoff_investments_v2.errors', data
    //
    // ).toPromise();

    //console.info(await clickhouse_beta.ping())
    // await clickhouse_beta.exec({
    //     query: 'set flatten_nested=0;'
    // })

    const resultSet2 = await clickhouse_beta.query({
        query: `
        SELECT name,value,changed
    FROM system.settings
    WHERE name LIKE '%flatten_nested%'
        `
    })
    const dataset2 = await resultSet2.json()
    console.table(dataset2.data);


    const resultSet3 = await clickhouse_beta.query({
        query: `describe table atr_cex_tinkoff_investments_v2.orderbook`
    })
    const dataset3 = await resultSet3.json()
    console.table(dataset3.data);

    //await insertData('atr_cex_tinkoff_investments_v2.orderbook', lob)
//console.log(111);
    await clickhouse_beta.insert({
        table: 'atr_cex_tinkoff_investments_v2.orderbook',
        // structure should match the desired format, JSONEachRow in this example
        values: lob,
        format: 'JSONEachRow',
    })


    const resultSet = await clickhouse_beta.query({
        query: 'select * from atr_cex_tinkoff_investments_v2.orderbook',
        format: 'JSONEachRow',
    })
    const dataset = await resultSet.json()

    console.log(dataset);
}
main().catch(error => console.error(error));