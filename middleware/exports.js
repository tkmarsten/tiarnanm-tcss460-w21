let checkToken = require('./jwt.js').checkToken
const checkTokenCookies = require('./jwt.js').checkTokenCookies
const jwt = require('./jwt.js')
let jsonError = require('./validate.js').jsonError

let example = (request, response, next) => {
  let flag = false
  console.log('I am a middleware function')

  if (flag) {
    console.log('Looks good here, moving on to the next function')
    next()
  } else {
    console.log('Oh no. STOP!!!')
    response.status(400).send({
      message: "We had to STOP!"
    })
  }
}

module.exports = {
    checkToken, jsonError, example, checkTokenCookies
  }