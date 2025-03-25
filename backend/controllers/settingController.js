import User from '../models/User.js';
import bcrypt from 'bcrypt'
import pool from '../db/db.js';


const changePassword = async (req, res) => {
    try {
        console.log("Entered in change password backend....")
        const {userId, oldPassword, newPassword} = req.body;
        const user = await User.findById(userId);
        console.log(userId)
        console.log(user)
        if(!user) {
            return res.status(404).json({success: false, error: "User Not Found"})
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password)
        console.log(user.password)
        if(!isMatch) {
            return res.status(404).json({success: false, error: "Wrong Old Password"})
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        console.log(hashPassword)
        const [result] = await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashPassword, userId]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, error: "Failed to update password" });
        }

        res.status(200).json({ success: true, message: "Password updated successfully" });

    } catch(error) {
        return res.status(500).json({success: false, error: "setting error"})
    }
    
}

export default changePassword;