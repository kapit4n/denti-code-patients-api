const express = require('express')
const patientRoutes = require('./routes/patientRoutes') 
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(express.json())

app.use('/api/patients', patientRoutes)

app.use(errorHandler)

module.exports = app