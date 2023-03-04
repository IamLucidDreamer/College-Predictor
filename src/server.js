/**
 * @author krish
 */
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const mongo = require('./config/mongo')
const { loggerUtil } = require('./utils/logger')

dotenv.config()
const app = express()
const logger = loggerUtil

//mongo connection func call
mongo()

const route = require('./routes/index')
const auth = require('./routes/auth')
const user = require('./routes/user')
const { validationResult } = require('express-validator')

//testing
app.get('/api', (_, res) => {
	res.send('Hello from college predictor BE!')
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

app.use('/api', route)
app.use('/api', auth)
app.use('/api', user)

//connection
const PORT = 8003

app.listen(PORT, () => {
	logger(`Listening on port------ ${PORT}`, 'SERVER')
})
