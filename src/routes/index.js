const express = require('express')
const {
	getJosaDropdownValues,
	predictJosa,
	josaBulkUpload,
	neetBulkUpload,
	predictNeet,
	getNeetDropdownValues
} = require('../controllers')
const router = express.Router()

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
