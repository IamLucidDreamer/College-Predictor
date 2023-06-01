const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ayushSchema = new mongoose.Schema(
	{
		course: {
			type: String,
			default: null,
			trim: true
		},
		round: {
			type: Number,
			default: null,
		},
		allottedPH: {
			type: String,
			default: null,
			trim: true
		},
		quota: {
			type: String,
			default: null,
			trim: true
		},
		allottedCategory: {
			type: String,
			default: null,
			trim: true
		},
		instituteName: {
			type: String,
			default: null,
			trim: true
		},
		instituteType: {
			type: String,
			default: null,
			trim: true
		},
		year: {
			type: Number,
			default: null,
		},
		examCategory: {
			type: String,
			default: null,
			trim: true
		},
		openingRank: {
			type: Number
		},
		closingRank: {
			type: Number
		},
		examType: {
			type: String,
			required: true
		},
		collegeId: {
			type: mongoose.Schema.ObjectId,
			default: null
		}
	},
	{ timestamps: true }
)

ayushSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('ayush', ayushSchema, 'ayush')
