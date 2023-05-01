const express = require('express')
const router = express()
const cors = require('cors')

const db = require('../utils/db')
const queries = require('../utils/queries')

router.use(express.json())
router.use(cors())

router.get('/getAttractionNames', (req, res) => {
    db.query(queries.getAttractionNames, (err, result) => {
        if(err) throw err

        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

router.get('/getAttractionById', (req, res) => {
    const {atrn_id} = req.query

    db.query(queries.getAttractionById, [atrn_id], (err, result) => {
        if(err) throw err

        if(!result[0]) {
            res.sendStatus(404)
            return
        }
        res.send(result)
    })
})

module.exports = router