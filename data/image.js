const mongoCollections = require('../config/mongoCollections');
const image = mongoCollections.image;
const {exec} = require("child_process");
const path = require('path')
// image = {
//     _id: String,
//     id(userId or classesId or whatever Id that is used when save to database): String,
//     type(user  |   class   |   ...): String,
//     imagePath: String
// }


const imageMagick = (imagePath, type) => {

    if (type === 'user') {
        let command;
        if(process.platform === "win32"){
            command = `magick convert ${imagePath} -resize 128x128! ${imagePath}`
        }else{
            command = `magick convert ${imagePath} -resize 128x128//! ${imagePath}`
        }
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
        })
    }
    if (type === 'class') {
        let command;
        if(process.platform === "win32"){
            command = `magick convert ${imagePath} -resize 256x256! ${imagePath}`
        }else {
            command = `magick convert ${imagePath} -resize 256x256! ${imagePath}`
        }
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
        })
    }

}

module.exports = {
    async addImage(id, imagePath, type) {
        imagePath = path.join(appRoot, imagePath);
        let imageCollection = await image();
        let newImage = {
            id: id,
            type: type,
            imagePath: imagePath
        }
        const insertInfo = await imageCollection.insertOne(newImage);
        if (insertInfo.insertedCount === 0) throw 'Can not add img';
        imageMagick(imagePath, type)
        return true;
    },
    async getImageByIdAndType(id, type){
        let imageCollection = await image();
        const photo = await imageCollection.findOne({ id: id, type:type});
        if (photo === null) throw 'img given id and type do not exist';
        return photo;
    },
    async deleteImageByIdAndType(id, type){
        let imageCollection = await image();
        const deleteResult = await imageCollection.deleteOne({ id: id, type:type});
        if (deleteResult.n === 0) throw 'img given id and type do not exist';
        return true;
    }
}

