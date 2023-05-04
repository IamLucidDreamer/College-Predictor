const { create, updateById, deleteById, getById } = require('../helpers/crud')
const userFollowUpSchema = require('../models/userFollowUp')
const userModel = require("../models/user")
const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')

const createFollowUp = async (req, res) => {
    try {
        req.body.reviewerId = req.auth._id
        await create(req.body, userFollowUpSchema)
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
        logger('Create User Follow Up Function is Executed')
    }
}

const updateUserCounsellor = async (req, res) => {
    try {
        const userId = req.params.userId
        const id = req.auth._id
        await userModel.findOne({ _id: userId }).exec((err, data) => {
            if (err || !data) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'User Not Found!'
                })
            }
            if (data.reviewerId) {
                return res.status(SC.BAD_REQUEST).json({
                    error: 'Lead has already been assigned!',
                })
            }
            userModel
                .findByIdAndUpdate(
                    { _id: userId },
                    {
                        $set: { reviewerId: id }
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
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('User Update Function is Executed')
    }
}

const label = {
    totalDocs: 'totalFollowUps',
    docs: 'followUps',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'nextPageNo',
    prevPage: 'prevPageNo',
    totalPages: 'pageCount'
}

const getAllFollowUpsOfAUser = async (req, res) => {
    const options = {
        page: 1,
        limit: 10,
        populate: "reviewerId",
        customLabels: label
    }
    req.query.page !== undefined ? (options.page = req.query.page) : null
    req.query.limit !== undefined ? (options.limit = req.query.limit) : null
    const userId = req.params.userId
    try {
        await userFollowUpSchema.paginate({ userId }, options, (err, result) => {
            if (err) {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Getting User Follows by User ID from DB is failed!'
                })
                logger(err, 'ERROR')
            }
            res.status(SC.OK).send({
                message: 'Follow Ups of a User Failed fetched successfully',
                data: result
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get all User Follow Ups Function is Executed')
    }
}


module.exports = {
    createFollowUp,
    getAllFollowUpsOfAUser,
    updateUserCounsellor
}
