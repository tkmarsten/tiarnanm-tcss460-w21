//express is the framework we're going to use to handle requests
const express = require('express')

const router = express.Router()

const pool = require('../utilities/exports').pool

const isProvided = require('../utilities/exports').helpers.isProvided

/**
 * @apiDefine JSONError
 * @apiError (400: JSON Error) {String} message "malformed JSON in parameters"
 */

/**
 * @api {get} /orders Request to get all Order entries in the DB
 * @apiName GetOrders
 * @apiGroup Orders
 *
 * @apiHeader {String} authorization Valid JSON Web Token JWT 
 * 
 * @apiParamExample {json} Request-Query-Example:
 *     https://uwnetid-tcss460-w21.herokuapp.com/orders
 * 
 * @apiSuccess {Object[]} orders List of Orders in the database
 * 
 * @apiError (404: No Orders Found) {String} message "No Orders"
 * @apiError (400: JSON Error) {String} message "malformed JSON in parameters"
 * @apiError (403: JSON Error) {String} message "Token is not valid" when a JWT is provided but it is expired or otherwise not valid
 * @apiError (401: JSON Error) {String} message "Auth token is not supplied" when a JWT is not provided or it is provided in an incorrect format
 * 
 * @apiUse JSONError
 */
router.get("/", (request, response) => {

    // const theQuery = 
    //     `SELECT My_Size, My_Color, Option1, Option2, Option3 
    //      FROM Orders`

    const theQuery =
        `SELECT My_Size, My_Color, Option1, Option2, Option3 
         FROM Orders
         WHERE MemberID=$1`
    let values = [request.decoded.memberid]

    // const theQuery = 
    //     `SELECT * 
    //      FROM Orders`

    pool.query(theQuery, values)
        .then(result => {
            if (result.rowCount > 0) {
                response.send({
                    orders: result.rows
                })
            } else {
                response.status(404).send({
                    message: "No Orders"
                })
            }
        })
        .catch(err => {
            //log the error
            // console.log(err.details)
            response.status(400).send({
                message: err.detail
            })
        })
})

/**
 * @apiDefine JSONError
 * @apiError (400: JSON Error) {String} message "malformed JSON in parameters"
 */

/**
 * @api {post} /orders Request to get all Order entries in the DB
 * @apiName PostOrder
 * @apiGroup Orders
 *
 * @apiHeader {String} authorization Valid JSON Web Token JWT 
 * 
 * @apiParamExample {json} Request-Query-Example:
 *     https://uwnetid-tcss460-w21.herokuapp.com/orders
 * @apiSuccess {boolean} success true when inserted
 * @apiSuccess {Object[]} orders List of Orders in the database
 * 
 * @apiError (400: JSON Error) {String} message "malformed JSON in parameters"
 * @apiError (403: JSON Error) {String} message "Token is not valid" when a JWT is provided but it is expired or otherwise not valid
 * @apiError (401: JSON Error) {String} message "Auth token is not supplied" when a JWT is not provided or it is provided in an incorrect format
 * 
 * @apiUse JSONError
 */
router.post('/', (request, response, next) => {
    if (isProvided(request.body.size)) {
        if (["small", "medium", "large"].includes(request.body.size)) {
            next()
        } else {
            response.status(400).send({
                message: "Invalid parameter(s)"
            })
        }
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }
}, (request, response, next) => {
    if (isProvided(request.body.color)) {
        if (["red", "green", "blue"].includes(request.body.size)) {
            next()
        } else {
            response.status(400).send({
                message: "Invalid parameter(s)"
            })
        }
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }
}, (request, response, next) => {
    if (isProvided(request.body.option1 && request.body.option2 && request.body.option3)) {
        const booleans = ["t", "true", "y", "yes", "on", "1", "f", "false", "n", "no", "off", "0"]
        if (booleans.includes(option1) && booleans.includes(option2) && booleans.includes(option3)) {
            next()
        } else {
            response.status(400).send({
                message: "Invalid parameter(s)"
            })
        }
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }
}, (request, response) => {
    let theQuery = "INSERT INTO Orders(MemberID, My_Size, My_Color, Option1, Option2, Option3) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
    let theValues = [request.decoded.memberid, request.body.size, request.body.color, request.body.option1, request.body.option2, request.body.option3]
    pool.query(theQuery, theValues)
        .then(result => {
            response.status(201).send({
                success: true,
                message: "Inserted: " + result.rows[0].name
            })
        })
        .catch(err => {
            console.log(err)
            response.status(400).send({
                message: err.detail
            })
        })
})

module.exports = router