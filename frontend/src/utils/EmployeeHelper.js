
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_EMS_BACKEND_URL;

export const columns = [
    {
        name: <span className="font-bold text-sm">S NO</span>,
        selector: (row) => row.sno,
        width: "80px"
    },
    {
        name: <span className="font-bold text-sm">Image</span>,
        selector: (row) => row.profile_image,
        sortable: true,
        width: "100px"
    },
    {
        name: <span className="font-bold text-sm">Name</span>,
        selector: (row) => row.name,
        width: "180px"
    },
    {
        name: <span className="font-bold text-sm">Department</span>,
        selector: (row) => row.dep_name,
        width: "160px"
    },
    {
        name: <span className="font-bold text-sm">D.O.B</span>,
        selector: (row) => row.dob,
        sortable: true,
        width: "130px"
    },
    {
        name: <span className="font-bold text-sm">Action</span>,
        selector: (row) => row.action,
        center: true
    },
]

export const fetchDepartments = async () => {
    let departments
    try {
        const response = await axios.get(`${backendUrl}/api/department`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.data.success) {
            departments = response.data.departments
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            alert(error.response.data.error)
        }
    }
    return departments
}

export const getEmployees = async (id) => {
    let employees;
    try {
        const response = await axios.get(`${backendUrl}/api/employee/department/${id}`, {
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.data.success) {
            employees = response.data.employees
        }   
    } catch (error) {
        console.error('Error fetching employees:', error);
        alert(error.response?.data?.error || 'Failed to fetch employees');
        return [];
    }
    return employees
}

export const EmployeeButtons = ({ id }) => {
    const navigate = useNavigate();
    return (
        <div className="flex space-x-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={() => navigate(`/admin-dashboard/employees/${id}`)}
            >View</button>

            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={() => navigate(`/admin-dashboard/employees/edit/${id}`)}
            >Edit</button>

            <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg" onClick={() => navigate(`/admin-dashboard/employees/salary/${id}`)}>Salary</button>

            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg" onClick={() => navigate(`/admin-dashboard/employees/leaves/${id}`)}>Leave</button>
        </div>
    )
}
