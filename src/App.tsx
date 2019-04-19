import React, { Component } from "react";
import { Grommet } from "grommet/components/Grommet";
import { grommet } from "grommet/themes";
import { Box } from "grommet/components/Box";

export class App extends Component {
  render() {
    return (
      <Grommet theme={grommet}>
        <Box align="center" height="100vh" justify="center">
          <h1>weunlearn.org</h1>
          <div>contact@weunlearn.com</div>
        </Box>
      </Grommet>
    );
  }
}
