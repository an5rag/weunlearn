import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

it("renders without crashing", () => {
  const divNode = document.createElement("div");
  ReactDOM.render(<App />, divNode);
  ReactDOM.unmountComponentAtNode(divNode);
});
