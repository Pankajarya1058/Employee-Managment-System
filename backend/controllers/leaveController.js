import {leaveSchema} from '../models/Leave.js'
import pool from '../db/db.js';

const addLeave = async (req, res) => {
    try {
        console.log("Entered in add Leave backend");
        leaveSchema();

        const {userId, leaveType, startDate, endDate, reason} = req.body

        console.log({userId, leaveType, startDate, endDate, reason})

        // Step 1: Get employee_id from userId
        const employeeQuery = `SELECT id FROM employee WHERE userId = ?`;
        const [employeeResult] = await pool.execute(employeeQuery, [userId]);

        if (employeeResult.length === 0) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        const employee_id = employeeResult[0].id;
        console.log("Resolved employee_id:", employee_id);

        const query = `
            INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [employee_id, leaveType, startDate, endDate, reason];
        console.log({ employee_id, leaveType, startDate, endDate, reason });

        const [result] = await pool.execute(query, values);

        res.status(201).json({ success: true, message: 'Leave added successfully', result });
    } catch (error) {
        console.error('Error adding Leave:', error);
        res.status(500).json({ success: false, message: 'Failed to add Leave' });
    }
}

const getLeaves = async (req, res) => {
    console.log("Entered in getLeaves function")
    const {id} = req.params;
    try {
        // const {id} = req.params;
        console.log(id)
        let [leaves] = await pool.execute(`
            SELECT l.* 
            FROM leaves l 
            JOIN employee e ON l.employee_id = e.id 
            WHERE e.departmentId = ?;
        `, [id]);

        if(leaves.length === 0) {
        [leaves] = await pool.execute(`
            SELECT l.* 
            FROM leaves l 
            JOIN employee e ON l.employee_id = e.id 
            WHERE e.userId = ?;
        `, [id]);
        }

        console.log(leaves)

        // if (leaves.length === 0) {
        //     return res.status(404).json({ success: false, error: "No Leaves found" });
        // }
        return res.status(200).json({ success: true, leaves })


    } catch(error) {
        console.error('Error getting Leave:', error);
        res.status(500).json({ success: false, message: 'Failed to get Leaves' });
    }
}

const getLeave = async (req, res) => {
    try {
        const [leave] = await pool.execute(`
            SELECT l.*, d.dep_name, u.name, e.employeeId
            FROM leaves l 
            JOIN employee e ON l.employee_id = e.id 
            JOIN department d ON d.id = e.departmentId
            JOIN users u ON u.id = e.userId
        `, []);

        // console.log(leave)

        if (leave.length === 0) {
            return res.status(404).json({ success: false, error: "No Leaves found" });
        }
        return res.status(200).json({ success: true, leave })


    } catch(error) {
        console.error('Error getting Leave:', error);
        res.status(500).json({ success: false, message: 'Failed to get Leave' });
    }
}

const getLeaveDetail = async (req, res) => {
    const {id} = req.params;
    try {
        console.log("Entered in getLeaveDetails")
        const [getLeaveDetail] = await pool.execute(`
            SELECT l.*, d.dep_name, u.name, u.profile_image, e.employeeId
            FROM leaves l 
            JOIN employee e ON l.employee_id = e.id 
            JOIN department d ON d.id = e.departmentId
            JOIN users u ON u.id = e.userId
            WHERE l.id = ?
        `, [id]);

        // console.log(getLeaveDetail)
        // console.log(getLeaveDetail[0].employee_id)
        // console.log(getLeaveDetail[0].name)

        if (getLeaveDetail.length === 0) {
            return res.status(404).json({ success: false, error: "No Leaves found" });
        }
        return res.status(200).json({ success: true, getLeaveDetail })


    } catch(error) {
        console.error('Error getting Leave:', error);
        res.status(500).json({ success: false, message: 'Failed to get Leave Details' });
    }
}

const updateLeave = async (req, res) => {
    try {
        const { id } = req.params; // Get leave ID from request params
        const { status } = req.body; // Get new status from request body

        // Ensure status is one of the allowed values
        const validStatuses = ['Pending', 'Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status value" });
        }

        // Execute UPDATE query
        const [result] = await pool.execute(
            `UPDATE leaves SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [status, id]
        );

        // If no rows were affected, the leave ID was not found
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Leave not found" });
        }
        return res.status(200).json({ success: true, result })

        
    } catch(error) {
        console.error('Error getting Leave:', error);
        res.status(500).json({ success: false, message: 'Failed to Update Leave' });
    }
}

export {addLeave, getLeaves, getLeave, getLeaveDetail, updateLeave}