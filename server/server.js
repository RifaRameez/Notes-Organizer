require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connection  = require('./config/db')

const userRoutes = require('./routes/userRouter')
const notFound = require('./middleware/error')

const app = express()
app.use(express.json())
app.use(cors())

connection()

app.use('/api/users', userRoutes)
app.use(notFound)

const port = process.env.PORT || 5000

app.listen(port, () => console.log('server is up and running at', port))