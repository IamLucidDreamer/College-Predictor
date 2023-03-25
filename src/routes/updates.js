const express = require('express')
const {
	createUpdates,
	updateUpdates,
	deleteUpdates,
	getUpdates,
	getAllUpdates
} = require('../controllers/updates')
const router = express.Router()

router.post('/updates/create', createUpdates)
router.put('/updates/update/:id', updateUpdates)
router.delete('/updates/delete/:id', deleteUpdates)
router.get('/updates/get/:id', getUpdates)
router.get('/updates/get-all', getAllUpdates)

module.exports = router
