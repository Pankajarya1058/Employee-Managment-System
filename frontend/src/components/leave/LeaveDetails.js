import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_EMS_BACKEND_URL;

const LeaveDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  console.log(id)
  const [getLeaveDetail, setLeave] = useState({})

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/leave/details/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (response.data.success) {
          setLeave(response.data.getLeaveDetail[0])
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      }
    }
    fetchLeave();
  }, [id]);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(`${backendUrl}/api/leave/${id}`, {status}, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (response.data.success) {
        navigate('/admin-dashboard/leaves')
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error)
      }
    }
  }

  return (
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadowm-log'>
      <h2 className='text-3xl font-extrabold mb-8 text-center text-gray-800'>Leave Details</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 '>
        <div className="flex justify-center">
          <img src={`${backendUrl}/${getLeaveDetail.profile_image}`} className="rounded-full border-4 border-gray-300 w-45 h-45 object-cover" />
        </div>
        <div className="space-y-6 ">
          <div className='flex items-center space-x-3'>
            <p className='text-lg font-bold text-gray-700'>Name: </p>
            <p className='text-lg text-gray-900'>{getLeaveDetail.name}</p>
          </div>
          <div className='flex items-center space-x-3'>
            <p className='text-lg font-bold text-gray-700'>Employee ID: </p>
            <p className='text-lg text-gray-900'>{getLeaveDetail.employeeId}</p>
          </div>
          <div className='flex items-center space-x-3'>
            <p className='text-lg font-bold text-gray-700'>Leave Type: </p>
            <p className='text-lg text-gray-900'>{getLeaveDetail.leave_type}</p>
          </div>
          <div className='flex items-center space-x-3'>
            <p className='text-lg font-bold text-gray-700'>Reason: </p>
            <p className='text-lg text-gray-900'>{getLeaveDetail.reason}</p>
          </div>
          <div className='flex space-x-3 mb-5'>
            <p className='text-lg font-bold text-gray-700'>Department: </p>
            <p className='text-lg text-gray-900'>{getLeaveDetail.dep_name}</p>
          </div>
          <div className='flex items-center space-x-3'>
            <p className='text-lg font-bold text-gray-700'>Start Date: </p>
            <p className='text-lg text-gray-900'>{new Date(getLeaveDetail.start_date).toLocaleDateString()}</p>
          </div>
          <div className='flex items-center space-x-3'>
            <p className='text-lg font-bold text-gray-700'>End Date: </p>
            <p className='text-lg text-gray-900'>{new Date(getLeaveDetail.end_date).toLocaleDateString()}</p>
          </div>
          <div className='flex items-center space-x-3'>
            <p className='text-lg font-bold text-gray-700'>
              {getLeaveDetail.status === "Pending" ? "Action" : "Status:"}
            </p>
            {getLeaveDetail.status === "Pending" ? (
              <div className='flex space-x-2'>
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 mr-2 rounded-lg" onClick={() => changeStatus(getLeaveDetail.id, "Approved")}>Approve</button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 mr-2 rounded-lg" onClick={() => changeStatus(getLeaveDetail.id, "Rejected")}>Reject</button>
              </div>
            ) :
              <p className='text-lg text-gray-900'>{getLeaveDetail.status}</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveDetails;
