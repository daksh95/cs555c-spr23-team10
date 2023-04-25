import {dbConnection,closeConnection}from '../config/mongoConnection.js';
import chat from '../config/mongochatCollections.js';

export default async function insert_msg(id,msg){
    const db = await dbConnection();
    const chatcollection = await chat()
    let update = await chatcollection.updateOne(
        { customer: id},
        { $push: { messages: msg}}
      );;
    return update
}
