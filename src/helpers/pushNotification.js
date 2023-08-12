const { Expo } = require('expo-server-sdk');
const useSchema = require('../models/user');

const expo = new Expo();

const sendPushNotification = async (title, description, route) => {
    const notificaionTokenArray = [];
    const notifications = []
    let success = 0
    let failure = 0

    useSchema
        .find({})
        .exec((err, data) => {
            if (err || !data) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No users were found in a DB!'
                })
            }
            data.forEach(({ expoPushToken }) => { notificaionTokenArray.push(...expoPushToken) })
            const notificaionToken = notificaionTokenArray.filter((item, index) => notificaionTokenArray.indexOf(item) === index)

        notificaionToken.map(async (pushToken) => {
                if (Expo.isExpoPushToken(pushToken)) {
                    notifications.push({
                        to: pushToken,
                        sound: 'default',
                        title: title,
                        body: description,
                        data: {
                            route: route
                        }
                    });
                } else {
                    console.log('Invalid Expo push tokens:', pushToken);
                    return;
                }
                const chunks = expo.chunkPushNotifications(notifications);
                const tickets = [];
                for (const chunk of chunks) {
                    try {
                        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                        tickets.push(...ticketChunk);
                        success++
                    } catch (error) {
                        console.log('Error sending push notification:', error);
                        failure++
                    }
                }
            })
        })
    // Process the tickets to handle errors, etc.
    // return { status: "Success", total: notifications.length, success: success, failure: failure }
};



module.exports = { sendPushNotification }