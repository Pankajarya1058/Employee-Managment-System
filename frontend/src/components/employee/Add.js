import React, { useEffect, useState } from 'react';
import { fetchDepartments } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_EMS_BACKEND_URL;

const Add = () => {
    const [departments, setDepartments] = useState([])
    const [formData, setFormData] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments()
            setDepartments(departments)
        }
        getDepartments()
    }, [])

    const handlechange = (e) => {
        const { name, value, files } = e.target
        if (name === "profile_image") {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }))
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formDataObj = new FormData()
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key])
        })

        try {
            const response = await axios.post(`${backendUrl}/api/employee/add`, formDataObj, {
                headers: {
                    "Content-Type": 'multipart/form-data',
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
        <div className="max-w-5xl my-2 mx-auto p-5 bg-gray-50 rounded-lg shadow-lg overflow-hidden">
            <h2 className="text-xl font-bold text-center mb-2">Add New Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[80vh]">
                <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block font-medium">Name</label>
                        <input type="text" name="name"
                            onChange={handlechange} placeholder='Insert Name' required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-medium">Email</label>
                        <input type='email' name='email' onChange={handlechange} placeholder='Insert Email' required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Mobile number */}
                    <div>
                        <label className="block font-medium">Mobile number</label>
                        <input type='tel' name='mobile_number' onChange={handlechange} placeholder='mobile no' required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Employee ID */}
                    <div>
                        <label className="block font-medium">Employee ID</label>
                        <input type='text' name='employeeId' onChange={handlechange} placeholder='Employee ID' required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block font-medium">Date of Birth</label>
                        <input type='date' name='dob' onChange={handlechange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block font-medium">Gender</label>
                        <select name='gender' required onChange={handlechange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Marital Status */}
                    <div>
                        <label className="block font-medium">Marital Status</label>
                        <select name='maritalStatus' required onChange={handlechange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block font-medium">Designation</label>
                        <input type='text' name='designation' onChange={handlechange} placeholder='Designation' required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block font-medium">Department</label>
                        <select name='departmentId' required onChange={handlechange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Department</option>
                            {departments.map(dep => (
                                <option key={dep.id} value={dep.id}>{dep.dep_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block font-medium">Salary</label>
                        <input type='number' name='salary' onChange={handlechange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block font-medium">Password</label>
                        <input type='password' name='password' placeholder='******' required onChange={handlechange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block font-medium">Role</label>
                        <select name='role' required onChange={handlechange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>

                    {/* Upload */}
                    <div>
                        <label className="block font-medium">Upload Image</label>
                        <input type='file' name='profile_image' onChange={handlechange} accept='image/*' className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <button type='submit' className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">Add Employee</button>
            </form>
        </div>
    );
}

export default Add;
