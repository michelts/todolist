import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Tasks from './Tasks';

const Index = () => (
  <Router>
    <Switch>
      <Route path="/tasks">
        <Tasks />
      </Route>
      <Route path="/logout">
        <Logout />
      </Route>
      <Route>
        <Login />
      </Route>
    </Switch>
  </Router>
)

export default Index;
