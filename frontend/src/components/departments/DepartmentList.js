import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { columns, DepartmentButtons } from '../../utils/DepartmentHelper';
import axios from 'axios';

const DepartmentList = () => {
    const [departments, setDepartment] = useState([])
    const [filteredDepartments, setFilteredDepartments] = useState([])

    const onDepartmentDelete = (id) => {
        setDepartment((prevDepartments) => {
            const updatedDepartments = prevDepartments
                .filter(dep => dep.id !== id) // Remove the deleted department
                .map((dep, index) => ({
                    ...dep,
                    sno: index + 1, // Reorder serial numbers
                }));
            setFilteredDepartments(updatedDepartments)
            return updatedDepartments;
        });
    }

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/department', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.data.success) {
                    let sno = 1;
                    const data = await response.data.departments.map((dep) => (
                        {
                            id: dep.id,
                            sno: sno++,
                            dep_name: dep.dep_name,
                            action: (<DepartmentButtons id={dep.id} onDepartmentDelete={onDepartmentDelete} />)
                        }
                    ))
                    setDepartment(data);
                    setFilteredDepartments(data);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error)
                }
            }
        }

        fetchDepartments();
    }, []);

    const filterDepartments = (e) => {
        const searchTerm = e.target.value;
        if (!searchTerm) {
            setFilteredDepartments(departments); // Show full list when search is empty
        } else {
            const records = departments.filter((dep) =>
                // dep.dep_name.includes(searchTerm) // Case-sensitive search
                dep.dep_name.toLowerCase().includes(searchTerm)
            );
            setFilteredDepartments(records);
        }
    };

    return (
        <div className='p-5'>
            <div className='text-center'>
                <h3 className='text-2xl font-bold'>Manage Departments</h3>
            </div>
            <div className='flex justify-between items-center'>
                <input type='text' placeholder='Search By Dep Name' className='px-4 py-0.5 border' onChange={filterDepartments} />
                <Link to="/admin-dashboard/add-department" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg">Add New Department</Link>
            </div>
            <div className='mt-5'>
                <DataTable columns={columns} data={filteredDepartments} pagination />
            </div>
        </div>

    );
}

export default DepartmentList;