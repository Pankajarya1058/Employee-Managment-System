import { populate } from "dotenv";
import pool from "../db/db.js";

const getAttendance = async (req, res) => {
    console.log("Entered in attendance controller")
    try {
        const date = new Date().toISOString().split('T')[0]
        const [attendance] = await pool.execute(`
            SELECT a.*, e.employeeId, e.departmentId, e.userId, d.dep_name, u.name
            FROM attendance a
            JOIN employee e ON a.empId = e.employeeId
            JOIN department d ON e.departmentId = d.id
            JOIN users u ON e.userId = u.id
            WHERE a.date = ?`,
            [date]
        );

        res.status(200).json({ success: true, attendance });

    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateAttendance = async (req, res) => {
    try {
        console.log("Entered in updateAttendance")
        const { employeeId } = req.params;
        const { status } = req.body;
        const date = new Date().toISOString().split('T')[0]; // Current Date in 'YYYY-MM-DD' format

        // Check if Employee Exists
        const [employee] = await pool.execute("SELECT * FROM employee WHERE employeeId = ?", [employeeId]);
        if (employee.length === 0) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // Update Attendance Record
        const [attendance] = await pool.execute(
            "UPDATE attendance SET status = ? WHERE empId = ? AND date = ?",
            [status, employeeId, date]
        );
        console.log(attendance)

        if (attendance.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Attendance record not found" });
        }

        res.status(200).json({ success: true, message: "Attendance updated successfully", attendance });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


const attendanceReport = async (req, res) => {
    try {
        console.log("Entered in attendance Report")
        const { date, limit = 5, skip = 0 } = req.query;

        let query = `SELECT a.date, e.employeeId, u.name AS employeeName, 
                    d.dep_name AS departmentName, 
                    COALESCE(a.status, 'Not Marked') AS status 
                    FROM attendance a
                    JOIN employee e ON a.empId = e.employeeId
                    JOIN department d ON e.departmentId = d.id
                    JOIN users u ON e.userId = u.id `;

        let queryParams = [];
        
        // Add date filter if provided
        if (date) {
            query += " WHERE a.date = ?";
            queryParams.push(date);
        }

        // If no date is provided, use today's date
        if (!date) {
            const today = new Date();
            date = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        }
        query += ` ORDER BY a.date DESC LIMIT ${parseInt(limit) || 5} OFFSET ${parseInt(skip) || 0}`;

        // console.log("Executing Query:", query, "With Params:", queryParams);

        // Execute the Query
        const [attendancedata] = await pool.execute(query, queryParams);

        // Group Data by Date
        const groupData = attendancedata.reduce((result, record) => {
            if (!result[record.date]) {
                result[record.date] = [];
            }
            result[record.date].push({
                employeeId: record.employeeId,
                employeeName: record.employeeName,
                departmentName: record.departmentName,
                status: record.status
            });
            return result;
        }, {});

        return res.status(201).json({ success: true, groupData });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export { getAttendance, updateAttendance, attendanceReport }
