const josaSchema = require('../models/josa')
const neetSchema = require('../models/neet')
const formidable = require('formidable')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')
const { loggerUtil: logger } = require('../utils/logger')
const { statusCode: SC } = require('../utils/statusCode')
const { predictionHelper, dropdownValuesHelper } = require('../helpers')

/**
 * JOSA goes here
 */
const josaBulkUpload = async (req, res) => {
	const form = new formidable.IncomingForm()
	form.keepExtensions = true
	try {
		await form.parse(req, (err, fields, file) => {
			if (err) {
				logger(err, 'ERROR')
				return res.status(SC.BAD_REQUEST).json({
					error: 'Problem with a file!'
				})
			}
			if (file.file) {
				if (file.file.size > 3000000) {
					return res.status(SC.BAD_REQUEST).json({
						error: 'File size is too big!'
					})
				} else {
					readXlsxFile(fs.createReadStream(file.file.filepath)).then(rows => {
						const arr = rows
							?.filter((_, inx) => inx > 0)
							?.map(val => ({
								instituteType: val?.[0],
								instituteName: val?.[1],
								programName: val?.[2],
								quota: val?.[3],
								seatType: val?.[4],
								gender: val?.[5],
								openingRank: typeof val?.[6] === 'number' ? val?.[6] : null,
								closingRank: typeof val?.[7] === 'number' ? val?.[7] : null,
								round: val?.[8]
							}))

						josaSchema.insertMany(arr).then(data => {
							res.status(SC.OK).json({
								status: 'SUCCESS',
								data
							})
						})
					})
				}
			}
		})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('JOSA Bulk Upload function is Executed!')
	}
}

const predictJosa = async (req, res) => {
	try {
		await predictionHelper(req, josaSchema)
			.then(data => {
				res.status(SC.OK).json(data)
			})
			.catch(err => {
				res.status(SC.INTERNAL_SERVER_ERROR).json({
					status: 'Failed!',
					err
				})
			})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('JOSA Predictor function is executed!')
	}
}

const getJosaDropdownValues = async (req, res) => {
	try {
		await dropdownValuesHelper(req, josaSchema)
			.then(data => {
				res.status(SC.OK).json(data)
			})
			.catch(err => {
				res.status(SC.INTERNAL_SERVER_ERROR).json({
					status: 'Failed!',
					err
				})
			})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('Get JOSA Drop Down Values function is executed!')
	}
}

/**
 * NEET goes here
 */
const neetBulkUpload = async (req, res) => {
	const form = new formidable.IncomingForm()
	form.keepExtensions = true
	try {
		await form.parse(req, (err, fields, file) => {
			if (err) {
				logger(err, 'ERROR')
				return res.status(SC.BAD_REQUEST).json({
					error: 'Problem with a file!'
				})
			}
			if (file.file) {
				if (file.file.size > 3000000) {
					return res.status(SC.BAD_REQUEST).json({
						error: 'File size is too big!'
					})
				} else {
					readXlsxFile(fs.createReadStream(file.file.filepath)).then(rows => {
						const arr = rows
							?.filter((_, inx) => inx > 0)
							?.map(val => ({
								course: val?.[0],
								round: val?.[1],
								allottedPH: val?.[2],
								quota: val?.[3],
								allottedCategory: val?.[4],
								instituteName: val?.[5],
								openingRank: typeof val?.[6] === 'number' ? val?.[6] : null,
								closingRank: typeof val?.[7] === 'number' ? val?.[7] : null
							}))

						neetSchema.insertMany(arr).then(data => {
							res.status(SC.OK).json({
								status: 'SUCCESS',
								data
							})
						})
					})
				}
			}
		})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('Create Bucket Function is Executed!')
	}
}

const predictNeet = async (req, res) => {
	try {
		await predictionHelper(req, neetSchema)
			.then(data => {
				res.status(SC.OK).json(data)
			})
			.catch(err => {
				res.status(SC.INTERNAL_SERVER_ERROR).json({
					status: 'Failed!',
					err
				})
			})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('NEET Predictor function is executed!')
	}
}

const getNeetDropdownValues = async (req, res) => {
	try {
		await dropdownValuesHelper(req, neetSchema)
			.then(data => {
				res.status(SC.OK).json(data)
			})
			.catch(err => {
				res.status(SC.INTERNAL_SERVER_ERROR).json({
					status: 'Failed!',
					err
				})
			})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('Get NEET Drop Down Values function is executed!')
	}
}

module.exports = {
	josaBulkUpload,
	predictJosa,
	getJosaDropdownValues,
	neetBulkUpload,
	predictNeet,
	getNeetDropdownValues
}
