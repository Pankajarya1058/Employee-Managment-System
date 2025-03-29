import mysql from 'mysql2/promise';
import pool from '../db/db.js';

const leaveSchema = async () => {

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type ENUM('Sick Leave', 'Casual Leave', 'Annual Leave') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
    );
    `;
    try {
        const [result] = await pool.execute(createTableQuery);
        console.log('Leave table created or already exists');
    } catch (error) {
        console.error('Error creating Leave table:', error.message);
    } 

};

leaveSchema();
export {leaveSchema}
