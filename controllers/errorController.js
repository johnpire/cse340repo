// Controller to throw an intentional error
exports.throwError = (req, res, next) => {
  try {
    throw new Error("Intentional test error 500")
  } catch (err) {
    next(err)
  }
}