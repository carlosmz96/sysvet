'use strict'

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images'),
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.mimetype.substr(6));
    }
});

const upload = multer({ storage });

module.exports = upload;