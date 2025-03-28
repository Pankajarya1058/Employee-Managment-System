
import mysql from 'mysql2/promise';
import pool from '../db/db.js';

const departmentSchema = async () => {

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dep_name VARCHAR(255) NOT null,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    `;
    try {
        const [result] = await pool.execute(createTableQuery);
        console.log('Department table created or already exists');
    } catch (error) {
        console.error('Error creating Department table:', error.message);
    } 

};

// departmentSchema();
export {departmentSchema}

