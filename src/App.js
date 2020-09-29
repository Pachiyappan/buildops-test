import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout } from "./components/common";
import { Employees } from "./components/pages/Employees";

function App() {
  return (
    <div>
      <Router>
        <Layout>
          <Switch>
            <Route
              exact
              path="/employees/:id?/:action?"
              component={Employees}
            />
          </Switch>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
