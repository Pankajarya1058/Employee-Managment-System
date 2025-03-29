import React, { useEffect, useState } from 'react';
import { fetchDepartments } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_EMS_BACKEND_URL;

const Edit = () => {
    const [employee, setEmployee] = useState({
        name: '',
        maritalStatus: '',
        designation: '',
        salary: 0,
        department: ''
    })
    const [departments, setDepartments] = useState([])
    const navigate = useNavigate();
    const {id} = useParams()

    useEffect(() => {
            const getDepartments = async () => {
                const departments = await fetchDepartments()
                setDepartments(departments)
            }
            getDepartments()
        }, [])

    useEffect(() => {
        const fetchEmployee = async () => {            
            try {
                console.log("In fetchEmployee in Edit and id is ", id)
                const response = await axios.get(`${backendUrl}/api/employees/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                console.log(response.data.employee)
                if (response.data.success) {
                    const employeeData = response.data.employee[0]
                    setEmployee((prev) => ({
                        ...prev, 
                        name: employeeData.user_name,
                        maritalStatus: employeeData.maritalStatus,
                        designation: employeeData.designation,
                        salary: employeeData.salary,
                        department: employeeData.dep_name
                    }))
                }
            }  catch(error) {
                if(error.response && !error.response.data.success) {
                    alert(error.response.data.error)
                }
            } 
        }
        fetchEmployee()
    }, [id])

    const handlechange = (e) => {
        const {name, value} = e.target
        setEmployee((prevData) => ({...prevData, [name] : value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.put(`${backendUrl}/api/employee/${id}`, employee, {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(response.data.success)
            if (response.data.success) {
                navigate("/admin-dashboard/employees")
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    }

    return (
        <div className='flex items-center justify-center h-screen '>
        <div className="max-w-2xl w-1/2 mx-auto p-9 rounded-2xl shadow-lg overflow-hidden">
            <h2 className="text-2xl font-bold p-3 text-center mb-6">Edit Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[80vh] ">
                <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block font-medium">Name</label>
                        <input type="text" name="name" value={employee.name}
                        onChange={handlechange} placeholder='Insert Name' required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Marital Status */}
                    <div>
                        <label className="block font-medium">Marital Status</label>
                        <select name='maritalStatus' value={employee.maritalStatus} required onChange={handlechange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block font-medium">Designation</label>
                        <input type='text' value={employee.designation} name='designation' onChange={handlechange} placeholder='Designation' required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block font-medium">Department</label>
                        <select name='departmentId' value={employee.dep_name} required onChange={handlechange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Department</option>
                            {departments.map((dep) => (
                                <option key={dep.id} value={dep.id}>{dep.dep_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block font-medium">Salary</label>
                        <input type='number' value={employee.salary} name='salary' onChange={handlechange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <button type='submit' className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">Edit Employee</button>

            </form>
        </div>
        </div>
    );
}

export default Edit;
