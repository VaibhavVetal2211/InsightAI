const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized to access this route' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findByPk(decoded.userId);
            next();
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token is invalid' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error authenticating user' 
        });
    }
};

module.exports = { protect };