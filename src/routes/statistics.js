const express = require('express')
const { mainData, callsStats, refStats } = require("../controllers/statistics")
const { isAdmin, isSignedIn, isValidToken } = require('../controllers/middleware')
const router = express.Router()

router.get('/statistics/main', isSignedIn, isValidToken, isAdmin, mainData)
router.get('/statistics/counsellor/calls', isSignedIn, isValidToken, isAdmin, callsStats)
router.get('/statistics/referral', isSignedIn, isValidToken, isAdmin, refStats)

module.exports = router
