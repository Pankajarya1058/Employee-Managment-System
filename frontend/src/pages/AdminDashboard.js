import React from 'react';
import { useAuth } from '../context/authContext'
import AdminSidebar from '../components/dashboard/AdminSidebar.js';
import Navbar from '../components/dashboard/Navbar.js';
import { Outlet } from 'react-router-dom';


const AdminDashboard = () => {
  const {user} = useAuth()
    
  return (
    <div className='flex'>
      <AdminSidebar /> 
      <div className='flex-1 m1-64 bg-gray-100 h-screen'> 
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard;