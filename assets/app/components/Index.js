import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Container from 'common/components/Container';
import Header from './Header';
import Login from './Login';
import Logout from './Logout';
import Register from './Register';
import Tasks from './Tasks';

const Index = () => (
  <Router>
    <Header>
      Todo list application
    </Header>
    <Container>
      <Switch>
        <Route path="/tasks">
          <Tasks />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route>
          <Login />
        </Route>
      </Switch>
    </Container>
  </Router>
);

export default Index;
