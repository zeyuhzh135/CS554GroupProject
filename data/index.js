const userData = require("./users");
const classesData = require("./classes");
const privateMsgData = require("./privateMsg")
const groupMsgData = require("./groupMsg")
const imageData = require("./image")

module.exports = {
    classes: classesData,
    users: userData,
    privateMsg: privateMsgData,
    groupMsg: groupMsgData,
    image: imageData
};