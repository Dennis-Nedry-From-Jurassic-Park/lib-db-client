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

const main = async () => {
    const resp = await clickhouse.query('select now()').toPromise();
    console.log(resp);

    const result = await clickhouse.insert_rows(
        'atr_cex_tinkoff_investments_v2.errors', data

    ).toPromise();

    console.log(result);
}
main().catch(error => console.error(error));