const express = require('express');
const router = express.Router();
const data = require('../data');
const multer = require('multer');
const util = require('util')
const imageData = data.image;
const fs = require("fs")
const imageRootDir = './photos'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(imageRootDir)) {
            fs.mkdirSync(imageRootDir)
        }
        cb(null, imageRootDir)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = util.promisify(multer({storage: storage}).single('file'))

router.post("/upload", async (req, res) => {
    upload(req, res, async (e) => {
        if (e) {
            res.status(500).json({
                error: true,
                errors: e,
                logged: true,
                data: null
            });
        } else {
            try {
                await imageData.addImage(req.body.id, req.file.path, req.body.type)
                res.status(200).json({
                    error: false,
                    errors: null,
                    logged: true,
                    data: null
                });
            } catch (e) {
                res.sendStatus(500).json({
                    error: true,
                    errors: e,
                    logged: true,
                    data: null
                });
            }
        }
    })
})

router.get("/get", async (req, res) => {
    try {
        let id = req.query.id;
        let type = req.query.type;
        let image = await imageData.getImageByIdAndType(info.id, info.type);
        let imagePath = image.imagePath;
        res.status(200).sendFile(imagePath);
    } catch (e) {
        res.status(404).json({
            error: true,
            errors: e,
            logged: true,
            data: null
        });
    }
})

router.post("/update", async (req, res) => {
    upload(req, res, async (e) => {
        if (e) {
            res.status(500).json({
                error: true,
                errors: e,
                logged: true,
                data: null
            });
        } else {
            try {
                let image = await imageData.getImageByIdAndType(req.body.id, req.body.type);
                let imagePath = image.imagePath;
                await fs.unlinkSync(imagePath);
                await imageData.deleteImageByIdAndType(req.body.id, req.body.type);
                await imageData.addImage(req.body.id, req.file.path, req.body.type)
                res.status(200).json({
                    error: false,
                    errors: null,
                    logged: true,
                    data: null
                });
            } catch (e) {
                res.sendStatus(500).json({
                    error: true,
                    errors: e,
                    logged: true,
                    data: null
                });
            }
        }
    })
})

module.exports = router;