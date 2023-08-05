const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const expoPushTokenSchema = new mongoose.Schema(
	{
		expoPushToken: {
			type: String,
			default: null,
			trim: true
		},
	},
	{ timestamps: true }
)

expoPushTokenSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('expoPushToken', expoPushTokenSchema, 'expoPushToken')
