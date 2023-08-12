const express = require('express')
const {
    saveExpoToken, sendPushNotifications
} = require('../controllers/notification')
const { isSignedIn, isValidToken, isAdminOrCounsellorOrCollegeAdmin, isAdmin } = require('../controllers/middleware')
const router = express.Router()

router.put(
    '/user/update/expo-token',
    isSignedIn,
    isValidToken,
    saveExpoToken
)

router.post(
    '/notification/expo-notifcation',
    isSignedIn,
    isValidToken,
    isAdmin,
    sendPushNotifications
)

module.exports = router