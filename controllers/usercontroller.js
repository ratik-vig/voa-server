const express = require('express')
const router = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

const fileUpload = require('express-fileupload')
const AWS = require('aws-sdk')

const db = require('../utils/db')
const userValidators= require('../validators/userValidators')
const queries = require('../utils/queries')

router.use(express.json())
router.use(cors())
dotenv.config()

AWS.config.update({region: 'us-east-2'})

router.use(fileUpload({ limits: { fileSize: 50*1024*1024 } }))

s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET
    }
})

router.post('/register', userValidators.createUser, (req, res) => {
    const { email, password, is_admin, is_member } = req.body
    db.query(queries.checkIfUserExists, [email], (err, results) => {

        if(err) throw err        
        if(results[0].count == 1){
            res.status(400).send('User already exists')
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        db.query(queries.createUser, [email, hashedPassword, is_admin, is_member], (error, result) => {
            if(error) throw error
            if(result.affectedRows){
                res.status(200).send('User created')
            }
        })
    })
})

router.post('/login', userValidators.loginUser, (req, res) => {
    const {email, password} = req.body
    console.log(email, password)
    db.query(queries.loginUser, [email], (err, result) => {
        if(err) throw err

        if(!result[0]) {
            res.status(404).send({error: 'User does not exist'})
            return
        }
        const passwordMatch = bcrypt.compareSync(password, result[0].user_password)
        if(passwordMatch){
            console.log(result)
            jwt.sign({
                data: {userId: result[0].user_id, email: result[0].user_email, is_admin: result[0].is_admin}
              }, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
                if(err) throw err
                res.status(200).send(token)
              })
        }else{
            res.status(401).send({error: "Incorrect password"})
        }
    })
})

router.post('/buyTickets', (req, res) => {

    let {
        userId,
        ticketMethod,
        ticketType,
        visitDate,
        payMethod,
        cardName,
        cardNum,
        expMon,
        expYear,
        cardCVV,
        cardType,
        visitors
    } = req.body.obj
    visitors = JSON.parse(visitors)
    try{
        db.query(queries.buyTicket, [
            userId, 
            ticketMethod, 
            ticketType, 
            visitDate, 
            new Date(new Date().toLocaleString('en', {timeZone: 'America/New_York'})),
            payMethod,
            cardName,
            cardNum,
            expMon,
            expYear,
            cardCVV,
            cardType
            ], (err, result) => {
            if(err) throw err
            console.log(result)
            const ticketID = result[0][0].TIC_ID
            const orderID = result[1][0].ORDER_ID
            visitors.map(visitor => {
                db.query(queries.addVisitorToTicket, [ticketID, visitor.fname, visitor.lname, visitor.dob, visitor.email, visitor.phone, visitor.addr, visitor.city, visitor.state, visitor.zip], (err, result) => {
                    if(err) throw err
                    
                }) 
            })
            res.status(200).send({orderID})
        })
    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

router.get('/ticketOrderDetails', (req, res) => {
    const { order_id } = req.query
    console.log(order_id)
    db.query(queries.ticketOrderDetails, [order_id], (err, result) => {
        if(err) throw err
        console.log(result)
        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

router.post('/uploadImages', (req, res) => {
    const uploadParams = {
        Bucket: 'voa-imgs',
        Key: req.files.file.name,
        Body: Buffer.from(req.files.file.data),
        ContentType: req.files.file.mimetype,
        ACL: 'public-read'
    }

    s3.upload(uploadParams, (err, data) => {
        if(err) console.log('error', err)
        if(data) console.log(data.Location)
    })

    res.send("upload successful")
    
})
module.exports = router