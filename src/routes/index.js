// const express = require('express')
// const {
// 	getJosaDropdownValues,
// 	predictJosa,
// 	josaBulkUpload,
// } = require('../controllers')

const test = require("./test")
const auth = require('./auth')
const user = require('./user')
const blog = require('./blog')
const updates = require('./updates')
const college = require('./college')
const subscriber = require('./subscriber')
const statistics = require("./statistics")
const neet = require("./neet")


function routesV1(app) {
	app.use('/api/v1', test)
	app.use('/api/v1', auth)
	app.use('/api/v1', user)
	app.use('/api/v1', blog)
	app.use('/api/v1', updates)
	app.use('/api/v1', college)
	app.use('/api/v1', subscriber)
	app.use('/api/v1', statistics)
	app.use('/api/v1', neet)
}


module.exports = { routesV1 }

/**
 * JOSA goes here
//  */
// router.post('/bulk-upload/josa', josaBulkUpload)
// router.post('/predict-josa', predictJosa)
// router.post('/josa-dropdown', getJosaDropdownValues)