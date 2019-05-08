import React, { Component } from "react";
import { Grommet } from "grommet";
import { grommet } from "grommet/themes";
import { Footer } from "./elements/footer";
import { NavHeader } from "./elements/header";
import { Home } from "./pages/home/home";
import { deepMerge } from "grommet/utils";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Dashboard } from "./pages/ivr-udhyam/dashboard";

const withColors = deepMerge(grommet, {
  global: {
    colors: {
      brand: "#ffca58"
    }
  },
  accordion: {
    border: undefined,
    icons: {
      color: "dark-1"
    }
  }
});
export class App extends Component {
  render() {
    return (
      <Grommet theme={withColors}>
        <Router>
          <NavHeader />
          <Route exact path="/" component={Home} />
          <Route path="/udhyam" component={Dashboard} />
          <Footer />
        </Router>
      </Grommet>
    );
  }
}
