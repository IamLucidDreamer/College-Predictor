const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const subscriberSchema = new mongoose.Schema(
    {
        email: {
            type: String
        },
    },
    { timestamps: true }
)

subscriberSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('subscriber', subscriberSchema, 'subscriber')
