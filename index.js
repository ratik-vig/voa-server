const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const userController = require('./controllers/usercontroller')
const attractionController = require('./controllers/attractioncontroller')
const showController = require('./controllers/showcontroller')
const storeController = require('./controllers/storecontroller')
const visitorController = require('./controllers/visitorcontroller')
const parkingController = require('./controllers/parkingcontroller')
const adminController = require('./controllers/admincontroller')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello world')
})

app.use('/api/v1/users', userController)
app.use('/api/v1/attractions', attractionController)
app.use('/api/v1/shows', showController)
app.use('/api/v1/stores', storeController)
app.use('/api/v1/visitors', visitorController)
app.use('/api/v1/parking', parkingController)
app.use('/api/v1/admin', adminController)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})