

import pool from "../db/db.js";
import { departmentSchema } from "../models/Department.js";
import employeeSchema from "../models/Employee.js";

const getSummary = async (req, res) => {
    try {
        console.log("Entered in Get summary")
        // Count total employees
        const [totalEmployees] = await pool.execute(`SELECT COUNT(*) AS totalEmployees FROM employee`);
        console.log(totalEmployees)

        // Count total departments
        const [totalDepartments] = await pool.execute(`SELECT COUNT(*) AS totalDepartments FROM department`);

        // Sum of all employee salaries
        const [totalSalaries] = await pool.execute(`SELECT SUM(salary) AS totalSalary FROM employee`);

        // Count distinct employees who applied for leave
        const [employeeAppliedForLeave] = await pool.execute(`SELECT COUNT(DISTINCT employee_id) AS appliedFor FROM leaves`);
        console.log("ending get summary")

        // Count leave requests based on status
        const [leaveStatus] = await pool.execute(`
            SELECT status, COUNT(*) AS count
            FROM leaves
            GROUP BY status
        `);
        
        const leaveSummary = {
            appliedFor: employeeAppliedForLeave[0]?.appliedFor || 0,
            approved: leaveStatus.find(item => item.status === "Approved")?.count || 0,
            rejected: leaveStatus.find(item => item.status === "Rejected")?.count || 0,
            pending: leaveStatus.find(item => item.status === "Pending")?.count || 0
        };

        return res.status(200).json({
            totalEmployees: totalEmployees[0]?.totalEmployees || 0,
            totalDepartments: totalDepartments[0]?.totalDepartments || 0,
            totalSalary: totalSalaries[0]?.totalSalary || 0,
            leaveSummary
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: "dashboard summary error" });
    }
};

export { getSummary };
