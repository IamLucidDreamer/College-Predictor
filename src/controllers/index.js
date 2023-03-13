const formidable = require('formidable')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')
const josaSchema = require('../models/index')
const { loggerUtil: logger } = require('../utils/logger')

const bulkUpload = async (req, res) => {
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
							res.status(200).json({
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

const predictJosa = async (req, res) => {
	try {
		const body = req.body
		const arr = []
		for (a in req.body) {
			if (body[a]?.length && a !== "rank") {
				arr.push({
					[a]: {
						$exists: true,
						$in: body[a]
					}
				})
			}
		}
		josaSchema
			.aggregate([
				{
					$match: {
						$and: arr
					}
				}
			])
			.then(data => {
				if (body.rank) {
					res.status(200).json({
						status: 'SUCCESS',
						data: data.filter(val => val.closingRank >= body.rank)
					})
				} else {
					res.status(200).json({
						status: 'SUCCESS',
						data
					})
				}
			})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('Predictor function is executed!')
	}
}

const getDropdownValues = async (req, res) => {
	let mapObj = {},
		groupObj = {}
	const body = req.body
	for (const key in body) {
		mapObj = {
			...mapObj,
			...(body[key].length
				? {
						...{
							[key]: {
								$in: body[key]
							}
						}
				  }
				: {})
		}
		groupObj = {
			...groupObj,
			[key]: '$' + key
		}
	}
	try {
		await josaSchema
			.aggregate([
				{
					$match: {
						...mapObj
					}
				},
				{
					$group: {
						_id: {
							...groupObj
						}
					}
				}
			])
			.then(data => {
				res.status(200).json({
					status: 'SUCCESS',
					data: data.map(val => ({
						...val?._id
					}))
				})
			})
	} catch (err) {
		logger(err, 'ERROR')
	} finally {
		logger('Get Drop Down Values function is executed!')
	}
}

module.exports = {
	bulkUpload,
	predictJosa,
	getDropdownValues
}
