const express = require('express')
const {
    neetBulkUpload,
    getAllNeetData,
    predictNeet,
    getNeetDropdownValues
} = require('../controllers/neet')
const { isAdmin, isSignedIn, isValidToken } = require('../controllers/middleware')
const router = express.Router()


router.post('/neet/bulk-upload', isSignedIn, isValidToken, isAdmin, neetBulkUpload)
router.get('/neet/get-all', isSignedIn, isValidToken, isAdmin, getAllNeetData)
router.post('/predict-neet', predictNeet)
router.post('/neet-dropdown', getNeetDropdownValues)

module.exports = router