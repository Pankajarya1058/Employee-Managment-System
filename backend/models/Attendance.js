
import mysql from 'mysql2/promise';
import pool from '../db/db.js';

const attendanceSchema = async () => {

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    empId VARCHAR(255) NOT NULL,
    status ENUM('Present', 'Absent', 'Sick', 'Leave') DEFAULT NULL,
    INDEX idx_empId (empId),  -- Added an index for empId to optimize queries
    FOREIGN KEY (empId) REFERENCES Employee(employeeId) ON DELETE CASCADE
)`;
    try {
        const [result] = await pool.execute(createTableQuery);
        console.log('Attendance table created or already exists');
    } catch (error) {
        console.error('Error creating Attendance table:', error.message);
    }

};

// attendanceSchema();
export { attendanceSchema }

