import axios from 'axios';
import React from 'react';
const backendUrl = process.env.REACT_APP_EMS_BACKEND_URL;

export const columns = [
    {
        name: <span className="font-bold text-sm">S NO</span>,
        selector: (row) => row.sno,
        width: "80px"
    },
    {
        name: <span className="font-bold text-sm">Name</span>,
        selector: (row) => row.name,
        width: "180px"
    },
    {
        name: <span className="font-bold text-sm">Emp ID</span>,
        selector: (row) => row.employeeId,
        width: "180px"
    },
    {
        name: <span className="font-bold text-sm">Department</span>,
        selector: (row) => row.dep_name,
        width: "160px"
    },
    {
        name: <span className="font-bold text-sm">Action</span>,
        selector: (row) => row.action,
        center: true
    },
]

export const AttendanceHelper = ({status, employeeId, statusChange}) => {

    const markEmployee =  async (status, employeeId) => {
        const response = await axios.put(`${backendUrl}/api/attendance/update/${employeeId}`, {status}, {
            headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        })
        if(response.data.success) {
            statusChange()
        }
    }

  return (
    <div>
      {status == null ? (
        <div className="flex space-x-3">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg" onClick={() => markEmployee("present", employeeId)}>Present</button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg" onClick={() => markEmployee("absent", employeeId)}>Absent</button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-lg" onClick={() => markEmployee("sick", employeeId)}>Sick</button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg" onClick={() => markEmployee("leave", employeeId)}>Leave</button>
        </div>
      ) : (
        <p>{status}</p>
      )}
    </div>
  );
}
