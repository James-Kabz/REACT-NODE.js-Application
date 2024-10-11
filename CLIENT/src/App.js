import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Sidebar from "./components/sideBar";
import SalesPage from "./components/sales";
import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginForm from "./components/loginUsers";
import ReportsData from "./components/reportForm";
import UserForm from "./components/userRegForm";
import MakeSaleForm from "./components/customers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataPage from "./components/Data";
import ForgotPasswordForm from "./components/ForgotPassword";
import ResetPasswordForm from "./components/ResetPassword";
import PermissionsPage from "./components/permissions";
import RolesPage from "./components/roles";
function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer />
    </AuthProvider>
  );
}
function AppContent() {
  const { isLoggedIn, userRole } = useAuth(); // Update useAuth to include userRole

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/loginUsers">
          <LoginForm />
        </Route>
        <Route path="/userRegForm">
          <UserForm />
        </Route>
        <Route path="/ForgotPassword">
          <ForgotPasswordForm />
        </Route>
        <Route path="/ResetPassword">
          <ResetPasswordForm />
        </Route>
        <Route path="/">
          {isLoggedIn ? (
            userRole === "super-admin" ? (
              <AdminDashboard />
            ) : (
              <UserDashboard />
            )
          ) : (
            <Redirect to="/loginUsers" />
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
            <Home />
          </Route>
          <Route path="/permissions">
            <PermissionsPage />
          </Route>
          <Route path="/roles">
            <RolesPage />
          </Route>
          <Route path="/sales">
            <SalesPage />
          </Route>
          <Route path="/reportForm">
            <ReportsData />
          </Route>
          <Route path="/customers">
            <MakeSaleForm />
          </Route>
          <Route path="/Data">
            <DataPage />
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
            <Home />
          </Route>
          <Route path="/roles">
            <RolesPage />
          </Route>
          <Route path="/sales">
            <SalesPage />
          </Route>
          <Route path="/customers">
            <MakeSaleForm />
          </Route>
          <Route path="/permissions">
            <PermissionsPage />
          </Route>
          {/* <Redirect to="/sales" /> */}
        </Switch>
      </div>
    </div>
  );
}

export default App;
