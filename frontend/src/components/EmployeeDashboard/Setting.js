import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const Setting = () => {
  const navigate = useNavigate()
  const { user } = useAuth();
  const [setting, setSetting] = useState({
    userId: user.id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState(null)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting({ ...setting, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setting.newPassword !== setting.confirmPassword) {
      setError("Password not matched")
    } else {
      try {
        console.log("in try block of calling API")
        const response = await axios.put("http://localhost:5000/api/setting/change-password", setting, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          navigate("/admin-dashboard/employees");
          setError("")
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          setError(error.response.data.error)
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-semibold mb-6 text-center">Change Password</h2>
        {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
        {/* Old Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Old Password</label>
          <input
            type='password'
            name='oldPassword'
            placeholder='Old Password'
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
        </div>
        {/* New Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type='password'
            name='newPassword'
            placeholder='New Password'
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
        </div>
        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
export default Setting;