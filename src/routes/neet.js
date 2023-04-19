const express = require('express')
const {
    neetBulkUpload,
    predictNeet,
    getNeetDropdownValues
} = require('../controllers')
const { isAdmin, isSignedIn, isValidToken } = require('../controllers/middleware')
const router = express.Router()


router.post('/bulk-upload/neet', isSignedIn, isValidToken, isAdmin, neetBulkUpload)
router.post('/predict-neet', predictNeet)
router.post('/neet-dropdown', getNeetDropdownValues)

module.exports = router