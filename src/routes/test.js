const express = require('express')

const { createSiteData } = require('../helpers/fileHelper')
const { isAdmin, isSignedIn, isValidToken } = require('../controllers/middleware')
const router = express.Router()

router.get('/file', isSignedIn, isValidToken, isAdmin, createSiteData)

module.exports = router
