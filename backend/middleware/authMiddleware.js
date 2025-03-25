

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();



const verifyUser = async (req, res, next) => {
    // console.log('🔒 Auth middleware triggered');

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1].trim();
        if (!token) {
            return res.status(401).json({ success: false, error: 'Token not provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // console.log('Decoded Token:', decoded);
        if (!decoded) {
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }

        // const user = await User.findById(decoded.id).select('-password');
        const user = await User.findById(decoded.id);
        // console.log('User Found:', user);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({ success: false, error: error.message || 'Server error' });
    }
};

export default verifyUser;
