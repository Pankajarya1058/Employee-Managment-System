import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_EMS_BACKEND_URL;

const View = () => {
    const { id } = useParams()
    const [employee, setEmployee] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {            
            try {
                const response = await axios.get(`${backendUrl}/api/employees/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                console.log(response.data.employee)
                if (response.data.success) {
                    setEmployee(response.data.employee[0])
                    console.log("Employee data: ", employee);
                }
                else {
                    console.log('API call succeeded but no success flag');
                    setError('Failed to fetch employee data');
                }
            }  catch(error) {
                if(error.response && !error.response.data.success) {
                    alert(error.response.data.error)
                }
            } finally {
                setLoading(false);
            }
        }
    
        fetchEmployee();
    }, [id])

    if (loading) return <p>Loading employee details...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!employee) return <p>No employee data found</p>;

  return (
      <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadowm-log'>
        <h2 className='text-3xl font-extrabold mb-8 text-center text-gray-800'>Employee Details</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 '>
            <div className="flex justify-center">
                <img src={`${backendUrl}/${employee.profile_image}`} className="rounded-full border-4 border-gray-300 w-45 h-45 object-cover"/>
            </div>
            <div className="space-y-6 ">
            <div className='flex items-center space-x-3'>
                <p className='text-lg font-bold text-gray-700'>Name: </p>
                <p className='text-lg text-gray-900'>{employee.user_name}</p>
            </div>
            <div className='flex items-center space-x-3'>
                <p className='text-lg font-bold text-gray-700'>Employee ID: </p>
                <p className='text-lg text-gray-900'>{employee.employeeId}</p>
            </div>
            <div className='flex items-center space-x-3'>
                <p className='text-lg font-bold text-gray-700'>Designation: </p>
                <p className='text-lg text-gray-900'>{employee.designation}</p>
            </div>
            <div className='flex items-center space-x-3'>
                <p className='text-lg font-bold text-gray-700'>Date of Birth: </p>
                <p className='text-lg text-gray-900'>{new Date(employee.dob).toLocaleDateString()}</p>
            </div>
            <div className='flex items-center space-x-3'>
                <p className='text-lg font-bold text-gray-700'>Mobile No: </p>
                <p className='text-lg text-gray-900'>{employee.mobile_number}</p>
            </div>
            <div className='flex items-center space-x-3'>
                <p className='text-lg font-bold text-gray-700'>Gender: </p>
                <p className='text-lg text-gray-900'>{employee.gender}</p>
            </div>
            <div className='flex space-x-3 mb-5'>
                <p className='text-lg font-bold text-gray-700'>Department: </p>
                <p className='text-lg text-gray-900'>{employee.dep_name}</p>
            </div>
            <div className='flex items-center space-x-3'>
                <p className='text-lg font-bold text-gray-700'>Marital Status: </p>
                <p className='text-lg text-gray-900'>{employee.maritalStatus}</p>
            </div>
            </div>
        </div>
      </div>
  );
}

export default View;
