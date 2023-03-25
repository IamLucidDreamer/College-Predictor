const { create, updateById, deleteById, getById } = require('../helpers/crud')
const blogSchema = require('../models/blog')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createBlog = async (req, res) => {
	try {
		await create(req.body, blogSchema)
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
		logger('Create Blog Function is Executed')
	}
}

const updateBlog = async (req, res) => {
	try {
		const id = req.params.id
		await updateById(req.body, id, blogSchema)
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
		logger('Update Blog Function is Executed')
	}
}

const deleteBlog = async (req, res) => {
	try {
		const id = req.params.id
		await deleteById(id, blogSchema)
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
		logger('Delete Blog Function is Executed')
	}
}

const getBlog = async (req, res) => {
	const id = req.params.id
	try {
		await getById(id, blogSchema)
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
		logger('Get Blog Function is Executed')
	}
}
const label = {
	totalDocs: 'totalBlogs',
	docs: 'blogs',
	limit: 'perPage',
	page: 'currentPage',
	nextPage: 'nextPageNo',
	prevPage: 'prevPageNo',
	totalPages: 'pageCount'
}

const getAllBlogs = async (req, res) => {
	const options = {
		page: 1,
		limit: 10,
		customLabels: label
	}
	req.query.page !== undefined ? (options.page = req.query.page) : null
	req.query.limit !== undefined ? (options.limit = req.query.limit) : null
	const id = req.params.id
	try {
		await blogSchema.paginate({}, options, (err, result) => {
			if (err) {
				res.status(SC.BAD_REQUEST).json({
					error: 'Getting blogs from DB is failed!'
				})
				logger(err, 'ERROR')
			}
			res.status(SC.OK).send({
				message: 'Blogs fetched successfully',
				data: result
			})
		})
	} catch (err) {
		loggerUtil(err, 'ERROR')
	} finally {
		logger('Get all Blogs Function is Executed')
	}
}

module.exports = {
	createBlog,
	updateBlog,
	deleteBlog,
	getBlog,
	getAllBlogs
}
