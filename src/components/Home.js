// import { BrowserRouter as Route, Router } from "react-router-dom/cjs/react-router-dom.min"
// import Dashboard from "./dashboard"

// const Home = () => {
//     <Router>
//     <Route path="/dashboard">
//         <Dashboard />
//     </Route>
//     </Router>

// }

// export default  Home
// import {  BrowserRouter as Route } from "react-router-dom"; 
import { BrowserRouter as Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import Dashboard from "./dashboard";
import SalesPage from "./sales";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom";
import ReportsData from "./reportForm";
import MakeSaleForm from "./customers";


const Home = () => {
    return (
        <div>
            <BrowserRouter>
                <div className="bg-dark-400">
                    <Switch>
                        <Route path="/dashboard" >
                            <Dashboard/>
                        </Route>
                        <Route path="/sales">
                            <SalesPage/>
                        </Route>
                        <Route path="/customers">
                            <MakeSaleForm/>
                        </Route>
                        <Route path="/reportForm">
                            <ReportsData/>
                        </Route>
                    </Switch>
                </div>
                
            </BrowserRouter>
        </div>
    );
}

export default Home;
