const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const { sendOTP, signup, signin, signout, update } = require('../controllers/auth')
const { isSignedIn, isValidToken } = require('../controllers/middleware')

router.post(
	'/send-otp',
	[
		check('phoneNumber').isMobilePhone().withMessage('Please provide a valid Phone Number!'),
	],
	sendOTP
)

router.post(
	'/signup',
	[
		check('name').isLength({ min: 3 }).withMessage('Name length should be minimum of 3 characters'),
		check('email').isEmail().withMessage('Please provide a valid E-Mail!'),
		check('phoneNumber').isMobilePhone().withMessage('Please provide a valid Phone Number!'),
		check('countryCode').isLength({ min: 1 }).withMessage("Please Select Country Code"),
		check("examType").isLength({ min: 1 }).withMessage("Please Select Exam Type"),
		check("otp").isLength({ min: 6 }).withMessage("Please Provide Valid OTP"),
		check('password')
			.isLength({ min: 8 })
			.withMessage('Password length should be minimum of 8 characters')
	],
	signup
)

router.post(
	'/signin',
	[
		check('email').isEmail().withMessage('Please provide a valid E-Mail!'),
		check('password')
			.isLength({ min: 1 })
			.withMessage('Password field is required')
	],
	signin
)

router.put(
	'/user/update',
	[check('id').isUUID().withMessage('Please Provide id')],
	isSignedIn,
	isValidToken,
	update
)

router.get('/signout', signout)

module.exports = router
