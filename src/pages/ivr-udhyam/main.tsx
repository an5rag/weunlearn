import * as React from "react";
import { Route, RouteComponentProps } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { DashboardContainer } from "./pages/dashboard/dashboardContainer";
import { Users } from "./pages/users/users";

export const Main = (props: RouteComponentProps) => {
  return (
    <BrowserRouter>
      <Route exact path={props.match.url} component={DashboardContainer} />
      <Route path={`${props.match.url}/users`} component={Users} />
    </BrowserRouter>
  );
};
