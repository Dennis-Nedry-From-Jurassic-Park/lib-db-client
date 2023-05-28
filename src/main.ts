import clickhouse from "./clickhouse/clickhouse";

const main = async () => {
    console.log(111);
    const resp = await clickhouse.query('select now()').toPromise();
    console.log(resp);
}
main().catch(error => console.error(error));