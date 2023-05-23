const express = require('express')
const { isSignedIn, isValidToken, isAdmin } = require('../controllers/middleware')
const {
	createUpdates,
	updateUpdates,
	deleteUpdates,
	getUpdates,
	getAllUpdates
} = require('../controllers/updates')
const router = express.Router()

router.post('/updates/create', isSignedIn, isValidToken, isAdmin, createUpdates)
router.put('/updates/update/:id', isSignedIn, isValidToken, isAdmin, updateUpdates,)
router.delete('/updates/delete/:id', isSignedIn, isValidToken, isAdmin, deleteUpdates)
router.get('/updates/get/:id', getUpdates)
router.get('/updates/get-all', getAllUpdates)

module.exports = router
