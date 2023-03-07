import {dbConnection,closeConnection}from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';
import projects from '../config/mongoCollections.js';
import users from './users.js'

export default async function main(ob){
    console.log(ob)
    const db = await dbConnection();
    const projectcollection = await projects()
    let project = await projectcollection.insertOne(ob);
    return project
}
