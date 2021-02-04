//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const getHash = require('../utilities/exports').getHash

const router = express.Router()

const isProvided = require('../utilities/exports').helpers.isProvided

//Pull in the JWT module along with out a secret key
const jwt = require('jsonwebtoken')
const config = {
    secret: process.env.JSON_WEB_TOKEN
}

/**
 * @api {get} /auth Request to sign a user in the system
 * @apiName GetAuth
 * @apiGroup Auth
 * 
 * @apiHeader {String} authorization "username:password" uses Basic Auth 
 * 
 * @apiSuccess {boolean} success true when the name is found and password matches
 * @apiSuccess {String} message Authentication successful!
 * @apiSuccess {String} token JSON Web Token
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (404: User Not Found) {String} message "User not found"
 * 
 * @apiError (400: Invalid Credentials) {String} message "Credentials did not match"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 */
router.get('/', (request, response, next) => {
    if (isProvided(request.headers.authorization) || request.headers.authorization.startsWith('Basic ')) {
        next()
    } else {
        response.status(401).json({ message: 'Missing Authorization Header' })
    }
}, (request, response, next) => {
    // obtain auth credentials from HTTP Header
    const base64Credentials = request.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [email, password] = credentials.split(':')

    if (isProvided(email) && isProvided(password)) {
        request.auth = {
            "email": email,
            "password": password
        }
        next()
    } else {
        response.status(400).send({
            message: "Malformed Authorization Header"
        })
    }
}, (request, response) => {
    const theQuery = "SELECT Password, Salt, MemberId FROM Members WHERE Email=$1"
    const values = [request.auth.email]
    pool.query(theQuery, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: 'User not found'
                })
                return
            }
            let salt = result.rows[0].salt
            //Retrieve our copy of the password
            let ourSaltedHash = result.rows[0].password

            //Combined their password with our salt, then hash
            let theirSaltedHash = getHash(request.auth.password, salt)

            //Did our salted hash match their salted hash?
            if (ourSaltedHash === theirSaltedHash) {
                //credentials match. get a new JWT
                let token = jwt.sign(
                    {
                        "email": request.auth.email,
                        "memberid": result.rows[0].memberid
                    },
                    config.secret,
                    {
                        expiresIn: '14 days' // expires in 14 days
                    }
                )
                //package and send the results
                response.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                })
            } else {
                //credentials dod not match
                response.status(400).send({
                    message: 'Credentials did not match'
                })
            }
        })
        .catch((err) => {
            //log the error
            console.log(err.stack)
            response.status(400).send({
                message: err.detail
            })
        })
})

module.exports = router