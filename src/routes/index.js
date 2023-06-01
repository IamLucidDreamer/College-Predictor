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
const ayush = require("./ayush")
const userFollowUp = require("./userFollowUp")


function routesV1(app) {
	app.get('/api/v1/update',
		(_, res) => { return res.status(200).json({ version: 4, updateUrl: "https://docs.google.com/document/d/1LuqB7mtLzjD5lpymq-Qsyr0DSp2gbNMu5jYLgK0NNqo/edit" }) }
	)
	app.use('/api/v1', test)
	app.use('/api/v1', auth)
	app.use('/api/v1', user)
	app.use('/api/v1', blog)
	app.use('/api/v1', updates)
	app.use('/api/v1', college)
	app.use('/api/v1', subscriber)
	app.use('/api/v1', statistics)
	app.use('/api/v1', neet)
	app.use('/api/v1', ayush)
	app.use('/api/v1', userFollowUp)
}

module.exports = { routesV1 }

/**
 * JOSA goes here
//  */
// router.post('/bulk-upload/josa', josaBulkUpload)
// router.post('/predict-josa', predictJosa)
// router.post('/josa-dropdown', getJosaDropdownValues)