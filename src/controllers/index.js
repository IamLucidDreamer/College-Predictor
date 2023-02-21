const formidable = require('formidable')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')
const josaSchema = require('../models/index')
const { loggerUtil } = require('../utils/logger')

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
								seatType: val?.[3],
								quota: val?.[4],
								gender: val?.[5],
								openingRank: val?.[6],
								closingRank: val?.[7],
								round: 1
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
		loggerUtil(err, 'ERROR')
	} finally {
		loggerUtil('Create Bucket Function is Executed!')
	}
}

module.exports = {
	bulkUpload
}
