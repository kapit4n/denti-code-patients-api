const express = require('express')
const patientRoutes = require('./routes/patientRoutes') 
const app = express()

app.use(express.json())

app.use('/api/patients', patientRoutes)

module.exports = app