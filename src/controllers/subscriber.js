const subscriberSchema = require('../models/subscriber')

const { validationResult: validate } = require('express-validator')
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger, loggerUtil } = require('../utils/logger')

const addSubscriber = async (req, res) => {
    const errors = validate(req) || []
    if (!errors.isEmpty()) {
        return res.status(SC.WRONG_ENTITY).json({
            status: SC.WRONG_ENTITY,
            error: errors.array()[0]?.msg
        })
    }
    const { email } = req.body
    try {

        subscriberSchema.find({ email: email }).exec((err, user) => {
            if (err) {
                return res.status(SC.BAD_REQUEST).json({
                    status: SC.BAD_REQUEST,
                    error: "Something Went wrong"
                });
            }
            if (user.length !== 0) {
                return res.status(SC.BAD_REQUEST).json({
                    status: SC.BAD_REQUEST,
                    error: "Email already registered."
                });
            }
            const subscriber = new subscriberSchema(req.body)
            subscriber.save()
                .then(subscriber => {
                    res.status(SC.OK).json({
                        status: SC.OK,
                        error: "Email registered succesfully.",
                        data: subscriber
                    });
                }).catch(() => res.status(SC.BAD_REQUEST).json({
                    status: SC.BAD_REQUEST,
                    error: "Something went wrong"
                }))
        })
    }
    catch (err) {
        logger(err)
    }
    finally {
        logger("OTP API Called")
    }
}

const label = {
	totalDocs: 'totalSubscibers',
	docs: 'subscribers',
	limit: 'perPage',
	page: 'currentPage',
	nextPage: 'nextPageNo',
	prevPage: 'prevPageNo',
	totalPages: 'pageCount'
}

const getAllSubscribers = async (req, res) => {
	const options = {
		page: 1,
		limit: 10,
		customLabels: label
	}
	req.query.page !== undefined ? (options.page = req.query.page) : null
	req.query.limit !== undefined ? (options.limit = req.query.limit) : null
	const id = req.params.id
	try {
		await subscriberSchema.paginate({}, options, (err, result) => {
			if (err) {
				res.status(SC.BAD_REQUEST).json({
					error: 'Getting Subscribers from DB is failed!'
				})
				logger(err, 'ERROR')
			}
			res.status(SC.OK).send({
				message: 'Subscribers fetched successfully',
				data: result
			})
		})
	} catch (err) {
		loggerUtil(err, 'ERROR')
	} finally {
		logger('Get all Subscribers Function is Executed')
	}
}

module.exports = {
    addSubscriber,
    getAllSubscribers
}
