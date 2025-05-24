const { body, validationResult } = require('express-validator')

const postValidator = [
  body('FirstName').notEmpty().withMessage('First name is required').isString(),
  body('LastName').notEmpty().withMessage('Last name is required').isString(),
  body('ContactPhone').notEmpty().withMessage('Contact phone is required').isMobilePhone('any'),
  body('Email').optional().isEmail().withMessage('Must be a valid email')
]

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    return next()
  }

  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({[err.path]: err.msg }))

  return res.status(400).json({
    errors: extractedErrors
  })
}

module.exports = {
  postValidator,
  validate
}
