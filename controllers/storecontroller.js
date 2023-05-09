const express = require('express')
const router = express()
const cors = require('cors')

const db = require('../utils/db')
const queries = require('../utils/queries')

router.use(express.json())
router.use(cors())

router.get('/getStoreNames', (req, res) => {
    db.query(queries.getStoreNames, (err, result) => {
        if(err) throw err

        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

router.get('/getStoreById', (req, res) => {
    const {store_id} = req.query

    db.query(queries.getStoreById, [store_id], (err, result) => { 
        if(err) throw err

        if(!result[0]) {
            res.sendStatus(404)
            return
        } 
        res.send(result)
    })
}) 

router.get('/getSkusById', (req, res) => {
    const {store_id} = req.query

    db.query(queries.getSkusById, [store_id], (err, result) => {
        if(err) throw err

        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

router.post('/placeOrder', (req, res) => {
    const {visitorId, payMethod, items, cardDetails} = req.body.obj
    console.log(visitorId, payMethod, items, cardDetails)
    console.log(cardDetails.cardName, cardDetails.cardNum, cardDetails.expMon, cardDetails.expYear, cardDetails.cardCVV, cardDetails.cardType)
    db.query(queries.placeOrder, [new Date(), "store", 0.0, "online", cardDetails.cardName, cardDetails.cardNum, cardDetails.expMon, cardDetails.expYear, cardDetails.cardCVV, cardDetails.cardType], (err, result) => {
        if(err) throw err
        const orderId = result[0][0].ORDER_ID

        JSON.parse(items).map(item => {
            console.log(item.sku_id, item.qty)
            db.query(queries.addItemsToOrder, [visitorId, orderId, item.sku_id, item.qty], (err, result) => {
                if(err) throw err
                
            }) 
        })
        res.send(result)
    })
})

router.get('/getOrderDetails', (req, res) => {
    const { order_id } = req.query
    db.query(queries.getStoreOrderDetails, [order_id], (err, result) => {
        if(err) throw err
        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})


module.exports = router 