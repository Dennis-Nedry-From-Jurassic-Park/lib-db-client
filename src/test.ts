import {PgDataSource, PostgresConnectionOptionsDefault} from "./postgres/pg";

const exec = async () => {
    const pg = new PgDataSource(PostgresConnectionOptionsDefault);
    await pg.initialize()

    const res = await pg.query("select now()")
    console.log({res});
}