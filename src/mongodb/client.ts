import {Schema} from "mongoose";
import * as mongoose from "mongoose";
import {Uri} from "./uri";
import {schema} from "./schema";


export class MongoDbClient {
    private dbName: string
    private mongoUri: string
    private models: Map<string, any>
    constructor(
        dbName: string,
        mongoUri: string = Uri.localhost
    ) {
        this.dbName = dbName
        this.mongoUri = mongoUri
        this.models = new Map<string, any>()

        mongoose.connect(this.mongoUri, {
            dbName: this.dbName
        }).catch(err => console.log(err));
    }

    async create_model(
        collectionName: string,
        schema: any = schema
    ): Promise<any> {
        return mongoose.model(collectionName, schema);
    }

    async disconnect() {
        mongoose.disconnect()
    }

}