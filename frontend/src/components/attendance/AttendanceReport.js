import axios from 'axios';
import React, { useEffect, useState } from 'react';


const AttendanceReport = () => {
    const [report, setReport] = useState("")
    const [limit, setLimit] = useState(5)
    const [skip, setSkip] = useState(0)
    const [dateFilter, setDateFilter] = useState('')

    // Function to get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    useEffect(() => {
        // Set today's date by default when the page loads
        setDateFilter(getTodayDate());
    }, []);

    const fetchReport = async () => {
        try {
            console.log("Entered in fetchReport")
            const query = new URLSearchParams({ limit, skip })
            if (dateFilter) {
                query.append("date", dateFilter)
            }
            const response = await axios.get(`http://localhost:5000/api/attendance/report?${query.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(response)
            if (response.data.success) {
                let sno = 1;
                if (skip == 0) {
                    setReport(response.data.groupData)
                } else {
                    setReport(prevData => ({ ...prevData, ...response.data.groupData }))
                }
            }
        } catch (error) {
            console.log(error.message)

        }
    }

    useEffect(() => {
        if (dateFilter) {
            fetchReport()
        }
    }, [dateFilter, limit, skip])

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-center text-3xl font-bold mb-7 mt-5 text-blue-600">Attendance Report</h2>
            <div className="flex items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold">Filter by Date</h2>
                <input type="date" className="border border-gray-300 rounded-md p-2 bg-gray-100 focus:ring-2 focus:ring-blue-400" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}></input>
            </div>
            {/* Display message if no data is found */}
            {Object.keys(report).length === 0 ? (
                <div className="text-center text-gray-500 text-lg mt-5">
                    No attendance data found for {dateFilter}.
                </div>
            ) : (
                Object.entries(report).map(([date, records]) => (
                    <div key={date} className="bg-white shadow-lg rounded-lg p-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">{date}</h2>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr className="text-left">
                                    <th className="border border-gray-300 p-2 text-center">S No</th>
                                    <th className="border border-gray-300 p-2 text-center">Employee ID</th>
                                    <th className="border border-gray-300 p-2 text-center">Name</th>
                                    <th className="border border-gray-300 p-2 text-center">Department</th>
                                    <th className="border border-gray-300 p-2 text-center">status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((data, i) => (
                                    <tr key={data.employeeId} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2 text-center">{i + 1}</td>
                                        <td className="border border-gray-300 p-2 text-center">{data.employeeId}</td>
                                        <td className="border border-gray-300 p-2 text-center">{data.employeeName}</td>
                                        <td className="border border-gray-300 p-2 text-center">{data.departmentName}</td>
                                        <td className={`border border-gray-300 p-2 font-semibold text-center
                                        ${data.status === 'Present' ? 'text-green-600' :
                                                data.status === 'Absent' ? 'text-red-600' :
                                                    data.status === 'Sick' ? 'text-yellow-600' :
                                                        'text-gray-600'}`}>
                                            {data.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </div>
    );
}

export default AttendanceReport;
