import {dbConnection,closeConnection}from '../config/mongoConnection.js';
import chat from '../config/mongochatCollections.js';
import {ObjectId} from 'mongodb';

export default async function getmsg(id){
    const db = await dbConnection();
    const chatcollection = await chat();
    let c = await chatcollection.findOne({support_id: id})
    return c.messages;
};