import React, { StrictMode }  from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createRoot } from "react-dom/client";

import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

import App from "./App";
import Admin from './components/Admin';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

root.render(
  <StrictMode>
    <AgoraRTCProvider client={client}>
    <Router>
      <Switch>
      <Route exact path="/">
        <App />
      </Route>
      <Route path="/admin">
        <Admin />
      </Route>
      </Switch>
    </Router>
    </AgoraRTCProvider>
  </StrictMode>
);
