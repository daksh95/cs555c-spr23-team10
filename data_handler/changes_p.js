import {dbConnection,closeConnection} from '../config/mongoConnection.js';
import projects from '../config/mongoCollections.js';
import statusMap from './statusMap.js';
import { ObjectId } from 'mongodb';


export default async function statuschange(id,currStatusId,newStatusId){
    if (currStatusId === newStatusId) return true;
    const db = await dbConnection();
    const projectcollection = await projects()

    let project = await projectcollection.findOne({_id: new ObjectId(id)});

    newStatusId = parseInt(newStatusId);
    const newStatus = statusMap[newStatusId].status;
    const date = new Date();
    const date_string = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    let projectTimeline = project.timeline;
    projectTimeline[currStatusId].end = date_string;
    projectTimeline.push({statusId: newStatusId, status: newStatus, start: date_string});

    let newProject = {
        statusId: newStatusId,
        status: newStatus,
        timeline: projectTimeline
    };

    let success = await projectcollection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {$set: newProject }
        )
    return success;
}