const dotenv = require('dotenv')
const formidable = require('formidable')
const { loggerUtil: logger } = require("../utils/logger")
const { S3Client, PutObjectAclCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require("fs")

dotenv.config()

const createSiteData = async (req, res) => {
    try {
        const form = new formidable.IncomingForm()
        form.parse(req, async (err, fields, { file }) => {
            if (err) {
                logger(err, 'ERROR')
                res.status(SC.BAD_REQUEST).json({
                    error: 'Problem occurred with file!'
                })
            }
            if (file) {
                if (file.size > 3000000) {
                    res.status(SC.BAD_REQUEST).json({
                        error: 'File size should be less than 3 MB'
                    })
                } else {
                    const {
                        siteId,
                        secondaryInput,
                        primaryInput,
                        hecRasInput,
                        typeOfData,
                        format,
                        extension,
                        applicabeSector = ''
                    } = fields
                    const data = {
                        siteId: +siteId,
                        secondaryInput,
                        primaryInput,
                        hecRasInput,
                        typeOfData,
                        format,
                        extension,
                        applicabeSector: applicabeSector?.split(',') || []
                    }
                    const fileName = file.originalFilename
                    const client = new S3Client({
                        region: 'ap-south-1',
                        credentials: {
                            accessKeyId: process.env.ACCESS_KEY,
                            secretAccessKey: process.env.ACCESS_SECRET
                        }
                    })
                    const bucketParams = {
                        Bucket: process.env.BUCKET_NAME,
                        Key: fileName,
                        Body: fs.createReadStream(file.filepath),
                    }
                    await client
                        .send(new PutObjectCommand(bucketParams))
                        .then(async () => {
                            await client
                                .send(
                                    new PutObjectAclCommand({
                                        ACL: 'public-read',
                                        Bucket: process.env.BUCKET_NAME,
                                        Key: fileName
                                    })
                                )
                                .then(async response => {
                                    if (response.$metadata.httpStatusCode === 200) {
                                        // await create(prisma.siteData, {
                                        //     ...data,
                                        //     siteFileLink: `https://${process.env.BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${fileName}`
                                        // })
                                        //     .then(value => {
                                        //         return res.status(SC.OK).json({
                                        //             message: 'Site data created successfully!',
                                        //             data: value
                                        //         })
                                        //     })
                                        //     .catch(err => {
                                        //         logger(err, 'ERROR')
                                        //         return res.status(SC.BAD_REQUEST).json({
                                        //             error: 'Failed to add site data in DB!'
                                        //         })
                                        //     })
                                        res.json({ url: `https://${process.env.BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${fileName}` })
                                    } else {
                                        res.status(SC.BAD_REQUEST).json({
                                            error: 'Cannot able to process file!'
                                        })
                                    }
                                })
                        })
                }
            } else {
                res.status(SC.NOT_FOUND).json({
                    error: 'File not found!'
                })
            }
        })
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger(`Create Site Data API Called!`)
    }
}

module.exports = { createSiteData }