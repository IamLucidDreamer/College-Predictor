const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const collegeSchema = new mongoose.Schema(
	{
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
		collegeType: {
			type: String,
			trim: true
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
		}
	},
	{ timestamps: true }
)

collegeSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('college', collegeSchema, 'college')
