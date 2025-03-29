import React, { useEffect, useState } from 'react';
import { fetchDepartments, getEmployees } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_EMS_BACKEND_URL;

const AddSalary = () => {
    const [salary, setSalary] = useState({
        employeeId: null,
        basicSalary: 0,
        deductions: 0,
        allowances: 0,
        payDate: null,
        tax: 0,  // Added tax field
        netSalary: 0 // Added netSalary field
    });
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);    
    const navigate = useNavigate();

    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            setDepartments(departments);
        };
        getDepartments();
    }, []);

    const handleDepartment = async (e) => {
        const emps = await getEmployees(e.target.value);
        setEmployees(emps);
    };

    // Function to calculate tax
    const calculateTax = (basicSalary) => {
        if (basicSalary <= 25000) return basicSalary * 0.05; // 5% tax
        if (basicSalary <= 50000) return basicSalary * 0.10; // 10% tax
        return basicSalary * 0.20; // 20% tax
    };

    // Update form state & calculate tax
    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedSalary = { ...salary, [name]: value };

        // Convert values to numbers for calculations
        const basic = parseFloat(updatedSalary.basicSalary) || 0;
        const allow = parseFloat(updatedSalary.allowances) || 0;
        const deduct = parseFloat(updatedSalary.deductions) || 0;

        // Calculate tax
        const taxAmount = calculateTax(basic);
        updatedSalary.tax = taxAmount;

        // Calculate net salary after tax
        updatedSalary.netSalary = basic + allow - deduct - taxAmount;
        setSalary(updatedSalary);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/salary/add`, salary, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                navigate("/admin-dashboard/employees");
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        }
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className="max-w-2xl w-1/2 mx-auto p-9 rounded-2xl bg-white shadow-lg overflow-hidden">
                <h2 className="text-2xl font-bold p-3 text-center mb-6">Add Salary</h2>
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Department */}
                        <div>
                            <label className="block font-medium">Department</label>
                            <select name='department' required onChange={handleDepartment} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Department</option>
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.id}>{dep.dep_name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Employee */}
                        <div>
                            <label className="block font-medium">Employee</label>
                            <select name='employeeId' required onChange={handleChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.employeeId}</option>
                                ))}
                            </select>
                        </div>

                        {/* Basic Salary */}
                        <div>
                            <label className="block font-medium">Basic Salary</label>
                            <input type='number' name='basicSalary' onChange={handleChange} placeholder='Basic Salary' required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Allowances */}
                        <div>
                            <label className="block font-medium">Allowances</label>
                            <input type='number' name='allowances' placeholder='Allowances' onChange={handleChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Deductions */}
                        <div>
                            <label className="block font-medium">Deductions</label>
                            <input type='number' name='deductions' placeholder='Deductions' onChange={handleChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Tax (Auto-calculated) */}
                        <div>
                            <label className="block font-medium">Tax (Calculated)</label>
                            <input type='number' name='tax' value={salary.tax.toFixed(2)} readOnly className="w-full p-2 border rounded-lg bg-gray-200" />
                        </div>

                        {/* Net Salary (After Tax) */}
                        <div>
                            <label className="block font-medium">Net Salary</label>
                            <input type='number' name='netSalary' value={salary.netSalary.toFixed(2)} readOnly className="w-full p-2 border rounded-lg bg-gray-200" />
                        </div>

                        {/* Pay Date */}
                        <div>
                            <label className="block font-medium">Pay Date</label>
                            <input type='date' name='payDate' onChange={handleChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <button type='submit' className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">Add Salary</button>
                </form>
            </div>
        </div>
    );
};

export default AddSalary;
