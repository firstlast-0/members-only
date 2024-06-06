var express = require('express');
var router = express.Router();
const control = require('../controllers/control');

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Message = require('../models/message');

router.get('/', asyncHandler(async (req, res, next) => {
    const allMsgs = await Message.find({}).populate("by").exec();
    res.render("index", { allMsgs: allMsgs });
}));

router.post('/', asyncHandler(async (req, res, next) => {
    await Message.findByIdAndDelete(req.body.id);
    res.redirect('/');
}));

router.get('/sign-up', function (req, res, next) {
    res.render('signup-form');
});

router.post('/sign-up', control.signup_post);

router.get('/join-club', function (req, res, next) {
    res.render('join-club');
});

router.post('/join-club', asyncHandler(async (req, res, next) => {
    if (req.body.code === 'qqq') {
        await User.findByIdAndUpdate(req.user.id, {status: 'Club Member'}, {});
        res.render('join-club', {msg: 'Successfully joined!'});
    }

    res.render('join-club', {msg: 'Wrong passcode'});
}));

router.get('/new-msg', function (req, res, next) {
    res.render('new-msg');
});

router.post('/new-msg', asyncHandler(async (req, res, next) => {
    var d = new Date();
    var datestring = (d.getMonth()+1) + "-" + d.getDate() + "-" + d.getFullYear();

    const user = await User.findOne({_id: req.user.id}).exec();
    const message = new Message({ title: req.body.title, text: req.body.msg, date: datestring, by: user });
    await message.save();

    res.redirect('/');
}));

module.exports = router;

