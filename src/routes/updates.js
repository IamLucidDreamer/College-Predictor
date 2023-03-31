const express = require('express')
const { isSignedIn, isValidToken } = require('../controllers/middleware')
const {
	createUpdates,
	updateUpdates,
	deleteUpdates,
	getUpdates,
	getAllUpdates
} = require('../controllers/updates')
const router = express.Router()

router.post('/updates/create',isSignedIn , isValidToken, createUpdates)
router.put('/updates/update/:id', updateUpdates)
router.delete('/updates/delete/:id', deleteUpdates)
router.get('/updates/get/:id', getUpdates)
router.get('/updates/get-all', getAllUpdates)

module.exports = router
