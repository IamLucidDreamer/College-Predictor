const express = require('express')
const { createFollowUp, getAllFollowUpsOfAUser, updateUserCounsellor } = require("../controllers/userFollowUp")
const { isAdmin, isSignedIn, isValidToken, isCounsellorOrAdmin } = require('../controllers/middleware')
const router = express.Router()

router.post('/user/follow-up/create', isSignedIn, isValidToken, isCounsellorOrAdmin, createFollowUp)
router.get('/user/follow-up/get-all/:userId', isSignedIn, isValidToken, isCounsellorOrAdmin, getAllFollowUpsOfAUser)
router.post('/user/follow-up/create/:userId', isSignedIn, isValidToken, isCounsellorOrAdmin, updateUserCounsellor)

module.exports = router