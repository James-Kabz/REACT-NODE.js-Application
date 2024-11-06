import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginForm from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataPage from "./components/Data";
import ForgotPasswordForm from "./components/ForgotPassword";
import ResetPasswordForm from "./components/ResetPassword";
import PermissionsPage from "./components/Permissions";
import RolesPage from "./components/Roles";
import CommerceShop from "./components/AnalyticsPage";
import LoadingSpinner from "./components/LoadingSpinner";
import "./Loading.css";
import Navigation from "./components/Navigation";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  // const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer />
    </AuthProvider>
  );
}

function AppContent() {
  const { isLoggedIn, userRole } = useAuth();

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/Navigation" />
        </Route>
        <Route exact path="/Navigation">
          <Navigation />
        </Route>
        <Route exact path="/Login">
          <LoginForm />
        </Route>
        <Route path="/ForgotPassword">
          <ForgotPasswordForm />
        </Route>
        <Route path="/ResetPassword">
          <ResetPasswordForm />
        </Route>
        <Route path="/">
          {isLoggedIn ? (
            <Dashboard userRole={userRole} />
          ) : (
            <Redirect to="/Navigation" />
          )}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

function Dashboard({ userRole }) {
  return (
    <div>
      <Navbar />
      <div className="flex-grow p-10 bg-blue-gray-900">
        <Switch>
          <Route exact path="/Dashboard">
            <Home />
          </Route>
          {userRole === "super-admin" && (
            <>
              <Route path="/Permissions" component={PermissionsPage} />
              <Route path="/Roles" component={RolesPage} />
              <Route path="/AnalyticsPage" component={CommerceShop} />
              <Route path="/Data" component={DataPage} />
            </>
          )}
          {userRole === "admin" && (
            <>
              <Route path="/Permissions" component={PermissionsPage} />
              <Route path="/Roles" component={RolesPage} />
              <Route path="/Data" component={DataPage} />
              <Route path="/AnalyticsPage" component={CommerceShop} />
            </>
          )}
          {userRole === "user" && <></>}
          <Redirect to="/Dashboard" />
        </Switch>
      </div>
    </div>
  );
}

export default App;
