const express = require('express')
const {
	createCollege,
	updateCollege,
	deleteCollege,
	getCollege,
	getAllColleges
} = require('../controllers/college')
const router = express.Router()

router.post('/college/create', createCollege)
router.put('/college/update/:id', updateCollege)
router.delete('/college/delete/:id', deleteCollege)
router.get('/college/get/:id', getCollege)
router.get('/college/get-all', getAllColleges)

module.exports = router
