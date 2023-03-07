import {dbConnection,closeConnection}from '../config/mongoConnection.js';
import projects from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

export default async function main(id){
    const db = await dbConnection();
    const projectcollection = await projects()
    let project = await projectcollection.findOne({_id: new ObjectId(id)});
    return project
}

const getProjectById = async (id) => {
    const db = await dbConnection();
    const projectcollection = await projects();
    let project = await projectcollection.findOne({_id: new ObjectId(id)});
    return project;
};

const getProjectByCust = async (id) => {
    const db = await dbConnection();
    const projectcollection = await projects()
    let project = await projectcollection.findOne({_id: new ObjectId(id)});
    return project
};

