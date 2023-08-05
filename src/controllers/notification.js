const { create } = require('../helpers/crud.js')
const { sendPushNotification } = require('../helpers/pushNotification.js')
const expoPushTokenSchema = require('../models/expoPushToken.js')
const { loggerUtil: logger } = require('../utils/logger.js')
const { statusCode: SC } = require('../utils/statusCode')

const saveExpoToken = async (req, res) => {
    try {
        req.body.expoPushToken = req.body.expoToken
        await create(req.body, expoPushTokenSchema)
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