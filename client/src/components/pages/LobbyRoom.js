import React, { Component } from "react";
import { gamesocket, returnLobby } from "../../client-socket.js";
import { Link } from "@reach/router";
import { test, leave} from "../../client-socket.js";
import GameCreate from "../modules/GameCreate.js";
import WaitingRoom from "../modules/WaitingRoom.js";
import "./Rules.css";
import { get, post } from "../../utilities.js";
import Confetti from "react-confetti";

class LobbyRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isJoined: null,
      pageStatus: null,
      host: false,
      winner: null,
      players: [],
      numCards: 7,
    }
  }

  componentDidMount = () => {
    gamesocket.emit("checkJoined", this.props.roomId);
    gamesocket.emit("checkHost", this.props.roomId);
    gamesocket.emit("getPlayers", this.props.roomId);
    

    gamesocket.on("isJoined", (status) => {
      if (status) {
        this.setState({ isJoined: true})
      } else {
        this.setState({ isJoined: false})
      }
    })
    gamesocket.on("testping", (test) => console.log("xddddd", this.props.roomId));

    gamesocket.on("statusChange", (status, winner) => {
      console.log("hello");
      this.setState({ pageStatus: status, winner: winner });
    });

    gamesocket.on("newHost", (isHost) => {
      this.setState({ host: isHost });
      console.log("there is a new host");
    });

    gamesocket.on("listPlayers", (players) => {
      this.setState({ players: players});
    })

    gamesocket.on("newPlayer", async (user) => {
      let isPlayer = true;
      for(let i = 0; i < this.state.players.length; i++) {
        if (this.state.players[i]._id === user._id) {
          isPlayer = false;
        };
      };

      if (isPlayer) {
        await this.setState((prevstate) => ({
        players: prevstate.players.concat([{name: user.name, _id: user._id}])}))
      };
    });

    gamesocket.on("deletePlayer", (user) => {
      let copystate = {...this.state};
      let oldPlayers = copystate.players;
      let newPlayers = oldPlayers.filter((player) => {
        if (player._id !== user._id) {
          return player;
        };
      });
      this.setState({
        players: newPlayers,
      });
    });

    gamesocket.on("newNumCards", (numCards) => {
      this.setState({ numCards: numCards });
    });
  }

  componentWillUnmount = () => {
    gamesocket.emit("leave", this.props.roomId);
    gamesocket.removeAllListeners();
  }

  render() {
    let players;

    if (this.state.players.length === 0) {
      players = [];
    } else {
      players = this.state.players.map((player) => {
        return player.name
      })
    }

    if (this.state.isJoined) {
      if (this.state.pageStatus === "lobby") {
        return (
          <WaitingRoom roomId={this.props.roomId} players={players} host={this.state.host} numCards={this.state.numCards} />
        );
      } else if (this.state.pageStatus === "game") {
        return (
          <div>
            <div className="u-textCenter">
            </div>
            <Link to="/">
              <button className="button2" > leave </button>
            </Link>

            {this.props.userId && (<GameCreate userId={this.props.userId} gameId={this.props.roomId} players={players} numCards={this.state.numCards} userName={this.props.userName}/>)}
          </div>
        );
      } else if (this.state.pageStatus === "winner") {
        return (
          <div className="u-textCenter">
            <h1>{this.state.winner} has won!</h1>
            <div>
              <button className="button2" onClick={() => returnLobby(this.props.roomId)} > Return to Lobby </button>
            </div>
            <Link to="/">
              <button className="button2"> leave </button>
            </Link>
            <div>             
              <Confetti width={window.innerWidth} height={window.innerHeight}/>
            </div>
          </div>
        )
      }
    };

    return (
      <div>
        <h1 class="u-textCenter">Error: No Lobby Found!</h1>
      </div>
    )
  }
}

export default LobbyRoom;
