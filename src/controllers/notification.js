const { updateById } = require('../helpers/crud.js')
const { sendPushNotification } = require('../helpers/pushNotification.js')
const userSchema = require("../models/user.js")
const { loggerUtil: logger } = require('../utils/logger.js')
const { statusCode: SC } = require('../utils/statusCode')

const saveExpoToken = async (req, res) => {
    try {
        await userSchema.findOneAndUpdate(req.auth._id,
            { "$push": { "expoPushToken": req.body.expoToken } },
            { new: true })
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
        logger('User expo token Update Function is Executed')
    }
}

const sendPushNotifications = async (req, res) => {
    try {
        sendPushNotification(req.body.title, req.body.description, req.body.route = {})
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('User expo token Update Function is Executed')
    }
}

module.exports = {
    saveExpoToken,
    sendPushNotifications
}