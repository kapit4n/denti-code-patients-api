const express = require('express')
const patientRoutes = require('./routes/patientRoutes') 
const paymentRoutes = require('./routes/paymentRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(express.json())

app.use('/api/patients', patientRoutes)
app.use('/api/payments', paymentRoutes)

app.use(errorHandler)

module.exports = app