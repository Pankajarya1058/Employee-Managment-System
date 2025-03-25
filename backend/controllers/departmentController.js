import newDep from '../routes/department.js'
import { departmentSchema } from '../models/Department.js'
import pool from '../db/db.js';

const getDepartments = async (req, res) => {
    try {
        // console.log("comes in GetDepartments function");

        const [departments] = await pool.execute('SELECT * FROM Department');
        return res.status(200).json({ success: true, departments })
    } catch (error) {
        console.log('MySQL:', error)
        return res.status(500).json({ success: false, error: "get department server error" })
    }
}

const addDepartment = async (req, res) => {
    try {
        const { dep_name, description } = req.body;

        const insertQuery = `
            INSERT INTO Department (dep_name, description)
            VALUES (?, ?)
        `;

        const [result] = await pool.execute(insertQuery, [dep_name, description]);

        return res.status(200).json({
            success: true,
            department: {
                id: result.insertId,
                dep_name,
                description
            }
        });
        return res.status(200).json({ sucess: true, department: newDep })

    } catch (error) {
        return res.status(500).json({ success: false, error: "add department server error" })
    }
}

const editDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute('SELECT * FROM department WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Department not found' });
        }

        const department = rows[0];
        return res.status(200).json({ success: true, department });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Get department server error' });
    }
};

const getDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute('SELECT * FROM department WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Department not found' });
        }

        const department = rows[0];
        return res.status(200).json({ success: true, department });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Get department server error' });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { dep_name, description } = req.body;

        const db = await connectToDatabase();

        const [result] = await db.execute(
            'UPDATE department SET dep_name = ?, description = ? WHERE id = ?',
            [dep_name, description, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Department not found' });
        }

        const [updatedDepartment] = await db.execute(
            'SELECT * FROM department WHERE id = ?',
            [id]
        );
        if (updatedDepartment.length === 0) {
            return res.status(404).json({ success: false, error: 'Department not found after update' });
        }

        return res.status(200).json({ success: true, department: updatedDepartment[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Edit department server error' });
    }
};

const deleteDepartment = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Fetch employees associated with the department
        const [employees] = await connection.execute(
            'SELECT id FROM employee WHERE departmentId = ?', [id]
        );

        if (employees.length > 0) {
            const empIds = employees.map(emp => emp.id);

            if (empIds.length > 0) {
                // Delete related records in the `leaves` table
                await connection.execute(
                    `DELETE FROM leaves WHERE employee_id IN (${empIds.join(',')})`
                );

                // Delete related records in the `salary` table
                await connection.execute(
                    `DELETE FROM salary WHERE employeeId IN (${empIds.join(',')})`
                );
            }

            // Delete employees in the department
            await connection.execute(
                'DELETE FROM employee WHERE departmentId = ?', [id]
            );
        }

        // Delete department
        await connection.execute(
            'DELETE FROM department WHERE id = ?', [id]
        );

        await connection.commit();
        res.status(200).json({ success: true, message: 'Department deleted successfully' });

    } catch (error) {
        await connection.rollback();
        console.error('Database operation failed', error);
        return res.status(500).json({ success: false, error: 'Delete department server error' });
    } finally {
        connection.release();
    }
}

export { addDepartment, getDepartments, getDepartment, updateDepartment, editDepartment, deleteDepartment }



