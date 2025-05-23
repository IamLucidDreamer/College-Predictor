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
		const id = req.auth._id;
		const getAll = req.query.getAll;
		const isAdmin = req.query.isAdmin;

		const filter = isAdmin == 1
			? {}
			: getAll == 1
			? { reviewerId: null }
			: { reviewerId: id };

		const cutoffDate = new Date('2025-01-01');

		const updatedFilter = {
			...filter,
			$or: [
				{ role: { $ne: 1 }, createdAt: { $lt: cutoffDate } },
				{ createdAt: { $gte: cutoffDate } }
			]
		};

		userModel
			.find(updatedFilter)
			.sort({ createdAt: -1 })
			.exec((err, users) => {
				if (err || !users) {
					return res.status(SC.NOT_FOUND).json({
						error: 'No users were found in the DB!'
					});
				}
				res.status(SC.OK).json({
					message: 'Users fetched successfully!',
					data: users
				});
			});
	} catch (err) {
		logger(err, 'ERROR');
	} finally {
		logger('Get All Users Function is Executed');
	}
};


module.exports = {
	getUserById,
	getAllUsers
}
