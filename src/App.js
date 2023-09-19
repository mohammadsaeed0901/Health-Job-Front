/** @format */

import React, { Component } from "react";
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./assets/scss/index.scss";
import Routes from "./Routes";

const browserHistory = createBrowserHistory();

export default class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <RTL> */}
          <ThemeProvider theme={theme}> 
            <PerfectScrollbar>
              <Router history={browserHistory}>
                {/* <Route exact component={Dashboard} path="/" /> */}
                <Routes />
              </Router>
            </PerfectScrollbar>
          </ThemeProvider>
        {/* </RTL> */}
      </div>
    );
  } 
}

// export default App;
