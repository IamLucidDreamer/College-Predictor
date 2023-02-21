const mongoose = require('mongoose');
const { loggerUtil } = require('../utils/logger');
const logger = loggerUtil;
const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    logger('DB Connected Successfully', 'SERVER');
  } catch (err) {
    logger('DB Connection Failed', 'SERVER');
    logger(err, 'ERROR');
  }
};

module.exports = connection;
