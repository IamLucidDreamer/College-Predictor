const { statusCode: SC } = require('../utils/statusCode')
const { loggerUtil: logger } = require('../utils/logger')
const userModel = require('../models/user')
const collegeModel = require("../models/college")
const updatesModel = require("../models/updates")
const blogModel = require("../models/blog")

const mainData = async (req, res) => {
    try {
        const responseObj = {
            userCount: 0,
            collegeCount: 0,
            councelorCount: 0,
            collegeAdminCount: 0,
            totalUpdatesCount: 0,
            totalBlogsCount: 0,
        }
        responseObj.userCount = await userModel.count({ role: 1 })
        responseObj.collegeCount = await collegeModel.count({})
        responseObj.councelorCount = await userModel.count({ role: 2 }) // Role 2 for Counsellor 
        responseObj.collegeAdminCount = await userModel.count({ role: 4 }) // Role 4 for College Admin
        responseObj.totalUpdatesCount = await updatesModel.count({})
        responseObj.totalBlogsCount = await blogModel.count({})
        res.status(SC.OK).json({
            status: SC.OK,
            data: responseObj
        })
    }
    catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Main Stats is Executed!')
    }
}

const callsStats = async (req, res) => {
    try {
        const counsellors = await userModel.aggregate([
            {
              $group: {
                _id: '$reviewerId',
                totalReviewedUsers: { $sum: 1 }
              }
            },
            {
              $lookup: {
                from: 'users', // The collection name you're joining with (assuming it's also "users")
                localField: '_id',
                foreignField: '_id',
                as: 'reviewer'
              }
            },
            {
              $unwind: '$reviewer'
            }
          ])
        res.status(SC.OK).json({
            status: SC.OK,
            data: counsellors
        })
    }
    catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get Call Stats is Executed!')
    }
}

module.exports = {
    mainData,
    callsStats
}