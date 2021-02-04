//express is the framework we're going to use to handle requests
const express = require('express')

//retrieve the router project from express
var router = express.Router()

const isProvided = require('../utilities/exports').helpers.isProvided

/**
 * @api {get} /hello Request a Hello World message
 * @apiName GetHello
 * @apiGroup Hello
 *
 * @apiSuccess {String} message Hello World message
 */
router.get("/hello", (request, response) => {
    response.send({
        message: "Hello, you sent a GET request"
    })
})

/**
 * @api {post} /hello Request a Hello World message
 * @apiName PostHello
 * @apiGroup Hello
 * 
 * @apiSuccess {String} message Hello World message
 */
router.post("/hello", (request, response) => {
    response.send({
        message: "Hello, you sent a POST request"
    })
})

/**
 * @api {get} /params Request an message echo with a parameter 
 * @apiName GetParams
 * @apiGroup Params
 * 
 * @apiParam {String} name someone's name
 * 
 * @apiSuccess {String} message Hello World message with echo of name
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 */
router.get("/params", (request, response) => {
    if (isProvided(request.query.name)) {
        response.send({
            //req.query is a reference to arguments in the POST body
            message: "Hello, " + request.query.name + "! You sent a GET Request"
        })
    } else {
        response.status(400)
        response.send({
            message: "Missing required information"
        })
    }
})

/**
 * @api {post} /params Request an message echo with a parameter 
 * @apiName PostParams
 * @apiGroup Params
 * 
 *  @apiParamExample {json} Request-Body-Example:
 *     {
 *       "name": "Charles"
 *     }
 * 
 * @apiParam {String} name someone's name
 * 
 * @apiSuccess {String} message Hello World message with echo of name
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 */
router.post("/params", (request, response) => {
    if (isProvided(request.body.name)) {
        response.send({
            //req.body is a reference to arguments in the POST body
            message: "Hello, " + request.body.name + "! You sent a POST Request"
        })
    } else {
        response.status(400)
        response.send({
            message: "Missing required information"
        })
    }
})

module.exports = router