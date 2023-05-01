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

module.exports = router