const express = require('express')
const { mainData } = require("../controllers/statistics")
const {
	getJosaDropdownValues,
	predictJosa,
	josaBulkUpload,
	neetBulkUpload,
	predictNeet,
	getNeetDropdownValues
} = require('../controllers')
const { isAdmin, isSignedIn, isValidToken } = require('../controllers/middleware')
const { check } = require('express-validator')
const router = express.Router()

/**
 * Statistics
 */
router.get('/statistics/main', isSignedIn, isValidToken, isAdmin, mainData)


/**
 * JOSA goes here
 */
router.post('/bulk-upload/josa', josaBulkUpload)
router.post('/predict-josa', predictJosa)
router.post('/josa-dropdown', getJosaDropdownValues)

/**
 * NEET goes here
 */
router.post('/bulk-upload/neet', neetBulkUpload)
router.post('/predict-neet', predictNeet)
router.post('/neet-dropdown', getNeetDropdownValues)

module.exports = router
