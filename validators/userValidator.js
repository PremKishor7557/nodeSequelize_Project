const { body, validationResult } = require('express-validator');

var registerValidation = [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('mobile', 'Please include a valid mobile number').isMobilePhone(),
  body('dob', 'Please include a valid date of birth').isDate(),
  body('address', 'Address is required').not().isEmpty(),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];
const validateImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ errors: [{ msg: 'Image is required' }] });
  }
  next();
};
var loginValidation = [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('mobile', 'Please include a valid mobile number').isMobilePhone(),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];
var validationSchema = [
    body('firstName').isLength({min:2,max:10}).withMessage('min 2 max 10 characters allowed').isAlpha().withMessage('Only alphabets are allowed').isLowercase().withMessage('Only lowercase is allowed'),
    body('lastName').isLength({min:2,max:10}).withMessage('min 2 max 10 characters allowed').isAlpha().withMessage('Only alphabets are allowed').isLowercase().withMessage('Only lowercase is allowed'),
];
var validatorUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}
module.exports = {
  registerValidation,
  validateImage,
  loginValidation,
  validationSchema,
  validatorUser
};