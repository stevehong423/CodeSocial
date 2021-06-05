//ROUTER FOR USERS 

/*require express and router and validator (to make sure user sends the right data), UserModel (database access), 
gravatar, bcrypt, config, jsonwebtoken*/
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

//@route        POST api/users
//@description  Register user 
//@access       Public (if you don't need a token to access a route)
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    };

    const { name, email, password } = req.body;
    try {
    //see if user exists (if so send error)
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists'}] })
        };

    //get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

    //encrypt password (using bcrypt)
        const salt = await bcrypt.genSalt(10); //<--'salt' is a random string.  
        user.password = await bcrypt.hash(password, salt); //<--hash the password (put it through hashing algorithm) hashing must be used with salt.
        await user.save(); //saves user to database

    //return jsonwebtoken (we return this because we want a user to get logged in right away, which they will need the token)
        const payload = { //<--get payload which includes userid
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload, 
            config.get('jwtSecret'), 
            { expiresIn: 3360000 },  //<--expiration is optional
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;