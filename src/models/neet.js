const mongoose = require('mongoose')

const neetSchema = new mongoose.Schema(
	{
		course: {
			type: String,
			required: true,
			trim: true
		},
		round: {
			type: Number,
			required: true
		},
		allottedPH: {
			type: String,
			required: true,
			trim: true
		},
		quota: {
			type: String,
			required: true,
			trim: true
		},
		allottedCategory: {
			type: String,
			required: true,
			trim: true
		},
		instituteName: {
			type: String,
			required: true,
			trim: true
		},
		openingRank: {
			type: Number
		},
		closingRank: {
			type: Number
		},
		collegeId: {
			type: mongoose.Schema.ObjectId,
			default: null
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('neet', neetSchema, 'neet')
