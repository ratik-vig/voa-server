const express = require('express')
const router = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const db = require('../utils/db')
const queries = require('../utils/queries')
const bcrypt = require('bcrypt')
router.use(express.json())
router.use(cors())

router.get('/getVisitorsByType', (req, res) => {
    db.query(queries.getVisitorsByType, (err, result) => {
        if(err) throw err
        console.log(result)
        res.send(result)
    })
})

router.get('/getTopSellingSKU', (req, res) => {
    console.log('in here')
    db.query(queries.getTopSellingSKUs, (err, result) => {
        if(err) throw err
        console.log(result)
        res.send(result)
    })
})
router.get('/getTopVisitedAtrns', (req, res) => {
    console.log('in here')
    db.query(queries.getTopVisitedAtrns, (err, result) => {
        if(err) throw err
        console.log(result)
        res.send(result)
    })
})
router.post('/login', (req, res) => {
    const {email, password} = req.body
    console.log(email, password)
    db.query(queries.loginUser, [email], (err, result) => {
        if(err) throw err

        if(!result[0]) {
            res.status(404).send({error: 'User does not exist'})
            return
        }
        console.log(result[0])
        if(result[0].is_admin == 0){
            res.status(403).send({error: 'Only admin can login'})
            return
        }
        const passwordMatch = password === result[0].user_password
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
module.exports = router