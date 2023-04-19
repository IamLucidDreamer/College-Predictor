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
const blog = require('./routes/blog')
const updates = require('./routes/updates')
const college = require('./routes/college')
const subscriber = require('./routes/subscriber')
const { validationResult } = require('express-validator')
const { createSiteData } = require('./helpers/fileHelper')

//testing
app.get('/college-api', (_, res) => {
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

app.post("/college-api/document", createSiteData)

app.use('/college-api', route)
app.use('/college-api', auth)
app.use('/college-api', user)
app.use('/college-api', blog)
app.use('/college-api', updates)
app.use('/college-api', college)
app.use('/college-api', subscriber)


//connection
const PORT = 8004

app.listen(PORT, () => {
	logger(`Listening on port------ ${PORT}`, 'SERVER')
})
