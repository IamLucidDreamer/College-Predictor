const neetSchema = require('../models/neet')
const formidable = require('formidable')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')
const { loggerUtil: logger } = require('../utils/logger')
const { statusCode: SC } = require('../utils/statusCode')
const { predictionHelper, dropdownValuesHelper } = require('../helpers')

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
                                instituteType: val?.[6],
                                examCategory: val?.[7],
                                year: val?.[8],
                                openingRank: typeof val?.[9] === 'number' ? val?.[9] : null,
                                closingRank: typeof val?.[10] === 'number' ? val?.[10] : null,
                                examType: fields.examType
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

const label = {
    totalDocs: 'totalNeetRecords',
    docs: 'neetData',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'nextPageNo',
    prevPage: 'prevPageNo',
    totalPages: 'pageCount'
}

const getAllNeetData = async (req, res) => {
    const options = {
        page: 1,
        limit: 10,
        customLabels: label
    }
    req.query.page !== undefined ? (options.page = req.query.page) : null
    req.query.limit !== undefined ? (options.limit = req.query.limit) : null
    const id = req.params.id
    try {
        await neetSchema.paginate({}, options, (err, result) => {
            if (err) {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Getting Neet Data from DB is failed!'
                })
                logger(err, 'ERROR')
            }
            res.status(SC.OK).send({
                message: 'Neet Data fetched successfully',
                data: result
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get all Neet Data Function is Executed')
    }
}


module.exports = {
    neetBulkUpload,
    getAllNeetData,
    predictNeet,
    getNeetDropdownValues
}
