import express from 'express'
import { getAttendance, updateAttendance, attendanceReport } from '../controllers/attendanceController.js';
import verifyUser from '../middleware/authMiddleware.js'
import authMiddleware from '../middleware/authMiddleware.js'
import defaultAttendance from '../middleware/defaultAttendance.js';

const router = express.Router()

router.get('/',verifyUser, defaultAttendance, getAttendance)
router.put('/update/:employeeId', authMiddleware, updateAttendance)
router.get('/report', authMiddleware, attendanceReport)

export default router;