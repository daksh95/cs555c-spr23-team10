import {dbConnection,closeConnection}from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';
import projects from '../config/mongoCollections.js';
import statusMap from './statusMap.js';
import users from './users.js'


export default async function main(ob){
    // console.log(ob)
    const db = await dbConnection();
    const projectcollection = await projects()
    ob.statusId = 0;
    ob.status = statusMap[ob.statusId].status;
    const date = new Date();
    const date_string = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    ob.images = [];
    ob.timeline = [{statusId: 0, status: "Created", start: date_string}];
    let project = await projectcollection.insertOne(ob);
    return project
}