import {dbConnection,closeConnection}from '../config/mongoConnection.js';
import chat from '../config/mongochatCollections.js';

export default async function main(ob){
    const db = await dbConnection();
    const chatcollection = await chat()
    let success = await chatcollection.insertOne(ob);
    return success;
}