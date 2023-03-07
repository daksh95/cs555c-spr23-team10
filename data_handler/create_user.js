import {dbConnection,closeConnection}from '../config/mongoConnection.js';
import users from '../config/mongouserCollections.js';

export default async function main(ob){
    const db = await dbConnection();
    const usercollection = await users()
    let userslist = await usercollection.insertOne(ob);
    return userslist;
}