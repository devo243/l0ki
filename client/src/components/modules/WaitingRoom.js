import React, { Component } from "react";
import { test, leave, startGame, subtractCards, addCards } from "../../client-socket.js";
import { Link } from "@reach/router";
import "../pages/Rules.css";
import "./WaitingRoom.css"

class WaitingRoom extends Component {
    constructor(props) {
      super(props);
    };

    render () {
        return (
            <div class="WaitingRoom-container">
              
              <div class="WaitingRoom-item">
                <div>
                  {this.props.players && this.props.players.map((player) => (<div className="rule-container">{player}</div>))}
                </div>
              </div>

              <div class="WaitingRoom-item">
                <div class="WaitingRoom-vertical">
                  <h1 class="glow-green">Welcome to the lobby</h1>
                  
                  <div>
                  {this.props.host && (<button class="button2 bigboybutton" onClick={() => startGame(this.props.roomId)} > Start Game </button>)}
                  </div>

                  <div>
                    {this.props.host && (<button className="button2" onClick={() => subtractCards(this.props.roomId, this.props.numCards)}> {"<"} </button>)}
                    {"  " + this.props.numCards + "  "}
                    {this.props.host && (<button className="button2" onClick={() => addCards(this.props.roomId, this.props.numCards)}> {">"} </button>)}
                  </div>


                  <div>
                  <Link to="/">
                    <button class="button2"> leave </button>
                  </Link>
                  </div>


                </div>
                
              </div>

              <div class="WaitingRoom-third-item WaitingRoom-item">
                <div>
                    Copy Room ID: <button class="button2" onClick={() => navigator.clipboard.writeText(this.props.roomId)}>{this.props.roomId}</button>
                </div>
              </div>
            </div>
          );
    }
};

export default WaitingRoom;