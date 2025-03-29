
import { useNavigate } from "react-router-dom";

export const columns = [
    {
        name: <span className="font-bold">S No</span>,
        selector: (row) => row.sno,
        width: "70px",
    },
    {
        name: <span className="font-bold">Emp ID</span>,
        selector: (row) => row.employeeId,
        width: "110px",
    },
    {
        name: <span className="font-bold">Name</span>,
        selector: (row) => row.name,
        width: "140px",
    },
    {
        name: <span className="font-bold">Leave Type</span>,
        selector: (row) => row.leaveType,
        width: "140px",
    },
    {
        name: <span className="font-bold">Department</span>,
        selector: (row) => row.department,
        width: "150px",
    },
    {
        name: <span className="font-bold">Days</span>,
        selector: (row) => row.days,
        width: "100px",
    },
    {
        name: <span className="font-bold">Status</span>,
        selector: (row) => row.status,
        width: "110px",
    },
    {
        name: <span className="font-bold">Action</span>,
        selector: (row) => row.action,
        center: true,
    },
];

export const LeaveButtons = ({ id }) => {
    const navigate = useNavigate();
    const handleView = (id) => {
        navigate(`/admin-dashboard/leave/${id}`);
    }
    return (
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mr-2 rounded-lg" onClick={() => handleView(id)}>View</button>
    )
}
