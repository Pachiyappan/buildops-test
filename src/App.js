import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout } from "./components/common";
import { Employees } from "./components/pages/Employees";
import { Skills } from "./components/pages/Skills";

function App() {
  return (
    <Router>
      <Switch>
        <Layout>
          <Switch>
            <Route
              exact
              path="/employees/:id?/:action?"
              component={Employees}
            />
            <Route exact path="/skills/:id?/:action?" component={Skills} />
          </Switch>
        </Layout>
      </Switch>
    </Router>
  );
}

export default App;
