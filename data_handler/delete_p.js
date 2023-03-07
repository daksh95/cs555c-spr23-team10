import {dbConnection,closeConnection}from '../config/mongoConnection.js';
import projects from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

export default async function main(id){
    const db = await dbConnection();
    const projectcollection = await projects()
    let project = await projectcollection.findOneAndDelete({
        _id: new ObjectId(id)
      });
    return project
}
