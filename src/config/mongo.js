const mongoose = require('mongoose')
const { loggerUtil } = require('../utils/logger')
const logger = loggerUtil
const connection = async () => {
	try {
		await mongoose.connect(
			process.env.MONGO_DB_URL ||
				'mongodb+srv://manas:manasCollege@cluster0.htdzao8.mongodb.net/?retryWrites=true&w=majority'
		)
		logger('DB Connected Successfully', 'SERVER')
	} catch (err) {
		logger('DB Connection Failed', 'SERVER')
		logger(err, 'ERROR')
	}
}

module.exports = connection
