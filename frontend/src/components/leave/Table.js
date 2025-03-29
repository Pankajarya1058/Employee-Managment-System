import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { columns, LeaveButtons } from '../../utils/LeaveHelper.js';
import DataTable from 'react-data-table-component';
const backendUrl = process.env.REACT_APP_EMS_BACKEND_URL;

const Table = () => {
  const [leaves, setLeaves] = useState([])
  const [filteredLeaves, setfileteredLeaves] = useState([])

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/leave`, {
        headers: {

          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        let sno = 1;
        const data = response.data.leave.map((leave) => {
          return {
            id: leave.id,
            sno: sno++,
            employeeId: leave.employeeId,
            name: leave.name,
            leaveType: leave.leave_type,
            department: leave.dep_name,
            days:
              new Date(leave.end_date).getDate() - new Date(leave.start_date).getDate(),
            status: leave.status,
            action: (<LeaveButtons id={leave.id} />),
          }
        })
        setLeaves(data);
        setfileteredLeaves(data)
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        //alert(error.response.data.error)
      }
    }
  }
  useEffect(() => {
    fetchLeaves()

  }, [])

  const filterByInput = (e) => {
    const data = leaves.filter(leave => leave.employeeId.toLowerCase().includes(e.target.value.toLowerCase()))
    setfileteredLeaves(data)
  }

  const filterByButton = (status) => {
    const data = leaves.filter(leave => leave.status.toLowerCase().includes(status.toLowerCase()))
    setfileteredLeaves(data)
  }

  return (
    <>
      {setfileteredLeaves ? (
        <div className='p-6'>
          <div className='text-center'>
            <h3 className='text-2xl font-bold'>Manage Leaves</h3>
          </div>
          <div className='flex justify-between items-center'>
            <input type='text' placeholder='Search By Emp Id' className='px-4 py-0.5 border' onChange={filterByInput} />
            <div>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 mr-2 rounded-lg" onClick={() => filterByButton("Pending")}>Pending</button>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 mr-2 rounded-lg" onClick={() => filterByButton("Approved")}>Approved</button>
              <button className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 mr-2 rounded-lg" onClick={() => filterByButton("Rejected")}>Rejected</button>
            </div>
          </div>
          <div className='mt-6'>
            <DataTable columns={columns} data={filteredLeaves} pagination />
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}
export default Table;
