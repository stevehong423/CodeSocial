//AUTH MIDDLEWARE

const jwt =require('jsonwebtoken');
const config = require('config');


module.exports = function (req, res, next) {
    //get token from header 
    const token = req.header('x-auth-token');

    //check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    };

    //verify token 
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); //<--if token valid, it will be decoded
        req.user = decoded.user; //<--set req.user to the user in the decoded token
        next(); //<--we can then use req.user in any of our routes
    } catch (error) { //<--if there is a token but it's not valid
        res.status(401).json({ msg: 'Token is not valid' });
    }
};