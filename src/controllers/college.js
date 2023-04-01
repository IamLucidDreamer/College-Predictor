const { create, updateById, deleteById, getById } = require('../helpers/crud')
const collegeSchema = require('../models/college')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createCollege = async (req, res) => {
	try {
		await create(req.body, collegeSchema)
			.then(data => {
				res.status(SC.OK).json(data)
			})
			.catch(err => {
				res.status(SC.INTERNAL_SERVER_ERROR).json({
					status: 'Failed!',
					err
				})
			})
	} catch (err) {
		loggerUtil(err, 'ERROR')
	} finally {
		logger('Create College Function is Executed')
	}
}

const updateCollege = async (req, res) => {
	try {
		const id = req.params.id
		await updateById(req.body, id, collegeSchema)
			.then(data => {
				res.status(SC.OK).json(data)
			})
			.catch(err => {
				res.status(SC.INTERNAL_SERVER_ERROR).json({
					status: 'Failed!',
					err
				})
			})
	} catch (err) {
		loggerUtil(err, 'ERROR')
	} finally {
		logger('Update College Function is Executed')
	}
}

const deleteCollege = async (req, res) => {
	try {
		const id = req.params.id
		await deleteById(id, collegeSchema)
			.then(data => {
				res.status(SC.OK).json(data)
			})
			.catch(err => {
				res.status(SC.INTERNAL_SERVER_ERROR).json({
					status: 'Failed!',
					err
				})
			})
	} catch (err) {
		loggerUtil(err, 'ERROR')
	} finally {
		logger('Delete College Function is Executed')
	}
}

const getCollege = async (req, res) => {
	const id = req.params.id
	try {
		await getById(id, collegeSchema)
			.then(data => {
				res.status(SC.OK).json(data)
			})
			.catch(err => {
				res.status(SC.INTERNAL_SERVER_ERROR).json({
					status: 'Failed!',
					err
				})
			})
	} catch (err) {
		loggerUtil(err, 'ERROR')
	} finally {
		logger('Get College Function is Executed')
	}
}
const label = {
	totalDocs: 'totalColleges',
	docs: 'College',
	limit: 'perPage',
	page: 'currentPage',
	nextPage: 'nextPageNo',
	prevPage: 'prevPageNo',
	totalPages: 'pageCount'
}

const getAllColleges = async (req, res) => {
	const options = {
		page: 1,
		limit: 10,
		customLabels: label
	}
	req.query.page !== undefined ? (options.page = req.query.page) : null
	req.query.limit !== undefined ? (options.limit = req.query.limit) : null
	const id = req.params.id
	try {
		await collegeSchema.paginate({}, options, (err, result) => {
			if (err) {
				res.status(SC.BAD_REQUEST).json({
					error: 'Getting Colleges from DB is failed!'
				})
				logger(err, 'ERROR')
			}
			res.status(SC.OK).send({
				message: 'Colleges fetched successfully',
				data: result
			})
		})
	} catch (err) {
		loggerUtil(err, 'ERROR')
	} finally {
		logger('Get all Colleges Function is Executed')
	}
}

module.exports = {
	createCollege,
	updateCollege,
	deleteCollege,
	getCollege,
	getAllColleges
}
