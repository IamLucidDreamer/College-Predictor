const { Expo } = require('expo-server-sdk');
const useSchema = require('../models/user');

const expo = new Expo();

const sendPushNotification = async (title, description, route) => {
    const notificaionToken = [];

    useSchema
        .find({})
        .sort({ createdAt: -1 })
        .exec((err, token) => {
            if (err || !token) {
                return res.status(SC.NOT_FOUND).json({
                    error: 'No users were found in a DB!'
                })
            }
            token.forEach(({ useSchema }) => { notificaionToken.push(useSchema) })
            console.log(notificaionToken);
        })

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
            } catch (error) {
                console.log('Error sending push notification:', error);
            }
        }
    })

    // Process the tickets to handle errors, etc.
};



module.exports = { sendPushNotification }