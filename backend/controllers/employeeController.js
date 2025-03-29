
import bcrypt from 'bcrypt';
import multer from "multer";
import path from 'path';
import pool from "../db/db.js";
import { login, verify } from '../controllers/authController.js'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {

    try {
        const {
            name,
            email,
            mobile_number,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            departmentId,
            salary,
            password,
            role
        } = req.body;

        // Check if user already exists
        const [existingUser] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, error: "User already registered" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [userResult] = await pool.execute(
            "INSERT INTO users (name, email, password, role, profile_image) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashPassword, role, req.file ? req.file.filename : null]
        );

        const userId = userResult.insertId;

        // Check for undefined values
        const requiredFields = { userId, employeeId, departmentId, salary };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (value === undefined) {
                console.error(`Missing value for: ${key}`);
            }
        }

        // Insert new employee
        await pool.execute(
            "INSERT INTO employee (userId, mobile_number, employeeId, dob, gender, maritalStatus, designation, departmentId, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [userId, mobile_number, employeeId, dob, gender, maritalStatus, designation, departmentId, salary]
        );

        return res.status(200).json({ success: true, message: "Employee created" });
    } catch (error) {
        console.error("Error adding employee:", error.stack);
        console.error("Error adding employee:", error);
        return res.status(500).json({ success: false, error: "Server error in adding employee" });
    }
};

const getEmployees = async (req, res) => {
    const { id } = req.params;
    // console.log(id)
    try {
        console.log("comes in GetEmployee function");
        const [Employees] = await pool.execute(`
            SELECT e.*, u.id AS user_id, u.name, u.email, u.profile_image, d.*
            FROM employee e
            JOIN users u ON e.userId = u.id
            JOIN department d ON e.departmentId = d.id    
        `);
        Employees.forEach(user => delete user.password)
        // console.log(Employees);
        return res.status(200).json({ success: true, Employees })
    } catch (error) {
        console.log('MySQL:', error)
        return res.status(500).json({ success: false, error: "get Employee server error" })
    }
}

const getEmployee = async (req, res) => {
    console.log('Hitting GET /api/employees/:id');
    const { id } = req.params;
    console.log('Employee ID:', id);
    try {
        // console.log("comes in GetEmployee function");
        let [employee] = await pool.execute(`
            SELECT e.*, u.name AS user_name, u.email, u.profile_image, d.dep_name
            FROM employee e
            JOIN users u ON e.userId = u.id
            JOIN department d ON e.departmentId = d.id
            WHERE e.departmentId = ?
        `, [id]);
        
        // Geting employee by using userid
        if (employee.length === 0) {
            [employee] = await pool.execute(`
                SELECT e.*, u.name AS user_name, u.email, u.profile_image, d.dep_name
                FROM employee e
                JOIN users u ON e.userId = u.id
                JOIN department d ON e.departmentId = d.id
                WHERE u.id = ?
            `, [id]);
        }
        console.log(employee)
        if (employee.length === 0) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        return res.status(200).json({ success: true, employee })
        
    } catch (error) {
        console.log('MySQL:', error)
        return res.status(500).json({ success: false, error: "get Employee server error" })
    }
}

const updateEmployee = async (req, res) => {
    try {
        console.log("Entered in updateEmployee try block");
        const { id } = req.params;
        const {
            name,
            maritalStatus,
            designation,
            departmentId,
            salary
        } = req.body;

        console.log("Received data from request body:", {
            name,
            maritalStatus,
            designation,
            departmentId,
            salary
        });

        // Check if the employee exists
        const [employee] = await pool.execute(
            `SELECT name, email, dob, gender, maritalStatus, designation, salary, userId, departmentId
            FROM users u 
            INNER JOIN employee e 
            ON u.id = e.userId 
            WHERE e.departmentId = ?`, [id]
        );

        if (employee.length === 0) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }


       // Check if the user exists
        const [user] = await pool.execute(
            `SELECT * FROM users WHERE id = ?`, [employee[0].userId]
        );

        if (user.length === 0) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Update the user table
        const [updateUser] = await pool.execute(
            `UPDATE users SET name = ? WHERE email = ?`,
            [name, employee[0].email]
        );

        // Update the employee table
        const [updateEmployee] = await pool.execute(
            `UPDATE employee SET departmentId = ?, maritalStatus = ?, designation = ?, salary = ? WHERE userId = ?`,
            [departmentId, maritalStatus, designation, salary, employee[0].userId]
        );


        return res.status(200).json({ success: true, message: "Employee updated successfully" });

    } catch (error) {
        console.error('MySQL error:', error);
        return res.status(500).json({ success: false, error: "Update Employee server error" });
    }
};

const fetchEmployeesByDepId = async (req, res) => {
    console.log('Hitting GET /api/fetchEmployeesByDepId/:id');
    const { id } = req.params;
    try {
        const [employees] = await pool.execute(`
            SELECT e.*, u.name AS user_name, u.email, u.profile_image, d.dep_name, departmentId
            FROM employee e
            JOIN users u ON e.userId = u.id
            JOIN department d ON e.departmentId = d.id
            WHERE e.departmentId = ?
        `, [id]);
        employees.forEach(user => delete user.password)
        if (employees.length === 0) {
            return res.status(404).json({ success: false, error: "get employeebyDepId not found" });
        }
        // console.log(employee);
        return res.status(200).json({ success: true, employees })
    } catch (error) {
        console.log('MySQL:', error)
        return res.status(500).json({ success: false, error: "get Employee server error" })
    }
}


export { addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId };
