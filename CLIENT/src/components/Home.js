import {
  BrowserRouter as Route,
  Switch,
} from "react-router-dom/cjs/react-router-dom.min";
import ECommerceShop from "./Dashboard";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom";
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
            {/* <Route exact path="/loginUsers">
                <LoginForm />
              </Route> */}

            <Route path="/Permissions">
              <PermissionsPage />
            </Route>
            <Route path="/Roles">
              <RolesPage />
            </Route>
            <Route path="/Dashboard">
              <ECommerceShop />
            </Route>
            <Route path="/AnalyticsPage">
              <ReportsData />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Home;
