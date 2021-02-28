/*
 * Source provided by: https://github.com/auth0/node-jsonwebtoken
 */
const jwt = require('jsonwebtoken')
const config = {
    secret: process.env.JSON_WEB_TOKEN
};

let checkToken = (request, response, next) => {
  let token = request.headers['x-access-token'] || request.headers['authorization'] // Express headers are auto converted to lowercase
  helper(request, response, next, token)
};

let checkTokenCookies = (request, response, next) => {

console.log(request.cookies.access_token)

  helper(request, response, next, request.cookies.access_token)
}

function helper(request, response, next, token) {
  if (token) {
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return response.status(403).json({
          success: false,
          message: 'Token is not valid'
        })
      } else {
        request.decoded = decoded
        next()
      }
    })
  } else {
    return response.status(401).json({
      success: false,
      message: 'Auth token is not supplied'
    })
  }
}

module.exports = {
  checkToken, checkTokenCookies
}
