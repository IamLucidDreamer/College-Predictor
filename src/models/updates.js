const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const updatesSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.ObjectId,
			required: true
		},
		title: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String,
			required: true,
			trim: true
		},
		imageMain: {
			type: String
		},
		document: {
			type: String
		}
	},
	{ timestamps: true }
)

updatesSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('updates', updatesSchema, 'updates')
