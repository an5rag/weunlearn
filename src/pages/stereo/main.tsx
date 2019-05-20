import * as React from "react";
import { Route, RouteComponentProps } from "react-router";
import { BrowserRouter, NavLink } from "react-router-dom";
import { Box, Heading, Text } from "grommet";
import { PhonebookContainer } from "./pages/phonebook/phonebookContainer";
import { Projects } from "./pages/projects/projects";

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
            <Text color="brand">Projects</Text>
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
        <Route exact path={props.match.url} component={Projects} />
        <Route
          path={`${props.match.url}/phonebook`}
          component={PhonebookContainer}
        />
      </Box>
    </BrowserRouter>
  );
};
