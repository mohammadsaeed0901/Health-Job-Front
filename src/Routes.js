/** @format */

import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import {Dashboard} from "components/Dashboard"
import {Job} from "components/Job"

const Routes = () => {
  return (
    <Switch>
      <Route path = "/job/:jobName">
        <Job/>
      </Route>
      <Route path = "/dashboard">
        <Dashboard/>
      </Route>
      <Route path = "/">
        <Dashboard/>
      </Route>
      {/* <Redirect exact from="/" to="/dashboard" />  */}
      <Redirect to="/not-found" /> 
    </Switch>
  );
};

export default Routes;