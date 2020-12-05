const express = require('express');
const router = express.Router();
const data = require('../data');
const classData = data.classes;
const userData = data.users;
const { ObjectId } = require('mongodb');
const xss = require('xss');

router.get("/",async(req,res)=>{
    res.status(500).json({a:"123"})
})
module.exports = router;