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

module.exports = {
    mainData
}