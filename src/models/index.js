const mongoose = require('mongoose')

const josaSchema = new mongoose.Schema(
	{
		instituteType: {
			type: String,
			required: true
		},
		instituteName: {
			type: String,
			required: true
		},
		programName: {
			type: String,
			required: true
		},
		seatType: {
			type: String,
			required: true
		},
		quota: {
			type: String,
			required: true
		},
		gender: {
			type: String,
			required: true
		},
		openingRank: {
			type: String,
			required: true
		},
		closingRank: {
			type: String,
			required: true
		},
		round: {
			type: Number,
			required: true
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('josaa', josaSchema, 'josaa')
