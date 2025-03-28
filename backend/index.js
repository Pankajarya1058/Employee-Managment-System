import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import pool from './db/db.js'
import verifyUser from './middleware/authMiddleware.js'
import salarayRouter from './routes/salary.js'
import leaveRouter from './routes/leave.js'
import settingRouter from './routes/setting.js'
import dashboardRouter from './routes/dashboard.js'
import attendanceRouter from './routes/attendance.js'
import createUsersTable from './db/setup.js'
import { userRegister } from './userSeed.js'
import dotenv from 'dotenv';
import { attendanceSchema } from './models/Attendance.js'
import { departmentSchema } from './models/Department.js'
import employeeSchema from './models/Employee.js'
import { leaveSchema } from './models/Leave.js'
import { salarySchema } from './models/Salary.js'
dotenv.config();

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public/uploads'))
app.use('/api/auth', authRouter)
app.use('/api/auth', verifyUser, authRouter);
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/employees', employeeRouter)
app.use('/api/salary', salarayRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/setting', settingRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/attendance', attendanceRouter)

// app.listen(process.env.PORT, () => {
//     console.log(`server is Running on port ${process.env.PORT}`)
// })
// createUsersTable()
// userRegister()

// ✅ Start the server only after database and table setup
const startServer = async () => {
    try {
        await createUsersTable(); // Ensure tables exist
        userRegister()
        await departmentSchema()
        await employeeSchema()
        attendanceSchema()
        leaveSchema()
        salarySchema()

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start the server:', error);
    }
};

// 🔥 Call the function to start the server
startServer();