import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
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
import Shop from "./components/Shop";
import { CartProvider } from "./components/CartContext";
import "./Loading.css"
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
      <CartProvider>
        {" "}
        {/* Wrap everything with CartProvider */}
        <AppContent />
      </CartProvider>{" "}
      <ToastContainer />
    </AuthProvider>
  );
}
function AppContent() {
  const { isLoggedIn, userRole } = useAuth();

  return (
    <BrowserRouter>
      <Navigation /> {/* Navigation is always rendered */}
      <Switch>
        <Route exact path="/">
          <Redirect to="/Navigation" />
        </Route>
        <Route exact path="/Navigation">
          <Navigation />
        </Route>
        <Route exact path="/Shop">
          <Shop /> {/* Shop route can be accessed without login */}
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
      <Navigation />
      <div className="flex-grow p-10 bg-blue-gray-900">
        <Switch>
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
          <Route exact path="/Shop">
            <Shop />
          </Route>
          <Redirect to="/AnalyticsPage" />
        </Switch>
      </div>
    </div>
  );
}

export default App;
