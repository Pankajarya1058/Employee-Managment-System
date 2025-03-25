import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../context/authContext'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null)
    const {login} = useAuth()
    const Navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            if(response.data.success) {
                login(response.data.user)
                localStorage.setItem("token", response.data.token)
                if(response.data.user.role === "admin") {
                  Navigate('/admin-dashboard')
                } else {
                  Navigate("/employee-dashboard")
                }
            }
        } catch (error) {
            if(error.response && !error.response.data.success) {
                setError(error.response.data.error)
            } else {
                setError("Server Error")
            }
        }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-blue-600">Employee Management System</h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-80">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
          {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
          <div className="mb-4">
              <label htmlFor='email' className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type='email' 
                placeholder='Enter Email' 
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
          </div>
          <div className="mb-6">
              <label htmlFor='password' className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type='password' 
                placeholder='*****' 
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <input type='checkbox' id='remember' className="mr-2" />
              <label htmlFor='remember' className="text-sm text-gray-700">Remember me</label>
            </div>
            <a href='#' className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    );
  }
  
  export default Login;
