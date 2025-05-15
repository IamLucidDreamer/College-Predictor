const userModel = require('../models/user.js')
const jwt = require('jsonwebtoken')
const { validationResult: validate } = require('express-validator')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger, loggerUtil } = require('../utils/logger')
const formidable = require('formidable')
// const admin = require('firebase-admin');
const { createSiteData } = require('../helpers/fileHelper.js')
const axios = require("axios")


// Initialize Firebase Admin SDK
// const serviceAccount = require('../config/test-careerkick-otp-firebase-adminsdk-s8ncv-392336a3ab.json');
// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// });

// const otpCode = generateOtp() // Replace with your OTP code generation logic

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
	const errors = validate(req) || [];
	if (!errors.isEmpty()) {
		return res.status(SC.WRONG_ENTITY).json({
			status: SC.WRONG_ENTITY,
			error: errors.array()[0]?.msg
		});
	}

	const { email, countryCode, phoneNumber, otp } = req.body;

	try {
		if (otp == 12345678) {
			userModel.find({
				$or: [
					{ email },
					{ phoneNumber }
				]
			}).exec((err, userInit) => {
				if (err) {
					return res.status(SC.BAD_REQUEST).json({
						status: SC.BAD_REQUEST,
						error: "Something went wrong"
					});
				}
				if (userInit.length !== 0) {
					return res.status(SC.BAD_REQUEST).json({
						status: SC.BAD_REQUEST,
						error: "Email or Phone Number already registered."
					});
				}

				const user = new userModel(req.body);
				user.save()
					.then(async user => {
						const expiryTime = new Date();
						expiryTime.setMonth(expiryTime.getMonth() + 6);
						const exp = parseInt(expiryTime.getTime() / 1000);
						const token = jwt.sign(
							{ _id: user._id, exp },
							process.env.SECRET || 'college-predictor'
						);

						res.cookie('Token', token, { expire: new Date() + 9999 });

						// Hide sensitive fields
						user.salt = undefined;
						user.__v = undefined;

						// ✅ Create LMS Lead
						try {
							await axios.post('https://lms.ntechzy.in/api/v1/form', {
								guardianName: req.body.guardianName || "N/A",
								district: req.body.district || "N/A",
								state: user.state || req.body.state || "N/A",
								name: user.name,
								whatsappNumber: req.body.whatsappNumber || user.phoneNumber,
								courseSelected: user.course || "N/A",
								source: req.body.source || "college-predictor",
								sourceId: req.body.sourceId || req.headers.referer || "N/A",
								preferredCollege: req.body.preferredCollege || "N/A",
								contactNumber: user.phoneNumber,
								email: user.email,
								neetScore: req.body.medicalMarks || 0,
								neetAIR: req.body.neetAIR || 0
							});
						} catch (lmsErr) {
							console.error("LMS lead creation failed:", lmsErr?.response?.data || lmsErr.message);
						}

						// ✅ Handle referral
						if (req.body.ref_code) {
							userModel.findOne({ referralCode: req.body.ref_code }).then(parentUser => {
								if (!parentUser) {
									return res.status(SC.OK).json({
										status: SC.OK,
										message: "User Registered Successfully.",
										token,
										data: user,
										referral: "Invalid"
									});
								}
								userModel.findByIdAndUpdate(user._id,
									{ $set: { referredBy: req.body.ref_code } },
									{ new: true }
								).then(newUser => {
									return res.status(SC.OK).json({
										status: SC.OK,
										message: "User Registered Successfully.",
										token,
										data: newUser,
										referral: "Valid"
									});
								}).catch(err => res.status(SC.BAD_REQUEST).json({
									status: SC.BAD_REQUEST,
									message: err.message
								}));
							}).catch(err => {
								return res.status(SC.BAD_REQUEST).json({
									status: SC.BAD_REQUEST,
									message: err.message
								});
							});
						} else {
							return res.status(SC.OK).json({
								status: SC.OK,
								message: "User Registered Successfully.",
								token,
								data: user
							});
						}
					})
					.catch(err => res.status(SC.BAD_REQUEST).json({
						status: SC.BAD_REQUEST,
						message: err.message
					}));
			});
		}
	} catch (err) {
		logger(err, 'ERROR');
	} finally {
		logger(`Sign up API called by user - ${email}, ${phoneNumber}, ${req?.body?.password}`);
	}
};


