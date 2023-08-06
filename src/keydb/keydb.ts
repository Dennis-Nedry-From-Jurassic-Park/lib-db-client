//import { createClient } from 'redis';

//export const url = process.env.REDIS_URL || 'redis://localhost:6379';

//console.log("url="+url);
//process.stdout.write(`${url} is running on: http://localhost`);

// export const keydb_client: any = createClient({
//     url,
//     legacyMode: true,
// });
//
// keydb_client.on('error', (err) => console.log('KeyDB Client Error: ', err));
//
// keydb_client
//     .connect()
//     .then((it) => {
//         //const keys = it.
//         //console.log();
//         console.log("url2=" + url)
//     })
//     .catch(err => {
//         console.log("url="+url)
//         console.log(err)
//     });



// const key = `atr:cex:ti:logs:${ticker}:${ts}`
// await client.set(key, JSON.stringify(mergedObj));
// const value = await client.get(key);
// await client.disconnect();