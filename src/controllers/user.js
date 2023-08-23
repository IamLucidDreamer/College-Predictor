const userModel = require('../models/user')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const getUserById = async (req, res) => {
	try {
		await userModel.findById({ _id: req.params.id }).exec((err, user) => {
			if (err || !user) {
				return res.status(SC.NOT_FOUND).json({
					error: 'No user was found in DB!'
				})
			}
			res.status(SC.OK).json({
				error: 'User fetched uccessfully!',
				data: user
			})
		})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('Get User By Id Function is Executed!')
	}
}

const getAllUsers = async (req, res) => {
	try {
		const id = req.auth._id
		const getAll = req.query.getAll
		const isAdmin =req.query.isAdmin
		const filter = isAdmin == true ? {} : getAll == 1 ? {reviewerId: null}: { reviewerId: id }
		userModel
			.find(filter)
			.sort({ createdAt: -1 })
			.exec((err, user) => {
				if (err || !user) {
					return res.status(SC.NOT_FOUND).json({
						error: 'No users were found in a DB!'
					})
				}
				res.status(SC.OK).json({
					message: 'User Fetched Successfully!',
					data: user
				})
			})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('Get All Users Function is Executed')
	}
}

module.exports = {
	getUserById,
	getAllUsers
}
