const express = require('express')
const router = express.Router()
const { check, body } = require('express-validator')
const { sendOTP, signup, signin, signout, forgotPassword, update, saveExpoToken } = require('../controllers/auth')
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

		check('password')
			.isLength({ min: 1 })
			.withMessage('Password field is required')
	],
	signin
)

router.post('/forgot-password',
	[
		check('newPassword')
			.isLength({ min: 8 })
			.withMessage('New Password length should be minimum of 8 characters'),
		check('phoneNumber')
			.isMobilePhone()
			.withMessage('Please provide a valid Phone Number!'),
		check('otp')
			.isLength({ min: 4 })
			.withMessage('OTP Length should be 4 digits')
	],
	body('confirmPassword').custom((value, { req }) => {
		if (value !== req.body.newPassword) {
			throw new Error('Confirmation Password does not match password');
		}
		// Indicates the success of this synchronous custom validator
		return true;
	}),
	forgotPassword)

router.put(
	'/user/update',
	[check('id').isUUID().withMessage('Please Provide id')],
	isSignedIn,
	isValidToken,
	update
)

router.put(
	'/user/update/expo-token',
	[check('id').isUUID().withMessage('Please Provide id')],
	isSignedIn,
	isValidToken,
	saveExpoToken
)

router.get('/signout', signout)

module.exports = router
