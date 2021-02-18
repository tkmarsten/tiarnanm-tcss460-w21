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

module.exports = router