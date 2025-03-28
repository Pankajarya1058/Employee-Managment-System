import pool from '../db/db.js';

const employeeSchema = async () => {
    // const db = await connectToDatabase();

    const createTableQuery = `
    CREATE TABLE Employee (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        employeeId VARCHAR(255) NOT NULL UNIQUE,
        mobile_number VARCHAR(15) NOT NULL UNIQUE,
        dob DATE,
        gender VARCHAR(10),
        maritalStatus VARCHAR(20),
        designation VARCHAR(255),
        departmentId INT NOT NULL,
        salary DECIMAL(10, 2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(id),
        FOREIGN KEY (departmentId) REFERENCES Department(id)
    );`

    try {
        await pool.execute(createTableQuery);
        console.log('employee table created or already exists');
    } catch (error) {
        console.error('Error creating employee table:', error.message);
    } 
};

// employeeSchema();

export default employeeSchema;