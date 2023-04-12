import { ObjectId } from "mongodb";
import projects from '../config/mongoCollections.js';

export default async function uploadpictures(projectId, filepaths) {
    const projectcollection = await projects();
    for (let i in filepaths) {
        filepaths[i] = filepaths[i].replace('public', '');
    }
    let success = await projectcollection.findOneAndUpdate(
        {_id: new ObjectId(projectId)},
        {$push: {images: {$each: filepaths}}}
    );
    return success;
}