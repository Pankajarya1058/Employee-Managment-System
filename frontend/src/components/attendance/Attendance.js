import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { columns, AttendanceHelper } from '../../utils/AttendanceHelper.js';
import axios from 'axios';

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [filteredAttendance, setFilteredAttendance] = useState([])

    const statusChange = () => {
        fetchAttendance()
    }

  const fetchAttendance = async () => {
    try {
        console.log("fetching attendance")
      const response = await axios.get('http://localhost:5000/api/attendance', {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        let sno = 1;
        const data = await response.data.attendance.map((att) => {
          return {
            employeeId: att.employeeId,
            sno: sno++,
            dep_name: att.dep_name,
            name: att.name,
            action: (<AttendanceHelper status={att.status} employeeId={att.employeeId} statusChange={statusChange} />),
          }
        })
        setAttendance(data);
        setFilteredAttendance(data)
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        // alert(error.response.data.error)
      }
    }
  }

  useEffect(() => {

    fetchAttendance();
  }, []);

  const handleFilter = (e) => {
    const records = attendance.filter((emp) => (
      emp.employeeId.toLowerCase().includes(e.target.value.toLowerCase())
    ))
    setFilteredAttendance(records)
  }

  return (
    <div className='p-5'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold'>Manage Attendance</h3>
      </div>
      <div className='flex justify-between items-center py-2 mt-4 rounded-lg'>
        <input type='text' placeholder='Search By Emp ID' className='px-4 py-0.5 border' onChange={handleFilter}/>
        <p className='text-2xl'>Mark Employees for <span className='text-2xl font-bold underline'>{new Date().toISOString().split("T")[0]}{" "}</span></p>
        <Link to="/admin-dashboard/attendance-report" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg">Attendance Report</Link>
      </div>
      <div className='mt-6'>
        <DataTable columns={columns} data={filteredAttendance} style={{ textAlign: 'center' }} pagination />
      </div>
    </div>
  );
}

export default Attendance;