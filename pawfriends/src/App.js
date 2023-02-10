import React from "react";
import "./App.css";

import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { checkSession } from "./actions/authenticationAndSessionCheck";

import Registration from "./components/Registration";
import Home from "./components/Home";
import Posts from "./components/Posts";
import Trades from "./components/Trades";
import Services from "./components/Services";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";

import NavBar from "./components/NavBar";
import NavBarAdmin from "./components/NavBarAdmin";
import NavBarGuest from "./components/NavBarGuest";

class App extends React.Component {
  // Global state passed to all components of the app
  constructor(props) {
    super(props);
    this.state = { currentUser: null };
  }

  stateUpdater = (stateUpdateObj) => {
    this.setState(stateUpdateObj);
  };

  componentDidMount = () => {
    document.title = "Pawfriends"; // Browser title bar text
    checkSession(this.stateUpdater, this.props.history);
    console.log("componentDidMount(): Checked session");
  };

  componentDidUpdate = () => {
    // checkSession(this.stateUpdater, this.props.history);
    // console.log("componentDidUpdate: Checked session");
  };

  render() {
    const { currentUser } = this.state;
    return (
      <div className="App">
        {currentUser ? (
          currentUser.admin ? (
            <NavBarAdmin />
          ) : (
            <NavBar
              parentStateUpdater={this.stateUpdater}
              currentUser={currentUser}
            />
          )
        ) : (
          <NavBarGuest />
        )}
        <Switch>
          <Route
            exact
            path="/registration"
            render={(props) => <Registration {...props} />}
          />
          <Route exact path="/posts" render={(props) => <Posts {...props} />} />
          <Route
            exact
            path="/trades"
            render={(props) => <Trades {...props} currentUser={currentUser} />}
          />
          <Route
            exact
            path="/services"
            render={(props) => <Services {...props} />}
          />
          <Route
            exact
            path="/settings"
            render={() => <Settings currentUser={currentUser} />}
          />
          <Route
            exact
            path="/profile/:username"
            render={(props) => <Profile {...props} currentUser={currentUser} />}
          />
          <Route
            exact
            path="/admindashboard"
            render={() => <AdminDashboard appState={this.state} />}
          />
          <Route
            exact
            path={["/", "/login"] /* Any of these URLs are accepted. */}
            render={(props) => (
              <div className="app">
                {/* Different components rendered depending on if someone is logged in. */}
                {!currentUser ? (
                  <Login />
                ) : (
                  <Home {...props} app={this} appState={this.state} />
                )}
              </div>
            )}
          />
          {/* Redirect any links not recognized to the home/login page */}
          <Redirect from="*" to="/" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
