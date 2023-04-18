const express = require('express')
const { addSubscriber, getAllSubscribers } = require("../controllers/subscriber")
const { isAdmin, isSignedIn, isValidToken } = require('../controllers/middleware')
const { check } = require('express-validator')
const router = express.Router()

router.post('/subscriber/create', [check('email').isEmail().withMessage('Please provide a valid E-Mail!')], addSubscriber)
router.get('/subscriber/get-all', isSignedIn, isValidToken, isAdmin, getAllSubscribers)

module.exports = router