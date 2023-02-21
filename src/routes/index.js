const express = require('express')
const { bulkUpload } = require('../controllers')
const router = express.Router()

router.post('/bulk-upload', bulkUpload)

module.exports = router
