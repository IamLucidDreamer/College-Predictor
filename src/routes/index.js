const express = require('express')
const { bulkUpload, predictJosa } = require('../controllers')
const router = express.Router()

router.post('/bulk-upload', bulkUpload)
router.post('/predict-josa', predictJosa)

module.exports = router
