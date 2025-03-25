
import React from 'react';
import { useAuth } from '../../context/authContext';

const Navbar = () => {

  return (
    <div className='flex justify-center items-center h-12 px-6 bg-gray-800 text-white shadow-lg'>
      <p className='text-2xl font-bold'>Employee Management System</p>
    </div>
  );
}

export default Navbar;