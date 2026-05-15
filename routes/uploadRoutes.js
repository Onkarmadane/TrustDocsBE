const express = require('express');
const router = express.Router();
const { upload } = require('../utils/upload');
const { uploadImage } = require('../controllers/uploadController');

router.post('/', upload.single('image'), uploadImage);

module.exports = router;
