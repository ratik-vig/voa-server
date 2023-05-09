const express = require('express')
const router = express()
const cors = require('cors')

const db = require('../utils/db')
const queries = require('../utils/queries')

router.use(express.json())
router.use(cors())

router.post('/issueTicket', async(req, res) => {
    try{
        console.log(req.body.obj)
        db.query(queries.issueParkingTicket, [req.body.obj.inTime, req.body.obj.visitorId], (err, result) => {
            if(err) throw err
            res.send(result)
        })
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/getTicketById', async(req, res) => {
    try{
        const {parking_id} = req.query
        db.query(queries.getParkingTicket, [parking_id], (err, result) => {
            if(err) throw err
            res.send(result)
        })
    }catch(err){
        console.log(err)
    }
})

router.post('/payTicket', async(req, res) => {
    try{
        const {parkingId,
            orderDate,
            orderAmt,
            orderSrc,
            payMethod,
            outTime,
            cardName,
            cardNum,
            cardType,
            expMon,
            expYear,
            cvv,
            } = req.body.obj

        const q = payMethod === 'cash' ? queries.placeOrderCash : queries.placeOrder
        let params = []
        if(payMethod === 'cash'){
            params.push(orderDate)
            params.push(orderSrc)
            params.push(orderAmt)
            params.push(payMethod)
        }else{
            params.push(orderDate)
            params.push(orderSrc)
            params.push(orderAmt)
            params.push(payMethod)
            params.push(cardName)
            params.push(cardNum)
            params.push(expMon)
            params.push(expYear)
            params.push(cvv)
            params.push(cardType)
        }
        db.query(q, params, (err, result) => {
            if(err) throw err
            const orderId = result[0][0].ORDER_ID
            db.query(queries.addExitTime, [outTime, orderId], (err, result) => {
                if(err) throw err
            })
            res.send(result)
        })
    }catch(err){
        console.log(err)
    }
})
 
module.exports = router