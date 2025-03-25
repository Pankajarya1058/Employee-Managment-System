
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt'


const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne(email)
        if(!user) {
            return res.status(404).json({success: false, error: "User Not Found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(404).json({success: false, error: "Wrong Password"})
        }

        const token = jwt.sign({ id: user.id, role: user.role},
            process.env.JWT_KEY, {expiresIn: "10d"}
        );

        res.status(200).json({success: true, token, user: { id: user.id, name: user.name, role: user.role },
        });

    } catch(error) {
        console.error('Login error:', error.message);
        if (!res.headersSent) {
            return res.status(500).json({success: false, error: error.message})
        }
}
}

const verify = (req, res) =>{
    return res.status(200).json({success: true, user: req.user})
}

export { login, verify }

