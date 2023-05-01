const {body, validationResult} = require('express-validator')

const loginUser = [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({min: 8}).withMessage('Password must have 8 characters'),
    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) res.status(400).send({errors: errors.array()})
        else next()
    }
]

const createUser = [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({min: 8}).withMessage('Password must have 8 characters'), 
    body('is_admin').isBoolean().withMessage('is_admin required'),
    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).send({errors: errors.array()})
        }else{
            next()
        }
    }
]

module.exports = {loginUser, createUser}