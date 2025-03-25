import pool from '../db/db.js';

const findOne = async (email) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0]; // Returns the first matching user or undefined
    } catch (error) {
        console.error('Error finding user:', error.message);
    }
};

const findById = async (id) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0]; // Returns the user with the given ID or undefined
    } catch (error) {
        console.error('Error finding user by ID:', error.message);
    }
};

export default { findOne, findById };
