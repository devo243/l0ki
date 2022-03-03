import React, { Component } from "react";
// import { Router } from "@reach/router";
import { Router, Redirect } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import NavBar from "./modules/NavBar.js";
import Rules from "./pages/Rules.js";
import Lobby from "./pages/Lobby.js";
import LobbyRoom from "./pages/LobbyRoom.js";
import ServerGame from "./pages/ServerGame.js";

import "../utilities.css";

import { socket, test, leave } from "../client-socket.js";

import { get, post } from "../utilities";


/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      userName: undefined
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
        this.setState({ userName: user.name })
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      this.setState({ userName: user.name})
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    this.setState({ userName: undefined })
    post("/api/logout");
  };

  render() {
    return (
      <>
        <NavBar 
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId}
        />
        

        <Router>
          <Skeleton
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          <Rules path="/rules" />
          {this.state.userId ? (<Lobby userId={this.state.userId} path="/lobby" />) : (<Redirect from="/lobby" to="/" />)}
          <LobbyRoom  leave={() => leave()} test={() => test()} userId={this.state.userId} userName={this.state.userName} path="/lobby/:roomId" />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
