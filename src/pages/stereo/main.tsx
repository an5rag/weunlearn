import * as React from "react";
import { Route, RouteComponentProps } from "react-router";
import { BrowserRouter, NavLink } from "react-router-dom";
import { DashboardContainer } from "./pages/dashboard/dashboardContainer";
import { Box, Heading, Text } from "grommet";
import { PhonebookContainer } from "./pages/phonebook/phonebookContainer";

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
          <NavLink
            style={{ textDecoration: "none", paddingBottom: "5px" }}
            exact
            activeStyle={{ borderBottom: "3px solid #ffca58" }}
            to={props.match.url}
          >
            <Text color="brand">Dashboard</Text>
          </NavLink>
        </Heading>
        <Heading level="4" color="accent-1">
          <NavLink
            style={{ textDecoration: "none", paddingBottom: "5px" }}
            activeStyle={{ borderBottom: "3px solid #ffca58" }}
            to={`${props.match.url}/phonebook`}
          >
            <Text color="brand">Phonebook</Text>
          </NavLink>
        </Heading>
      </Box>

      <Box
        width="100%"
        direction="row"
        justify="center"
        pad={{ vertical: "large", horizontal: "large" }}
      >
        <Route exact path={props.match.url} component={DashboardContainer} />
        <Route
          path={`${props.match.url}/phonebook`}
          component={PhonebookContainer}
        />
      </Box>
    </BrowserRouter>
  );
};