const signin = async (req, res) => {
	const errors = validate(req)
	if (!errors.isEmpty()) {
		return res.status(SC.WRONG_ENTITY).json({
			error: errors.array()[0].msg
		})
	}
	const { email, phoneNumber, password } = req.body
	const body = req.body
	delete body.password
	try {
		await userModel.findOne({ ...body }).exec((err, user) => {
			if (err || !user) {
				return res.status(SC.NOT_FOUND).json({
					error: "Phone Number or E-mail doesn't exist in DB!"
				})
			}
			if (!user.authenticate(password)) {
				return res.status(SC.UNAUTHORIZED).json({
					error: 'Oops!, Phone Number / E-mail and Password does not match!'
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
		logger(`User Signed in - ${email} , ${phoneNumber}`)
	}
}

const signout = (_, res) => {
	res.clearCookie('Token')
	res.status(SC.OK).json({
		message: 'User Signed Out Sucessfully!'
	})
}

const forgotPassword = async (req, res) => {
	try {
		const errors = validate(req) || []
		if (!errors.isEmpty()) {
			return res.status(SC.WRONG_ENTITY).json({
				status: SC.WRONG_ENTITY,
				error: errors.array()[0]?.msg
			})
		}
		const { newPassword, countryCode, phoneNumber, otp } = req.body
		try {
			userModel.findOne({ phoneNumber: phoneNumber }).then(userWithPhone => {
				if (userWithPhone) {
					twilio.verify.v2.services(twilioServiceSID)
						.verificationChecks
						.create({ to: `+${countryCode}${phoneNumber}`, code: otp })
						.then(verification_check => {
							if (verification_check.status === "approved") {
								userWithPhone.password = newPassword
								userWithPhone.save()
									.then(newUserData => {

										const expiryTime = new Date()
										expiryTime.setMonth(expiryTime.getMonth() + 6)
										const exp = parseInt(expiryTime.getTime() / 1000)
										const token = jwt.sign(
											{ _id: newUserData._id, exp: exp },
											process.env.SECRET || 'college-predictor'
										)
										res.cookie('Token', token, { expire: new Date() + 9999 })
										newUserData.salt = undefined
										newUserData.__v = undefined

										res.status(SC.OK).json({
											status: SC.OK,
											message: "Password Successfully Updated.",
											data: newUserData,
											token
										})
									})
									.catch(err => res.status(SC.BAD_REQUEST).json({
										status: SC.BAD_REQUEST,
										message: err.message
									}));
							}
							else {
								return res.status(SC.BAD_REQUEST).json({
									status: SC.BAD_REQUEST,
									error: "Entered OTP is Invalid."
								})
							}
						}).catch(err => res.status(err.status).json({
							status: err.status,
							error: { err }
						}))
				}
				else {
					return res.status(SC.NOT_FOUND).json({
						status: SC.NOT_FOUND,
						error: "User Not Fount."
					});
				}
			}).catch()
		} catch (err) {
			res.status(SC.BAD_REQUEST).json({
				status: SC.BAD_REQUEST,
				error: "Something went Wrong."
			})
		}
	} catch (err) {
		loggerUtil(err, 'ERROR')
	} finally {
		loggerUtil(`Forgot Password API Called.`)
	}
}

const update = async (req, res) => {
	try {
		const id = req.auth._id
		const form = new formidable.IncomingForm()
		form.parse(req, async (err, fields, file) => {
			const formValue = JSON.parse(fields.data)
			if (file.profileImage) {
				formValue.profileImage = await createSiteData(file.profileImage, res, err)
			} const { email, password } = formValue
			if (email || password) {
				return res.status(SC.BAD_REQUEST).json({
					error: 'Cannot update email or password'
				})
			}
			await userModel.findOne({ _id: id }).exec((err, data) => {
				if (err || !data) {
					return res.status(SC.NOT_FOUND).json({
						error: 'User Not Found!'
					})
				}
				userModel
					.findByIdAndUpdate(
						{ _id: id },
						{
							$set: formValue
						}, { new: true }
					)
					.then((user) => {
						res.status(SC.OK).json({
							message: 'User Updated Successfully!',
							data: user
						})
					})
					.catch(err => {
						res.status(SC.INTERNAL_SERVER_ERROR).json({
							error: 'User Updation Failed!'
						})
						logger(err, 'ERROR')
					})
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
	forgotPassword,
	update,
}
