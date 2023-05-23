const { create, updateById, deleteById, getById } = require('../helpers/crud')
const collegeSchema = require('../models/college')
const neet = require('../models/neet')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')
const formidable = require('formidable')
const { createSiteData } = require('../helpers/fileHelper')


const createCollege = async (req, res) => {
	try {
		const form = new formidable.IncomingForm()
		form.parse(req, async (err, fields, file) => {
			const formValue = JSON.parse(fields.data)
			formValue.campusPhotos = []
			await Promise.all(Object.keys(file).map(async val => {
				if (val === "collegeIcon")
					formValue.collegeIcon = await createSiteData(file.collegeIcon, res, err)
				else if (val === "collegeCover")
					formValue.collegeCover = await createSiteData(file.collegeCover, res, err)
				else {
					formValue.campusPhotos.push(await createSiteData(file[val], res, err))
				}
			}))
			formValue.userId = req.auth._id
			await create(formValue, collegeSchema)
				.then(async data => {
					await neet.updateMany({ instituteName: formValue.collegeName }, {
						collegeId: data.data._id
					}).then((college) => {
						res.status(SC.OK).json({ data: data, college: college })
					}
					).catch(err => {
						res.status(SC.INTERNAL_SERVER_ERROR).json({
							status: 'Failed!',
							err
						})
					})
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
		logger(err, 'ERROR')
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
		logger(err, 'ERROR')
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
		logger(err, 'ERROR')
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
		customLabels: label,
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
		logger(err, 'ERROR')
	} finally {
		logger('Get all Colleges Function is Executed')
	}
}

const getTopColleges = async (req, res) => {
	const options = {
		page: 1,
		limit: 10,
		customLabels: label,
		sort: { hotnessScore: -1 }
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
		logger(err, 'ERROR')
	} finally {
		logger('Get all Colleges Function is Executed')
	}
}

const getTopStateColleges = async (req, res) => {
	const options = {
		page: 1,
		limit: 10,
		customLabels: label,
		sort: { hotnessScore: -1 },
	}
	req.query.page !== undefined ? (options.page = req.query.page) : null
	req.query.limit !== undefined ? (options.limit = req.query.limit) : null
	const id = req.params.id
	try {
		await collegeSchema.paginate({ state: req.body.state }, options, (err, result) => {
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
		logger(err, 'ERROR')
	} finally {
		logger('Get all Colleges Function is Executed')
	}
}


const getCollegeBySearch = async (req, res) => {
	const options = {
		page: 1,
		limit: 10,
		customLabels: label,
		sort: { hotnessScore: -1 },
	}
	req.query.page !== undefined ? (options.page = req.query.page) : null
	req.query.limit !== undefined ? (options.limit = req.query.limit) : null
	try {
		await collegeSchema.paginate({
			$or: [{ collegeName: { $regex: req.body.name, $options: 'i' } },
			{ displayName: { $regex: req.body.name, $options: 'i' } }]
		}, options, (err, result) => {
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
		logger(err, 'ERROR')
	} finally {
		logger('Search Colleges Function is Executed')
	}
}

module.exports = {
	createCollege,
	updateCollege,
	deleteCollege,
	getCollege,
	getAllColleges,
	getTopColleges,
	getTopStateColleges,
	getCollegeBySearch
}
