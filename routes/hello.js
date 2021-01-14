//express is the framework we're going to use to handle requests
const express = require('express')

//retrieve the router project from express
var router = express.Router()

router.get("/", (request, response) => {
    //this is a Web page so set the content-type to HTML
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.write('<html><head><title>Hello World From Node.js</title>' +
        '</head><body><div><h1>My First Heading</h1>' +
        '<p>My first paragraph.</p></div></body></html>')
    response.end() //end the response
})


// "return" the router
module.exports = router