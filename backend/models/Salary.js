import mysql from 'mysql2/promise';
import pool from '../db/db.js';

const salarySchema = async () => {

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS salary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeId INT NOT NULL,
    basicSalary DECIMAL(10, 2) NOT NULL,
    allowances DECIMAL(10, 2) DEFAULT 0.00,
    deductions DECIMAL(10, 2) DEFAULT 0.00,
    netSalary DECIMAL(10, 2),
    payDate DATE NOT NULL,
    tax DECIMAL(10, 2) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employeeId) REFERENCES employee(id)
    );
    `;
    try {
        const [result] = await pool.execute(createTableQuery);
        console.log('Department table created or already exists');
    } catch (error) {
        console.error('Error creating Department table:', error.message);
    } 

};

salarySchema();
export {salarySchema}
