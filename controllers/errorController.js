// controllers/errorController.js
async function triggerError(req, res) {
  // intentionally throw an error
  throw new Error("This is a test 500 error!")
}

module.exports = { triggerError }