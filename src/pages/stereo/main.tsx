import * as React from "react";
import { Route, RouteComponentProps } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";
import { DashboardContainer } from "./pages/dashboard/dashboardContainer";
import { Users } from "./pages/users/users";
import { Box, Heading } from "grommet";

export const Main = (props: RouteComponentProps) => {
  return (
    <BrowserRouter>
      <Box width="100%" direction="row" justify="center">
        <Heading
          color="brand"
          level="1"
          textAlign="center"
          style={{ alignSelf: "center" }}
        >
          Stereo
        </Heading>
      </Box>
      <Box width="100%" direction="row" justify="center" gap={"small"}>
        <Heading level="4" color="accent-1">
          <Link to={props.match.url}>Dashboard</Link>
        </Heading>
        <Heading level="4" color="accent-1">
          <Link to={`${props.match.url}/users`}>Users</Link>
        </Heading>
      </Box>

      <Box
        width="100%"
        direction="row"
        justify="center"
        pad={{ vertical: "large", horizontal: "large" }}
      >
        <Route exact path={props.match.url} component={DashboardContainer} />
        <Route path={`${props.match.url}/users`} component={Users} />
      </Box>
    </BrowserRouter>
  );
};
