import { useNavigate } from "react-router-dom"
import axios from 'axios';
const backendUrl = process.env.REACT_APP_EMS_BACKEND_URL;

export const columns = [
    {
        name: <span className="font-bold text-lg">S NO</span>,
        selector: (row) => row.sno
    },
    {
        name: <span className="font-bold text-lg">Department Name</span>,
        selector: (row) => row.dep_name,
        sortable: true
    },
    {
        name: <span className="font-bold px-10 text-lg  ">Action</span>,
        selector: (row) => row.action
    },
]

export const DepartmentButtons = ({id, onDepartmentDelete}) => {
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        const confirm = window.confirm("Do you want to delete?")
        if(confirm) {
        try {
            const response = await axios.delete(`${backendUrl}/api/department/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            })
            if (response.data.success) {
                onDepartmentDelete(id);
                
            } else {
                console.log('API call succeeded but no success flag');
            }
         
    } catch(error) {
            if(error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
        }
    }

    return (
        <div className="flex space-x-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={() => navigate(`/admin-dashboard/department/${id}`)}
            >Edit</button>
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg" onClick={() => handleDelete(id)}>Delete</button>
        </div>
    )
}
