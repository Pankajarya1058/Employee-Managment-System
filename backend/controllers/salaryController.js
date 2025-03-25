import pool from '../db/db.js';
import { salarySchema } from '../models/Salary.js';

const calculateTax = (salary) => {
    if (salary <= 25000) return salary * 0.05;  // 5% tax for low salary
    if (salary <= 50000) return salary * 0.10;  // 10% tax for mid salary
    return salary * 0.20;  // 20% tax for high salary
};

// const addSalary = async (req, res) => {
//     try {
//         console.log("Entered in addSalary backend");
//         salarySchema();

//         const {employeeId, basicSalary, allowances, deductions, payDate} = req.body

//         console.log({employeeId, basicSalary, allowances, deductions, payDate})

//         // Calculate tax
//         const tax = calculateTax(basicSalary);

//         const totalSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);

//         const query = `
//             INSERT INTO Salary (employeeId, basicSalary, allowances, deductions, netSalary, payDate)
//             VALUES (?, ?, ?, ?, ?, ?)
//         `;
//         const values = [employeeId, basicSalary, allowances, deductions, totalSalary, payDate];

//         const [result] = await pool.execute(query, values);

//         res.status(201).json({ success: true, message: 'Salary added successfully', result });
//     } catch (error) {
//         console.error('Error adding salary:', error);
//         res.status(500).json({ success: false, message: 'Failed to add salary' });
//     }

// }

const addSalary = async (req, res) => {
    try {
        console.log("Entered in addSalary backend");

        const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;

        // Convert to float to handle decimal values
        const basic = parseFloat(basicSalary) || 0;
        const allow = parseFloat(allowances) || 0;
        const deduct = parseFloat(deductions) || 0;

        // Calculate tax
        const tax = calculateTax(basic);

        console.log({ employeeId, basic, allow, deduct, payDate, tax });

        // Calculate total salary after tax
        const netSalary = basic + allow - deduct - tax;

        const query = `
            INSERT INTO Salary (employeeId, basicSalary, allowances, deductions, tax, netSalary, payDate)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [employeeId, basic, allow, deduct, tax, netSalary, payDate];

        const [result] = await pool.execute(query, values);

        res.status(201).json({ 
            success: true, 
            message: 'Salary added successfully', 
            salary: {
                employeeId,
                basicSalary: basic,
                allowances: allow,
                deductions: deduct,
                tax,
                netSalary,
                payDate
            }, result
        });
    } catch (error) {
        console.error('Error adding salary:', error);
        res.status(500).json({ success: false, message: 'Failed to add salary' });
    }
};

const getSalary = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(id)

        let [salary] = await pool.execute(`
            SELECT e.*, e.employeeId AS employeeid, s.* 
            FROM employee e 
            JOIN salary s ON e.id = s.employeeId 
            JOIN department d ON e.departmentId = d.id 
            WHERE e.departmentId = ?;
        `, [id]);

        // console.log(salary[0].employeeid)
        if (salary.length === 0) {
            [salary] = await pool.execute(`
                SELECT s.*, e.employeeId AS employeeid, s.* 
                FROM employee e
                JOIN salary s ON e.id = s.employeeId
                WHERE e.userId = ?
            `, [id]);
        }
        if (salary.length === 0) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        return res.status(200).json({ success: true, salary });

    } catch (error) {
        console.error('Error geting salary:', error);
        res.status(500).json({ success: false, message: 'Failed to get salary' });
    }
}

export {addSalary, getSalary}
