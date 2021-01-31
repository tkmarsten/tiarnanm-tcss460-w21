//express is the framework we're going to use to handle requests
const express = require('express')

//retrieve the router project from express
let router = express.Router()

//Checks if a string exists and is not empty. Used for parameters. 
function isProvided(param) {
    return param !== undefined && param.length > 0
}

function reverse(text) {
    return text.split("").reverse().join("")
}

function palindrome(phrase, strict = true) {
    let re = /[\W_]/g
    let lowRegStr = strict ? phrase : phrase.toLowerCase().replace(re, '')
    let reverseStr = reverse(lowRegStr) 
    return reverseStr === lowRegStr
  }

router.get("/word", (request, response) => {
    if (isProvided(request.query.word)) { 
        response.send({
            //req.query is a reference to arguments in the POST body
            message: `${reverse(request.query.word)}`
        })
    } else {
        response.status(400)
        response.send({
            message: "Missing required information"
        })
    }
}) 

router.post("/palindrome", (request, response) => {
    if (isProvided(request.body.phrase)) {
        response.send({
            isPalindrome: palindrome(request.body.phrase, request.body.strict)
        })
    } else {
        response.status(400)
        response.send({
            message: "Missing required information"
        })
    }
})

router.get("/names", (request, response) => {
    let first = request.query.first
    let last = request.query.last
    if (isProvided(first) && isProvided(last)) { 
        let names = [
            { 'first':first, 'last': last},
            { 'first':reverse(first), 'last': last},
            { 'first':first, 'last': reverse(last)},
            { 'first':reverse(first), 'last': reverse(last)},
            { 'first':last, 'last': first},
            { 'first':reverse(last), 'last': first},
            { 'first':last, 'last': reverse(first)},
            { 'first':reverse(last), 'last': reverse(first)}
        ]
        response.send({ 'count': 8, 'names':names})
    } else {
        response.status(400)
        response.send({
            message: "Missing required information"
        })
    }
   
})

// "return" the router
module.exports = router