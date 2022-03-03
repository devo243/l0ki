import React, { Component } from "react";
import GameCreate from "../modules/GameCreate.js";
import "../../utilities.css";
import { gamesocket } from "../../client-socket.js";
import "./Rules.css";
import "./Lobby.css";

class ServerGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageStatus: "game",
      winner: null,
    }
  };

  componentDidMount = () => {
    gamesocket.on("statusChange", (status, winner) => {
      console.log("hello");
      this.setState({ pageStatus: status, winner: winner });
    });
  }


  componentWillUnmount = () => {
    gamesocket.emit("leave", "000000")
    gamesocket.removeAllListeners();
  }

  render() {
    if (this.state.pageStatus === "game") {
      return (
        <div className="u-textCenter trump2020">
          <h2> reload the page to see cards </h2>

          <p>Your deck</p>

          {this.props.userId && (<GameCreate userId={this.props.userId} players={[this.props.userName]} userName={this.props.userName} gameId={"000000"} numCards={10} />)}
        </div>
      );
    } else if (this.state.pageStatus === "winner") {
      return (
        <div className="u-textCenter">
          <h1>{this.state.winner}</h1>
          <div>
            <button className="button2" onClick={() => returnLobby(this.props.roomId)} > Return to Lobby </button>
          </div>
          <Link to="/">
            <button className="button2"> leave </button>
          </Link>
          <div>             
            <Confetti/>
          </div>
        </div>
      )
    }
  }
}

export default ServerGame;