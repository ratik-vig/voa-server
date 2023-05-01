const express = require('express')
const router = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const fileUpload = require('express-fileupload')
const AWS = require('aws-sdk')

const db = require('../utils/db')
const userValidators= require('../validators/userValidators')
const queries = require('../utils/queries')

router.use(express.json())
router.use(cors())

AWS.config.update({region: 'us-east-2'})

router.use(fileUpload({ limits: { fileSize: 50*1024*1024 } }))

s3 = new AWS.S3({
    credentials: {
        accessKeyId: "AKIAQUQGRZJU3JVT2XUX",
        secretAccessKey: "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"
    }
})

router.post('/register', userValidators.createUser, (req, res) => {
    const { email, password, is_admin } = req.body
    db.query(queries.checkIfUserExists, [email], (err, results) => {

        if(err) throw err        
        if(results[0].count == 1){
            res.status(400).send('User already exists')
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        db.query(queries.createUser, [email, hashedPassword, is_admin], (error, result) => {
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
        // const passwordMatch = password === result[0].password
        const passwordMatch = bcrypt.compareSync(password, result[0].user_password)
        if(passwordMatch){
            jwt.sign({
                data: {email: result[0].email, is_admin: result[0].is_admin}
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

    const {visitors, ticket_method} = req.body
    let visitorId = 0
    let ticketOrderId = 0

    db.query(queries.getVisitorLock, (err, result) => {
        if(err) throw(err)
        
        db.query(queries.findLastAddedVisitor, (err, result) => {
            if(err) throw (err)
    
            if(result[0]){
                visitorId = result[0].visitor_id + 1
            }else{
                visitorId = 1
            }

            db.query(queries.createTicketOrder, [Date.now(), 0], (err, result) => {
                if(err) throw (err)

                db.query(queries.findLastTicketOrder, (err, result) => {
                    if(err) throw (err)
            
                    if(result[0]){
                        ticketOrderId = result[0].t_order_id
                        console.log(ticketOrderId)
                    }else{
                        t_order_id = 1
                    }

                    visitors.map(visitor => {
                        db.query(queries.createVisitor, [...visitor], (err, result) => {
                            if(err) throw (err) 
                            console.log(visitorId)
                            db.query(queries.createTicket, [ticket_method, "adult", "group",visitorId, ticketOrderId], (err, result) => {
                                if(err) throw (err) 
                                
                                db.query(queries.createVisit, [Date.now(), visitorId], (err, result) => {
                                    if(err) throw (err)
                                    if(result){
                                        visitorId++
                                    }
                                })
                            })
                        })
                        
                    })

                })
            })
    
        })
        db.query(queries.relaseVisitorLock, (err, result) => {
            if(err) throw err
            if(result){
                res.send(200)
            }
        })

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