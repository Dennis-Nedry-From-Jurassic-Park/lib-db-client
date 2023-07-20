import {ClickHouse, QueryCursor} from "clickhouse";
import {v4} from "uuid";

export class ClickHouseExtended extends ClickHouse {
	constructor(
		url: string = 'localhost', // clickhouse
		debug: boolean = false,
		raw: boolean = false,

	){
		super({
			url: 'http://' + url, // http://localhost:8123
			port: 8123, // Port 9000 is for clickhouse-client program.
			debug: debug,
			basicAuth: {
				username: 'default',
				password: '',
			},
			usePost: true,
			isUseGzip: false,
			trimQuery: false,
			format: 'json',
			raw: raw,
			config: {
				session_id                              : v4(),
				session_timeout                         :  0,
				output_format_json_quote_64bit_integers :  0,
				enable_http_compression                 :  0, // select * from system.query_log
				database                                : '', // show tables from system
				log_queries								:  0, // профилирование запросов, результат смотреть в system.log_queries
				//max_execution_time: 300,
				max_query_size: 10000000000000,
				max_parser_depth: 10000000000000,
				max_bytes_to_read: 10000000000000,
				max_rows_to_read: 10000000000000,
				http_max_field_value_size: 10000000000000,
				//min_insert_block_size_rows: 100000,
				max_insert_block_size : 100000,
				//read_backoff_max_throughput: 1000000000
				// read_backoff_min_latency_ms: 100000
				// max_insert_threads: 8,
				// max_threads: 8,
			}
		});
	}

	query(query: String, reqParams?: object): QueryCursor {
		try {
			clickhouse.sessionId = v4();
			return super.query(query, reqParams)
		} catch(error:any){}

		return QueryCursor.prototype
	}

	insert_rows(table: String, rows: any[], reqParams?: object): QueryCursor {
		let query = `INSERT INTO ${table} (*) VALUES `
		for(const row of rows) {
			const values: any[] = Object.values(row);

			query += "("

			for(const value of values) {
				query += "'" + value + "',"
			}
			query = query.slice(0, -1)
			query += "),"
		}
		query.slice(0, -1)
		console.log(query);
		try {
			clickhouse.sessionId = v4();
			return super.query(query, reqParams)
		} catch(error:any){}

		return QueryCursor.prototype
	}

	logQueries = async (queries:any[] = [1,2]) => {
		clickhouse.sessionId = v4();
		
		for(const query of queries) {
			try {
				const resp = await clickhouse.query(query).toPromise();
				console.log(resp);
			} catch(error:any){
			}
		}
	};
}

const clickhouse = new ClickHouseExtended();
export const clickhouse_localhost = new ClickHouseExtended('localhost', false, false);

export default clickhouse;