const mongoose = require('mongoose')

const josaSchema = new mongoose.Schema(
	{
		instituteType: {
			type: String,
			required: true,
			trim: true
		},
		instituteName: {
			type: String,
			required: true,
			trim: true
		},
		programName: {
			type: String,
			required: true,
			trim: true
		},
		seatType: {
			type: String,
			required: true,
			trim: true
		},
		quota: {
			type: String,
			required: true,
			trim: true
		},
		gender: {
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
		round: {
			type: Number,
			required: true
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('josaa', josaSchema, 'josaa')
