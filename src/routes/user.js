const express = require('express')
const router = express.Router()

const { getUserById, getAllUsers } = require('../controllers/user')
const {
	isSignedIn,
	isAdmin,
	isValidToken,
	isCounsellorOrAdmin
} = require('../controllers/middleware')

router.get('/user/get/:id', isSignedIn, isValidToken, isCounsellorOrAdmin, getUserById)
router.get('/user/get-all', isSignedIn, isValidToken, isCounsellorOrAdmin, getAllUsers)

module.exports = router
