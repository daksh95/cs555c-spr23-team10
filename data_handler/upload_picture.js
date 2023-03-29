import { ObjectId } from "mongodb";
import projects from '../config/mongoCollections.js';

export default async function uploadpictures(projectId, filepaths) {
    const projectcollection = await projects();
    let success = await projectcollection.findOneAndUpdate(
        {_id: new ObjectId(projectId)},
        {$push: {images: {$each: filepaths}}}
    );
    return success;
}