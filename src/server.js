/**
 * @author krish , Manas
 */

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const mongo = require('./config/mongo')
const { loggerUtil: logger } = require('./utils/logger')
const { statsCode: SC } = require("./utils/statusCode")

dotenv.config()
const app = express()

//mongo connection func call
mongo()

const { routesV1 } = require('./routes/index')

const { validationResult } = require('express-validator')

//testing
app.get('/api/v1/test', (_, res) => {
	res.status(SC.OK).send("Hello from college predictor BE! Version 1 API's are working.")
})

//validate req
app.use((req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.status(SC.WRONG_ENTITY).json({ error: errors.array() })
	}
	next()
})

//built-in middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())

// Routes 
routesV1(app)

//connection
const PORT = process.env.PORT || 8004

app.listen(PORT, () => {
	logger(`Listening on port--------- ${PORT}`, 'SERVER')
})
