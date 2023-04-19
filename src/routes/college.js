const express = require('express')
const {
	createCollege,
	updateCollege,
	deleteCollege,
	getCollege,
	getAllColleges,
	getTopColleges,
	getTopStateColleges
} = require('../controllers/college')
const { isSignedIn, isValidToken, isAdminOrCounsellorOrCollegeAdmin } = require('../controllers/middleware')
const router = express.Router()

router.post('/college/create', isSignedIn, isValidToken, isAdminOrCounsellorOrCollegeAdmin, createCollege)
router.put('/college/update/:id',isSignedIn,isValidToken, isAdminOrCounsellorOrCollegeAdmin, updateCollege)
router.delete('/college/delete/:id',isSignedIn,isValidToken, isAdminOrCounsellorOrCollegeAdmin, deleteCollege)
router.get('/college/get/:id', getCollege)
router.get('/college/get-all', getAllColleges)
router.get('/college/get-all-top', getTopColleges)
router.post('/college/get-all-top-state', getTopStateColleges)

module.exports = router
