const userModel = require('../models/user.js')
const jwt = require('jsonwebtoken')

const { validationResult: validate } = require('express-validator')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const twilioAccountSID = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const twilioServiceSID = process.env.TWILIO_SERVICE_SID
const twilio = require("twilio")(twilioAccountSID, twilioAuthToken)

const sendOTP = async (req, res) => {
	const errors = validate(req) || []
	if (!errors.isEmpty()) {
		return res.status(SC.WRONG_ENTITY).json({
			status: SC.WRONG_ENTITY,
			error: errors.array()[0]?.msg
		})
	}
	const { phoneNumber } = req.body
	try {
		twilio.verify.v2.services(twilioServiceSID)
			.verifications
			.create({ to: phoneNumber, channel: 'sms' })
			.then(verification => res.status(SC.OK).json({
				status: SC.OK,
				message: `OTP send successfully to ${phoneNumber}`,
				data: verification
			})).catch(err => {
				res.status(err.status || SC.INTERNAL_SERVER_ERROR).json({
					status: err.status,
					err: { err },
				})
			})
	}
	catch (err) {
		logger(err)
	}
	finally {
		logger("OTP API Called")
	}
}

const signup = async (req, res) => {
	const errors = validate(req) || []
	if (!errors.isEmpty()) {
		return res.status(SC.WRONG_ENTITY).json({
			error: errors.array()[0].msg
		})
	}
	const { email, phoneNumber } = req.body
	try {
		userModel.findOne({
			$or: [
				{ email: email },
				{ phoneNumber: phoneNumber }
			]
		}).exec((err, user) => {
			if (err || user) {
				return res.status(SC.WRONG_ENTITY).json({
					error: 'E-Mail or Phone Number already has been registered!',
					suggestion: 'Try using some other E-mail or Phone Number.'
				})
			} else {
				const user = new userModel(req.body)
				user.save((err, user) => {
					if (err) {
						return res.status(SC.BAD_REQUEST).json({
							err: err,
							error: 'Failed to add user in DB!'
						})
					}
					
					const expiryTime = new Date()
					expiryTime.setMonth(expiryTime.getMonth() + 6)
					const exp = parseInt(expiryTime.getTime() / 1000)
					const token = jwt.sign({ _id: user._id, exp: exp }, process.env.SECRET)
					res.cookie('Token', token, { expire: new Date() + 9999 })
					user.salt = undefined
					user.__v = undefined

					res.status(SC.OK).json({
						message: 'User Signed Up, Successfully!',
						data: user,
						token : token
					})
				})
			}
		})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger(`User Signed Up Sucessfully using Email - ${email , phoneNumber}`)
	}
}

const signin = async (req, res) => {
	const errors = validate(req)
	if (!errors.isEmpty()) {
		return res.status(SC.WRONG_ENTITY).json({
			error: errors.array()[0].msg
		})
	}
	const { email, password } = req.body
	try {
		await userModel.findOne({ email }, (err, user) => {
			if (err || !user) {
				return res.status(SC.NOT_FOUND).json({
					error: "E-Mail doesn't exist in DB!"
				})
			}
			if (!user.authenticate(password)) {
				return res.status(SC.UNAUTHORIZED).json({
					error: 'Oops!, E-mail and Password does not match!'
				})
			}

			const expiryTime = new Date()
			expiryTime.setMonth(expiryTime.getMonth() + 6)
			const exp = parseInt(expiryTime.getTime() / 1000)
			const token = jwt.sign(
				{ _id: user._id, exp: exp },
				process.env.SECRET || 'college-predictor'
			)
			res.cookie('Token', token, { expire: new Date() + 9999 })
			user.salt = undefined
			user.__v = undefined
			return res.status(SC.OK).json({
				message: 'User Logged in Successfully!',
				token,
				user
			})
		})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger(`User Signed in - ${email}`)
	}
}

const signout = (_, res) => {
	res.clearCookie('Token')
	res.status(SC.OK).json({
		message: 'User Signed Out Sucessfully!'
	})
}

const update = async (req, res) => {
	const id = req.auth._id
	try {
		await userModel.findOne({ _id: id }).exec((err, data) => {
			if (err || !data) {
				return res.status(SC.NOT_FOUND).json({
					error: 'User Not Found!'
				})
			}
			userModel
				.updateOne(
					{ _id: id },
					{
						$set: req.body
					}
				)
				.then(() => {
					res.status(SC.OK).json({
						message: 'User Updated Successfully!'
					})
				})
				.catch(err => {
					res.status(SC.INTERNAL_SERVER_ERROR).json({
						error: 'User Updation Failed!'
					})
					logger(err, 'ERROR')
				})
		})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('User Update Function is Executed')
	}
}

module.exports = {
	sendOTP,
	signup,
	signin,
	signout,
	update
}
