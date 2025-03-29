import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper.js';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_EMS_BACKEND_URL;

const List = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployee, setFilteredEmployees] = useState([])

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/employee`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log(response.data)
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.Employees.map((emp) => {
            return {
              id: emp.id,
              sno: sno++,
              dep_name: emp.dep_name,
              name: emp.name,
              dob: new Date(emp.dob).toLocaleDateString(),
              profile_image: <img width={40} className='rounded-full' src={`${backendUrl}/${emp.profile_image}`} />,
              action: (<EmployeeButtons id={emp.userId} />),

            }
          })
          setEmployees(data);
          setFilteredEmployees(data)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      }
    }

    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const records = employees.filter((emp) => (
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    ))
    setFilteredEmployees(records)
  }

  return (
    <div className='p-5'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold'>Manage Employee</h3>
      </div>
      <div className='flex justify-between items-center'>
        <input type='text' placeholder='Search By Dep Name' className='px-4 py-0.5 border' onChange={handleFilter}/>
        <Link to="/admin-dashboard/add-employee" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg">Add New Employee</Link>
      </div>
      <div className='mt-6'>
        <DataTable columns={columns} data={filteredEmployee} style={{ textAlign: 'center' }} pagination />
      </div>
    </div>
  );
}

export default List;
