import clickhouse from "./clickhouse/clickhouse";

const data = [{
    ts: '2023-07-19 18:34:27.706',
    exchange: 'imoex',
    message: 'err 1311111',
},{
    ts: '2023-07-19 18:36:27.706',
    exchange: 'imoex',
    message: 'err 1311111',
}]

const lob = [{
    ts: '2023-07-19 18:34:27.706',
    ticker: 'POLY',
    exchange: 'imoex',
    limitUp: 60.5,
    limitDown: 55.5,
    bestAsk: 57.5,
    bestBid: 51.5,
    spread: 0.6,
    fee: 0.5,
    diff: 0.4,
    midpoint: 0.1,
    asks: [{ quantity: 5, price: 10.5 }, { quantity: 7, price: 16.5 }],
    bids: [{ quantity: 1, price: 0.5 }, { quantity: 6, price: 111.5 }],
    message: 'err 1311111',
    figi: 'uuid00-1',
    isConsistent: 1,
    depth: 50
}]

const main = async () => {
    const resp = await clickhouse.query('select now()').toPromise();
    console.log(resp);

    const result = await clickhouse.insert_rows(
        'atr_cex_tinkoff_investments_v2.errors', data

    ).toPromise();

    console.log(result);
}
main().catch(error => console.error(error));