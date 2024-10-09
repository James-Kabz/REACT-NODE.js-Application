import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Sidebar from "./components/sideBar";
import SalesPage from "./components/sales";
import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginForm from "./components/loginAdmin";
import RegistrationForm from "./components/registerForm";
import ReportsData from "./components/reportForm";
import UserForm from "./components/userRegForm";
import LoginUserForm from "./components/loginUser";
import MakeSaleForm from "./components/customers";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import DataPage from "./components/Data";
import ForgotPasswordForm from "./components/ForgotPassword";
import ResetPasswordForm from "./components/ResetPassword";
function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer/>
    </AuthProvider>
  );
}
function AppContent() {
  const { isLoggedIn, userRole } = useAuth(); // Update useAuth to include userRole

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/loginAdmin">
          <LoginForm />
        </Route>
        <Route path="/registerForm">
          <RegistrationForm />
        </Route>
        <Route path="/loginUser">
          <LoginUserForm/>
        </Route>
        <Route path="/userRegForm">
          <UserForm/>
        </Route>
        <Route path="/ForgotPassword">
          <ForgotPasswordForm/>
        </Route>
        <Route path="/ResetPassword">
          <ResetPasswordForm/>
        </Route>
        <Route path="/">
          {isLoggedIn ? (
            userRole === "admin" ? (
              <AdminDashboard />
            ) : (
              <UserDashboard />
            )
          ) : (
            <Redirect to="/loginAdmin" />
          )}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

function AdminDashboard() {
  return (
    <div>
      <Sidebar />
      <div className="flex-grow ml-0 lg:ml-60 bg-blue-gray-900">
        <Navbar />
        <Switch>
          <Route exact path="/dashboard">
            <Home/>
          </Route>
          <Route path="/sales">
            <SalesPage />
          </Route>
          <Route path="/reportForm">
            <ReportsData />
          </Route>
           <Route path="/customers">
            <MakeSaleForm/>
          </Route>
          <Route path="/Data">
            <DataPage/>
          </Route>
          <Redirect to="/dashboard" />
        </Switch>
      </div>
    </div>
  );
}

function UserDashboard() {
  return (
    <div>
      <Sidebar />
      <div className="flex-grow ml-0 lg:ml-60 bg-blue-gray-900">
        <Navbar />
        <Switch>
          <Route exact path="/dashboard">
            <Home/>
          </Route>
          <Route path="/sales">
            <SalesPage />
          </Route>
          <Route path="/customers">
            <MakeSaleForm/>
          </Route>
          {/* <Redirect to="/sales" /> */}
        </Switch>
      </div>
    </div>
  );
}

export default App;



