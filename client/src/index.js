import React from "react";
import ReactDOM from "react-dom";
import Pikkels from "./pikkels";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import "bootstrap/dist/css/bootstrap.css";
import "./pikkels.css";

const apollo = new ApolloClient({ uri: "http://localhost:3001/graphql" });
ReactDOM.render(
  <ApolloProvider client={apollo}>
    <Pikkels />
  </ApolloProvider>,
  document.getElementById("root"),
);
