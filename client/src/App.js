import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Header from "./components/Headers";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <Router>
        <Header />
        <Switch>
          <Route path="/analytics" component={Analytics} />
          <Route exact path="/" component={Landing} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
            

          <ProtectedRoute exact path="/projects" component={Projects} />
          <ProtectedRoute path="/projects/:id" component={ProjectDetail} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}
