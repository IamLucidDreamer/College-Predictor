const ayushSchema = require('../models/ayush')
const formidable = require('formidable')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')
const { loggerUtil: logger } = require('../utils/logger')
const { statusCode: SC } = require('../utils/statusCode')
const { predictionHelper, dropdownValuesHelper } = require('../helpers')

const ayushBulkUpload = async (req, res) => {
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
                    try {
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
                            ayushSchema.insertMany(arr).then(data => {
                                res.status(SC.OK).json({
                                    status: 'SUCCESS',
                                    data
                                })
                            })
                        })
                    }
                    catch (err) {
                        return res.status(400).json({ err: err, message: "Problem with the file" })
                    }
                }
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Create Bucket Function is Executed!')
    }
}

const predictAyush = async (req, res) => {
    try {
        await predictionHelper(req, ayushSchema)
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
        logger('Ayush Predictor function is executed!')
    }
}

const deleteAyushValues = async (req, res) => {
    try {
        const examType = req.body.examType
        const year = req.body.year
        console.log(req.body, "body");
        console.log(examType, "exam");
        console.log(year, "year");
        await ayushSchema.deleteMany({ examType, year }).then(data => {
            res.status(SC.OK).json({ data: data, message: "Records Deleted Successfully" })
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
        logger('Delete Ayush Data Function is Executed')
    }
}


const getAyushDropdownValues = async (req, res) => {
    try {
        await dropdownValuesHelper(req, ayushSchema)
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
        logger('Get Ayush Drop Down Values function is executed!')
    }
}


const label = {
    totalDocs: 'totalAyushRecords',
    docs: 'ayushData',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'nextPageNo',
    prevPage: 'prevPageNo',
    totalPages: 'pageCount'
}

const getAllAyushData = async (req, res) => {
    const options = {
        page: 1,
        limit: 10,
        customLabels: label
    }
    req.query.page !== undefined ? (options.page = req.query.page) : null
    req.query.limit !== undefined ? (options.limit = req.query.limit) : null
    const id = req.params.id
    try {
        await ayushSchema.paginate({}, options, (err, result) => {
            if (err) {
                res.status(SC.BAD_REQUEST).json({
                    error: 'Getting Ayush Data from DB is failed!'
                })
                logger(err, 'ERROR')
            }
            res.status(SC.OK).send({
                message: 'Ayush Data fetched successfully',
                data: result
            })
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger('Get all Ayush Data Function is Executed')
    }
}


module.exports = {
    ayushBulkUpload,
    getAllAyushData,
    predictAyush,
    deleteAyushValues,
    getAyushDropdownValues
}
