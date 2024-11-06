import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ECommerceShop from "./Dashboard";
import ReportsData from "./AnalyticsPage";
import PermissionsPage from "./Permissions";
import RolesPage from "./Roles";
// import LoginForm from "./loginUsers";

const Home = () => {
  return (
    <div>
      <BrowserRouter>
        <div className="">
          <Switch>
            {/* Uncomment this if you want to use the login route
            <Route exact path="/loginUsers">
              <LoginForm />
            </Route>
            */}

            {/* Define the default root route to redirect to Dashboard */}
            <Route exact path="/">
              <Redirect to="/Dashboard" />
            </Route>

            <Route path="/Permissions" component={PermissionsPage} />
            <Route path="/Roles" component={RolesPage} />
            <Route path="/Dashboard" component={ECommerceShop} />
            <Route path="/AnalyticsPage" component={ReportsData} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Home;
