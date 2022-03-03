import React, { Component } from "react";
import { createLobby, joinLobby } from "../../client-socket.js";
import { Link } from "@reach/router";
import CreateLobby from "../modules/CreateLobby.js";
import JoinLobby from "../modules/JoinLobby.js";
import "./Lobby.css";


class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
  }


  render() {
    return (
      <div class="lobbyContent container">
        <div class="item box-shadow">
          <h2 class="glow-blue">Create Game</h2>
          <hr></hr>
          <CreateLobby mode=""/>
        </div>
        <div class="item box-shadow">
          <h2 class="glow-green">Join Game</h2>
          <hr></hr>
          <JoinLobby />
        </div>
        <div class="item box-shadow">
          <h2 class="glow-red">Singleplayer</h2>
          <hr></hr>
          <CreateLobby mode="singleplayer" />


        </div>
      </div>
    );
  }
}

export default Lobby;
