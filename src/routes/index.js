const express = require('express')
const { bulkUpload, predictJosa, getDropdownValues } = require('../controllers')
const router = express.Router()

router.post('/bulk-upload', bulkUpload)
router.post('/predict-josa', predictJosa)
router.post('/josa-dropdown', getDropdownValues)

module.exports = router
