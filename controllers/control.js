const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Message = require('../models/message');

exports.signup_post = [
    body('first', 'First name must not be empty').trim().isLength({ min: 1 }).escape(),
    body('last', 'Last name must not be empty').trim().isLength({ min: 1 }).escape(),
    body('username', 'Username must not be empty').trim().isLength({ min: 1 }).escape(),
    body('password', 'Password must not be empty').trim().isLength({ min: 1 }).escape(),
    body('conpass', 'Confirm Password must not be empty').trim().isLength({ min: 1 }).escape(),
    body('conpass', 'Passwords do not match').custom((value, { req }) => {
        return value === req.body.password;
    }),
    // Process request after validation and sanitization.

    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const userExists = await User.findOne({username: req.body.username}).exec();

        // Create a Book object with escaped and trimmed data.
        let user = new User({
            first: req.body.first,
            last: req.body.last,
            username: req.body.username,
            password: req.body.password,
            status: 'Member',
            Admin: req.body.admin
        });

        if (userExists) {
            res.render('signup-form', {user: user, errors: [{msg: 'Username already exists'}]});
        } else if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.render('signup-form', {
                user: user,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save book.
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) next(err);
        
                user.password = hashedPassword;
                await user.save();
            });
            
            res.redirect('/');
        }
    }),
];
