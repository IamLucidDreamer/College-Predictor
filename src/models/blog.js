const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const blogSchema = new mongoose.Schema(
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
		image: {
			type: String
		}
	},
	{ timestamps: true }
)

blogSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('blog', blogSchema, 'blog')
