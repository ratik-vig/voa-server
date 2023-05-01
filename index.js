const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const userController = require('./controllers/usercontroller')
const attractionController = require('./controllers/attractioncontroller')
const showcontroller = require('./controllers/showcontroller')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello world')
})

app.use('/api/v1/users', userController)
app.use('/api/v1/attractions', attractionController)
app.use('/api/v1/shows', showcontroller)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})