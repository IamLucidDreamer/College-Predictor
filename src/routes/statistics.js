const express = require('express')
const { mainData } = require("../controllers/statistics")
const { isAdmin, isSignedIn, isValidToken } = require('../controllers/middleware')
const router = express.Router()

router.get('/statistics/main', isSignedIn, isValidToken, isAdmin, mainData)

module.exports = router
