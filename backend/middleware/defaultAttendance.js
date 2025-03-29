import pool from '../db/db.js';

const defaultAttendance = async (req, res, next) => {
    try {
        console.log("Entered in defaultAttendance")
        const date = new Date().toISOString().split('T')[0];

        // Check if attendance for today already exists
        const [existingAttendance] = await pool.execute(
            `SELECT * FROM attendance WHERE date = ? LIMIT 1`, 
            [date]
        );
        
        if (existingAttendance.length === 0) {
            // Get all employees
            const [employees] = await pool.execute(`SELECT employeeId FROM employee`);
            
            // Prepare attendance records
            const attendanceRecords = employees.map(employee => [date, employee.employeeId, null]);

            // Insert attendance records
            await pool.query(
                `INSERT INTO attendance (date, empId, status) VALUES ?`,
                [attendanceRecords]
            );
        }

        next();
    } catch (error) {
        console.error("Error adding default attendance:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export default defaultAttendance;
