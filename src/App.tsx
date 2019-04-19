import React, { Component } from "react";
import { Grommet } from "grommet";
import { grommet } from "grommet/themes";
import { Box } from "grommet/components/Box";
import { Footer } from "./elements/footer";
import { StickyNavHeader } from "./elements/header";
import { Home } from "./pages/home/home";
import { deepMerge } from "grommet/utils";

const withColors = deepMerge(grommet, {
  global: {
    colors: {
      brand: "#ffca58"
    }
  }
});
export class App extends Component {
  render() {
    return (
      <Grommet theme={withColors}>
      <StickyNavHeader/>
        <Box align="center" justify="center">
          <Home/>
        </Box>
        <Footer/>
      </Grommet>
    );
  }
}
