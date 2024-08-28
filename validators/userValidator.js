const { body, validationResult } = require('express-validator');

var registerValidation = [
    body('name').not().isEmpty().withMessage('Name is required').isLength({min: 6}).withMessage('name must be at least 6 characters long'),
    body('email').isEmail().withMessage('Please include a valid email').isLength({max: 30}).withMessage('max length should be of 30 chars'),
    body('mobile').isMobilePhone().withMessage('Please include a valid mobile number'),
    body('dob').isDate().withMessage('Please include a valid date of birth'),
    body('address').not().isEmpty().withMessage('Address is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
var validatorUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = {registerValidation,validatorUser};





// var validationSchema = [
//     body('firstName').isLength({min:2,max:10}).withMessage('min 2 max 10 characters allowed').isAlpha().withMessage('Only alphabets are allowed').isLowercase().withMessage('Only lowercase is allowed'),
//     body('lastName').isLength({min:2,max:10}).withMessage('min 2 max 10 characters allowed').isAlpha().withMessage('Only alphabets are allowed').isLowercase().withMessage('Only lowercase is allowed'),
// ];
// var validatorUser = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const data = await User.create({
//             firstName: req.body.firstName,
//             lastName: req.body.lastName
//         });
//         res.status(200).json({data:data});
//     } catch (error) {
//         console.error('Error saving to the database:', error);
//         res.status(500).json({ error: 'Failed to save data' });
//     }
// }