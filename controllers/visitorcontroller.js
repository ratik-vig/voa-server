const express = require('express')
const router = express()
const cors = require('cors')

const db = require('../utils/db')
const queries = require('../utils/queries')

router.use(express.json())
router.use(cors())

router.get('/getFutureVisitorsByUId', (req, res) => {
    const {user_id} = req.query
    console.log('check date', new Date().toISOString().split('T')[0])
    db.query(queries.getFutureVisitorsByUId, [user_id, new Date().toISOString().split('T')[0]], (err, result) => {
        if(err) throw err

        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

router.get('/getVisitorsByIdDate', (req, res) => {
    const {user_id, show_date} = req.query

    db.query(queries.getVisitorsByIdDate, [user_id, show_date], (err, result) => {
        if(err) throw err

        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

router.get('/getHolidaysByDate', (req, res) => {
    const {check_date} = req.query
    console.log(check_date)
    db.query(queries.getHolidaysByDate, [check_date], (err, result) => {
        if(err) throw err

        if(!result[0]) {
            res.status(200).send([])
            return
        }
        res.send(result)
    })
})

module.exports = router