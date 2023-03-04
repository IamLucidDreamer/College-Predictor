const express = require('express')
const router = express.Router()

const { getUserById, getAllUsers } = require('../controllers/user')
const {
	isSignedIn,
	isAdmin,
	isValidToken
} = require('../controllers/middleware')

router.get('/user/get/:id', getUserById)
router.get('/user/get-all', isSignedIn, isValidToken, isAdmin, getAllUsers)

module.exports = router
