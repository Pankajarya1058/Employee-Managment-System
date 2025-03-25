import React, { useState } from 'react';
import { MdDescription } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddDepartment = () => {
    const [department, setDepartment] = useState({
        dep_name: '',
        description: ''
    })
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartment({ ...department, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:5000/api/department/add', department, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data.success) {
                navigate("/admin-dashboard/departments")
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h3 className="text-2xl font-bold text-center mb-6">Add Department</h3>
                <form onSubmit={handleSubmit} className="space-y-4" >
                    <div>
                        <label htmlFor='dep_name' className="block text-sm font-medium text-gray-700">Department Name</label>
                        <input onChange={handleChange} name="dep_name" type='text' placeholder='Enter Dep Name' className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor='description' className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea onChange={handleChange} name='description' placeholder='Description' className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Add Department</button>
                </form>
            </div>
        </div>
    );
}
export default AddDepartment;