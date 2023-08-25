import {mongodb_client} from "./mongodb/mongodb";
import {MongoDbClient} from "./mongodb/client";

const exec2 = async () => {
    const mongoDbClient: MongoDbClient = await MongoDbClient.connect('atr')
    const modelName = 'historical_candles'
    await mongoDbClient.add_model(modelName, 'imoex.marketdata.historical.candles')
    const model: any = await mongoDbClient.get_model(modelName)
    await model.insertMany([{ "a": 1}])
    await mongoDbClient.disconnect()
}
exec2()
const exec = async () => {

    await mongodb_client.connect().catch((err => console.log(err)));
    console.log('Connected successfully to server');
    const db = mongodb_client.db('atr');
    const collection: any = db.collection('temp');
    const findResult = await collection.find({ exchange: 'imoex' }).toArray();
    console.log('Found documents =>', findResult);

    const foods = db.collection("imoex.lob");

    const docs = [
        {
            ts: "2023-07-19 18:34:27.706",
            ticker: "ROSN",
            exchange: "imoex",
            limitUp: 60.5,
            limitDown: 55.5,
            bestAsk: 57.5,
            bestBid: 51.5,
            spread: 0.6,
            fee: 0.5,
            diff: 0.4,
            midpoint: 0.1,
            asks: [
                { quantity: 5, price: 10.5 },
                { quantity: 7, price: 16.5 }
            ],
            bids: [
                { quantity: 1, price: 0.5 },
                { quantity: 6, price: 111.5 }
            ],
            message: "err 1311111",
            figi: "uuid00-1",
            isConsistent: 1,
            depth: 50
        },
        {
            ts: "2023-07-19 18:34:27.906",
            ticker: "LKOH",
            exchange: "imoex",
            limitUp: 4200.5,
            limitDown: 55.5,
            bestAsk: 57.5,
            bestBid: 51.5,
            spread: 0.6,
            fee: 0.5,
            diff: 0.4,
            midpoint: 0.1,
            asks: [
                { quantity: 5, price: 10.5 },
                { quantity: 7, price: 16.5 }
            ],
            bids: [
                { quantity: 1, price: 0.5 },
                { quantity: 6, price: 111.5 }
            ],
            message: "err 1311111",
            figi: "uuid00-1",
            isConsistent: 1,
            depth: 50
        }
    ]

    await db.collection('imoex.lob').insertMany(docs, { ordered: true });

    //await collection.createCollection('imoex.lob')

    await mongodb_client.close();
}
//exec();