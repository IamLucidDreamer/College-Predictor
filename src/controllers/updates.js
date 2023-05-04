const { create, updateById, deleteById, getById } = require('../helpers/crud')
const updatesSchema = require('../models/updates')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')
const formidable = require('formidable')
const { createSiteData } = require('../helpers/fileHelper')

const createUpdates = async (req, res) => {
	try {
		const form = new formidable.IncomingForm()
		form.parse(req, async (err, fields, file) => {
			const formValue = JSON.parse(fields.data)
			formValue.imageMain = await createSiteData(file.imageMain, res, err)
			if (file.document) {
				formValue.document = await createSiteData(file.document, res, err,)
			}
			formValue.userId = req.auth._id
			await create(formValue, updatesSchema)
				.then(data => {
					res.status(SC.OK).json(data)
				})
				.catch(err => {
					res.status(SC.INTERNAL_SERVER_ERROR).json({
						status: 'Failed!',
						err
					})
				})
		})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('Create Updates Function is Executed')
	}
}

const updateUpdates = async (req, res) => {
	try {
		const form = new formidable.IncomingForm()
		form.parse(req, async (err, fields, file) => {
			const formValue = JSON.parse(fields.data)
			if (file.imageMain) {
				formValue.imageMain = await createSiteData(file.imageMain, res, err)
			}
			if (file.document) {
				formValue.document = await createSiteData(file.document, res, err,)
			} formValue.userId = req.auth._id
			const id = req.params.id
			await updateById(req.body, id, updatesSchema)
				.then(data => {
					res.status(SC.OK).json(data)
				})
				.catch(err => {
					res.status(SC.INTERNAL_SERVER_ERROR).json({
						status: 'Failed!',
						err
					})
				})
		})
	} catch (err) {
		loggerUtil(err, 'ERROR')
	} finally {
		logger('Update Updates Function is Executed')
	}
}

const deleteUpdates = async (req, res) => {
	try {
		const id = req.params.id
		await deleteById(id, updatesSchema)
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
		logger('Delete Updates Function is Executed')
	}
}

const getUpdates = async (req, res) => {
	const id = req.params.id
	try {
		await getById(id, updatesSchema)
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
		logger('Get Updates Function is Executed')
	}
}
const label = {
	totalDocs: 'totalupdates',
	docs: 'updates',
	limit: 'perPage',
	page: 'currentPage',
	nextPage: 'nextPageNo',
	prevPage: 'prevPageNo',
	totalPages: 'pageCount'
}

const getAllUpdates = async (req, res) => {
	const options = {
		page: 1,
		limit: 10,
		sort: { createdAt: -1 },
		customLabels: label
	}
	req.query.page !== undefined ? (options.page = req.query.page) : null
	req.query.limit !== undefined ? (options.limit = req.query.limit) : null
	const id = req.params.id
	try {
		await updatesSchema.paginate({}, options, (err, result) => {
			if (err) {
				res.status(SC.BAD_REQUEST).json({
					error: 'Getting updatess from DB is failed!'
				})
				logger(err, 'ERROR')
			}
			res.status(SC.OK).send({
				message: 'updatess fetched successfully',
				data: result
			})
		})
	} catch (err) {
		loggerUtil(err, 'ERROR')
	} finally {
		logger('Get all Updates Function is Executed')
	}
}

module.exports = {
	createUpdates,
	updateUpdates,
	deleteUpdates,
	getUpdates,
	getAllUpdates
}
