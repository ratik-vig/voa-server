const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config() 

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'voa',
    timezone: 'utc'
})

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT
// })

// connection.connect(err => {
//     if (err) throw err
//     console.log('connection to db successful')
// })

module.exports = connection