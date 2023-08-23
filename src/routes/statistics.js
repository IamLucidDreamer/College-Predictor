const express = require('express')
const { mainData, callsStats } = require("../controllers/statistics")
const { isAdmin, isSignedIn, isValidToken } = require('../controllers/middleware')
const router = express.Router()

router.get('/statistics/main', isSignedIn, isValidToken, isAdmin, mainData)
router.get('/statistics/counsellor/calls', isSignedIn, isValidToken, isAdmin,callsStats)

module.exports = router
