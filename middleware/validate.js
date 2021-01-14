let jsonError = (err, req, res, next) => {

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      res.status(400).send({ message: "malformed JSON in parameters" })
    } 
    else {
      next()
    }
  }

  module.exports = { jsonError }