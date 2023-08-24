import {Schema} from "mongoose";
import * as mongoose from "mongoose";
import {Uri} from "./uri";
import {emptySchema} from "./schema";


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
    }

    public static async connect(dbName: string,): Promise<MongoDbClient | undefined> {
        const mongoDbClient = new MongoDbClient(dbName)
        mongoose.connect(mongoDbClient.mongoUri, {
            dbName: mongoDbClient.dbName
        }).catch(err => console.log(err));
        return mongoDbClient
    }

    async add_model(
        modelName: string,
        collectionName: string,
        schema: any = emptySchema
    ) {
        const model = await this.create_model(collectionName, schema)
        this.models.set(modelName, model)
    }

    async get_model(modelName: string) {
        return this.models.get(modelName)

    }

    async create_model(
        collectionName: string,
        schema: any = emptySchema
    ): Promise<any> {
        return mongoose.model(collectionName, schema);
    }

    async disconnect() {
        mongoose.disconnect()
    }

}