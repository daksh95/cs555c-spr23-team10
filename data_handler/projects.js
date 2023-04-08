import {dbConnection,closeConnection}from '../config/mongoConnection.js';
import projects from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import users from './users.js'

export default async function main(){
    const db = await dbConnection();
    const projectcollection = await projects()
    let projectslist = await projectcollection.find({}).toArray();
    for (let i in projectslist) {
        let user = users.find(user => user._id.toString() === projectslist[i].customer)
        projectslist[i].customerName = user.name;
        // projectslist[i].customerAddress = user.address;
    }
    return projectslist
}