var db = require('../models')
var User = db.user;

const { body, validationResult } = require('express-validator');

var validationSchema = [
    body('firstName').isLength({min:2,max:10}).withMessage('min 2 max 10 characters allowed').isAlpha().withMessage('Only alphabets are allowed').isLowercase().withMessage('Only lowercase is allowed'),
    body('lastName').isLength({min:2,max:10}).withMessage('min 2 max 10 characters allowed').isAlpha().withMessage('Only alphabets are allowed').isLowercase().withMessage('Only lowercase is allowed'),
];
var validatorUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const data = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        res.status(200).json({data:data});
    } catch (error) {
        console.error('Error saving to the database:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
}

module.exports = {validationSchema,validatorUser};