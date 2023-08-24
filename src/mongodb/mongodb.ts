import { MongoClient } from 'mongodb'
import {Uri} from "./uri";

export class MongoClientExtended extends MongoClient {}

export const mongodb_docker_client = new MongoClientExtended(Uri.docker)
export const mongodb_client = new MongoClientExtended(Uri.localhost)


