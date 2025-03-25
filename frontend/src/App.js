import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard"
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/departments/DepartmentList";
import AddDepartment from "./components/departments/AddDepartment";
import EditDepartment from "./components/departments/EditDepartment.js";
import List from "./components/employee/List.js";
import Add from './components/employee/Add.js'
import View from "./components/employee/View.js";
import Edit from "./components/employee/Edit.js";
import AddSalary from './components/salary/AddSalary.js'
import ViewSalary from "./components/salary/ViewSalary.js";
import Summary from './components/EmployeeDashboard/Summary.js'
import LeaveList from "./components/leave/LeaveList.js";
import AddLeave from "./components/leave/AddLeave.js";
import Setting from "./components/EmployeeDashboard/Setting.js";
import Table from "./components/leave/Table.js";
import LeaveDetails from "./components/leave/LeaveDetails.js";
import Attendance from "./components/attendance/Attendance.js";
import AttendanceReport from "./components/attendance/AttendanceReport.js";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/admin-dashboard" element={
                    <PrivateRoutes>
                        <RoleBaseRoutes requiredRole={["admin"]}>
                            <AdminDashboard />
                        </RoleBaseRoutes>
                    </PrivateRoutes>
                }>
                    <Route index element={<AdminSummary />}></Route>
                    <Route path="/admin-dashboard/departments" element={<DepartmentList />}></Route>
                    <Route path="/admin-dashboard/add-department" element={<AddDepartment />}></Route>
                    <Route path="/admin-dashboard/department/:id" element={<EditDepartment />}></Route>

                    <Route path="/admin-dashboard/employees" element={<List />}></Route>
                    <Route path="/admin-dashboard/add-employee" element={<Add />}></Route>
                    <Route path="/admin-dashboard/employees/:id" element={<View />}></Route>
                    <Route path="/admin-dashboard/employees/edit/:id" element={<Edit />}></Route>
                    <Route path="/admin-dashboard/employees/salary/:id" element={<ViewSalary />}></Route>
                    <Route path="/admin-dashboard/salary/add" element={<AddSalary />}></Route>
                    <Route path="/admin-dashboard/leaves" element={<Table />}></Route>
                    <Route path="/admin-dashboard/leave/:id" element={<LeaveDetails />}></Route>
                    <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveList />}></Route>
                    <Route path="/admin-dashboard/attendance" element={<Attendance />}></Route>
                    <Route path="/admin-dashboard/attendance-report" element={<AttendanceReport />}></Route>
                    <Route path="/admin-dashboard/settings" element={<Setting />}></Route>


                </Route>
                <Route path="/employee-dashboard" element={
                    <PrivateRoutes>
                        <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                            <EmployeeDashboard />
                        </RoleBaseRoutes>
                    </PrivateRoutes>
                }>
                <Route index element={<Summary />}></Route>
                <Route path="/employee-dashboard/profile/:id" element={<View />}></Route>
                <Route path="/employee-dashboard/leaves/:id" element={<LeaveList />}></Route>
                <Route path="/employee-dashboard/add-leave" element={<AddLeave />}></Route>
                <Route path="/employee-dashboard/salary/:id" element={<ViewSalary />}></Route>
                <Route path="/employee-dashboard/setting" element={<Setting />}></Route>
                
                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default App

