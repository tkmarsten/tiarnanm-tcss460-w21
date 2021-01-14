let checkToken = require('./jwt.js').checkToken
let jsonError = require('./validate.js').jsonError

module.exports = {
    checkToken, jsonError
  }