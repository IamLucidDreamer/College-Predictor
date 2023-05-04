const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const collegeSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.ObjectId,
			required: true
		},
		collegeTag: {
			type: String,
			required: true,
			trim: true
		},
		collegeName: {
			type: String,
			required: true,
			trim: true
		},
		displayName: {
			type: String,
			required: true,
			trim: true
		},
		collegeType: {
			type: String,
			trim: true
		},
		collegeIcon:{
			type: String,
		},
		collegeCover:{
			type: String,
		},
		estYear: {
			type: Number
		},
		coursesOffered: {
			type: Array
		},
		ranking: {
			type: Number
		},
		cutOff: {
			type: String,
			trim: true
		},
		tutionFees: {
			type: Number
		},
		hostelFees: {
			type: Number
		},
		campusPhotos: {
			type: Array
		},
		website: {
			type: String,
			trim: true
		},
		contactNumber: {
			type: Number
		},
		city: {
			type: String,
			trim: true
		},
		state: {
			type: String,
			trim: true
		},
		address: {
			type: String,
			trim: true
		},
		hotnessScore: {
			type: Number
		},
		suggestCollege: {
			type: Array
		}
	},
	{ timestamps: true }
)

collegeSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('college', collegeSchema, 'college')
