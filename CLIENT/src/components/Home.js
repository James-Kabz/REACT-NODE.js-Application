import {
  BrowserRouter as Route,
  Switch,
} from "react-router-dom/cjs/react-router-dom.min";
import Dashboard from "./dashboard";
import SalesPage from "./sales";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom";
import ReportsData from "./reportForm";
import MakeSaleForm from "./customers";
import PermissionsPage from "./permissions";
import RolesPage from "./roles";
// import LoginForm from "./loginUsers";

const Home = () => {
  return (
    <div>
      <BrowserRouter>
        <div className="bg-dark-400">
          <Switch>
            {/* <Route exact path="/loginUsers">
                <LoginForm />
              </Route> */}

            <Route path="/permissions">
              <PermissionsPage />
            </Route>
            <Route path="/roles">
              <RolesPage />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/sales">
              <SalesPage />
            </Route>
            <Route path="/customers">
              <MakeSaleForm />
            </Route>
            <Route path="/reportForm">
              <ReportsData />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Home;
