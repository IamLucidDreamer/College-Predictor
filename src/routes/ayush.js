const express = require('express')
const {
    ayushBulkUpload,
    deleteAyushValues,
    getAllAyushData,
    getAyushDropdownValues,
    predictAyush
} = require('../controllers/ayush')
const { isAdmin, isSignedIn, isValidToken } = require('../controllers/middleware')
const router = express.Router()


router.post('/ayush/bulk-upload', isSignedIn, isValidToken, isAdmin, ayushBulkUpload)
router.get('/ayush/get-all', isSignedIn, isValidToken, isAdmin, getAllAyushData)
router.post('/ayush/delete', isSignedIn, isValidToken, isAdmin, deleteAyushValues)
router.post('/predict-ayush', predictAyush)
router.post('/ayush-dropdown', getAllAyushData)


module.exports = router