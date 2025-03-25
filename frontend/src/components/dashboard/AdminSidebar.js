
import React from 'react';
import { FaBuilding, FaCogs, FaCalendarAlt, FaSignOutAlt, FaMoneyBillWave, FaTachometerAlt, FaUsers } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { AiOutlineFileText } from 'react-icons/ai';

const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/admin-dashboard', icon: <FaTachometerAlt />, label: 'Dashboard', exact: true },
    { to: '/admin-dashboard/employees', icon: <FaUsers />, label: 'Employee' },
    { to: '/admin-dashboard/departments', icon: <FaBuilding />, label: 'Department' },
    { to: '/admin-dashboard/leaves', icon: <FaCalendarAlt />, label: 'Leave' },
    { to: '/admin-dashboard/salary/add', icon: <FaMoneyBillWave />, label: 'Salary' },
    { to: '/admin-dashboard/attendance', icon: <FaCalendarAlt />, label: 'Attendance' },
    { to: '/admin-dashboard/attendance-report', icon: <AiOutlineFileText />, label: 'Attendance Report' },
    { to: '/admin-dashboard/settings', icon: <FaCogs />, label: 'Settings' },
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
            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all ${location.pathname === item.to ? 'bg-gray-500 text-white' : 'text-gray-100 '
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

export default AdminSidebar;