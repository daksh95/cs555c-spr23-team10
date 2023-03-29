import {dbConnection,closeConnection}from '../config/mongoConnection.js';
import projects from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';


export default async function namechange(id,name){
    const db = await dbConnection();
    const projectcollection = await projects()
    let success = await projectcollection.findOneAndUpdate({_id: new ObjectId(id)},{$set:{name:name}})
    return success
}