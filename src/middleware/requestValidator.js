const { body, validationResult } = require('express-validator')

const postValidator = [
  body('FirstName').notEmpty().withMessage('First name is required').isString(),
  body('LastName').notEmpty().withMessage('Last name is required').isString(),
  body('DateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date of birth must be YYYY-MM-DD'),
  body('ContactPhone').notEmpty().withMessage('Contact phone is required').isMobilePhone('any'),
  body('Email').optional({ values: 'falsy' }).isEmail().withMessage('Must be a valid email'),
  body('Gender').optional({ values: 'falsy' }).isString(),
  body('Address').optional({ values: 'falsy' }).isString(),
  body('MedicalHistorySummary').optional({ values: 'falsy' }).isString(),
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
