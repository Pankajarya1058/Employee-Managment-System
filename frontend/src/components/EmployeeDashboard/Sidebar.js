
import React from 'react';
import { FaCogs, FaCalendarAlt, FaMoneyBillWave, FaSignOutAlt, FaTachometerAlt, FaUsers } from 'react-icons/fa';
import { NavLink, useAsyncValue, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const Sidebar = () => {
  const {user, logout} = useAuth()
  const location = useLocation();
  const navItems = [
    { to: '/employee-dashboard', icon: <FaTachometerAlt />, label: 'Dashboard', exact: true },
    { to: `/employee-dashboard/profile/${user.id}`, icon: <FaUsers />, label: 'My Profile' },
    { to: `/employee-dashboard/leaves/${user.id}`, icon: <FaCalendarAlt />, label: 'Leaves' },
    { to: `/employee-dashboard/salary/${user.id}`, icon: <FaMoneyBillWave />, label: 'Salary' },
    { to: '/employee-dashboard/setting', icon: <FaCogs />, label: 'Settings' },
    { to: '/login', icon: <FaSignOutAlt />, label: 'Logout', onClick: logout }
  ];

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
    <div className="py-2 text-center text-xl font-semibold">Welcome {user.name}</div>
    <nav className="flex-1 px-4">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all ${
            location.pathname === item.to ? 'bg-gray-500 text-white' : 'text-gray-100 '
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-lg font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </div>

  );
};

export default Sidebar;