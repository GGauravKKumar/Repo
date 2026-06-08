const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes')
const batchRoutes = require('./routes/batchRoutes')
const enrolmentRoutes = require('./routes/enrolmentRoutes')

const app = express()
connectDB()
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/batches', batchRoutes)
app.use('/api/enrolments', enrolmentRoutes)

app.listen(1000, () => console.log('Server running on port 1000'))