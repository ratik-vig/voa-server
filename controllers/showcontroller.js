const express = require('express')
const router = express()
const cors = require('cors')

const db = require('../utils/db')
const queries = require('../utils/queries')

router.use(express.json())
router.use(cors())

router.get('/getShowNames', (req, res) => {
    db.query(queries.getShowNames, (err, result) => {
        if(err) throw err
        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

router.get('/getDetails', (req, res) => {
    const {show_id} = req.query

    db.query(queries.getShowDetails, [show_id], (err, result) => {
        if(err) throw err
        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

router.get('/getTimings', (req, res) => {
    const {show_id} = req.query

    db.query(queries.getShowTimings, [show_id], (err, result) => {
        if(err) throw err
        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

router.post('/buyTicket', (req, res) => {
    // try{
        console.log(req.body.obj)
        const {visitor, order_date, order_src, show_date, show_time, adult, child, senior, payMethod, cardName, cardNum, expMon, expYear, cardCVV, cardType} = req.body.obj
        db.query(queries.placeOrder, [new Date(order_date), "show", 0.0, "online", cardName, cardNum, expMon, expYear, cardCVV, cardType], (err, result) => {
            if(err) throw err
            const orderId = result[0][0].ORDER_ID

            for(let i=0; i<child; i++){
                db.query(queries.addShowTicket, [visitor, orderId, show_time, "child", new Date(show_date)], (err, result) => {
                    if(err) throw err 
                })
            }
            for(let i=0; i<adult; i++){
                db.query(queries.addShowTicket, [visitor, orderId, show_time, "adult", new Date(show_date)], (err, result) => {
                    if(err) throw err 
                })
            }
            for(let i=0;i<senior;i++){
                db.query(queries.addShowTicket, [visitor, orderId, show_time, "senior", new Date(show_date)], (err, result) => {
                    if(err) throw err 
                })
            }
            res.send(result)
        })}
    // catch(error){
    //     console.log(error)
    //     // res.send(error)
    // }
)

router.get('/getOrderDetails', (req, res) => {
    const { order_id } = req.query
    db.query(queries.getShowOrderDetails, [order_id], (err, result) => {
        if(err) throw err
        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

router.get('/getShowTime', (req, res) => {
    const { time_id } = req.query
    db.query(queries.getShowTime, [time_id], (err, result) => {
        if(err) throw err
        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

module.exports = router