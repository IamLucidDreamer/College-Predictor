const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const userSchema = require("./user")

const userFollowUpSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true
        },
        reviewerId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: userSchema
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
    },
    { timestamps: true }
)

userFollowUpSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('userFollowUp', userFollowUpSchema, 'userFollowUp')
