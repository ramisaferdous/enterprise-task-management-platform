import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProjectView from './pages/ProjectView';
import TaskManagement from './pages/TaskManagement';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/projects" component={ProjectView} />
        <Route path="/tasks" component={TaskManagement} />
      </Switch>
    </Router>
  );
}

export default App;