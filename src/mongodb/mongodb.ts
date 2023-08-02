import { MongoClient } from 'mongodb'

export const Url = {
    docker: 'mongodb://mongodb_host:27017',
    localhost: 'mongodb://localhost:27017'
}

export class MongoClientExtended extends MongoClient {}

export const mongodb_docker_client = new MongoClientExtended(Url.docker)
export const mongodb_client = new MongoClientExtended(Url.localhost)


