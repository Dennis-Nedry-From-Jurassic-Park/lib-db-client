import {Schema} from "mongoose";
import * as mongoose from "mongoose";

export const MONGO_URI = 'mongodb://127.0.0.1:27017'
export const emptySchema: any = new Schema({}, {strict: false});

export class MongoDbClient {
    private dbName: string
    private mongoUri: string
    constructor(
        dbName: string,
        mongoUri: string = MONGO_URI
    ) {
        this.dbName = dbName
        this.mongoUri = mongoUri

        mongoose.connect(this.mongoUri, {
            dbName: this.dbName
        }).catch(err => console.log(err));
    }

    async disconnect() {
        mongoose.disconnect()
    }

}