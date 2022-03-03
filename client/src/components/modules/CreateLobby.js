import React, { Component } from "react";
import { Link } from "@reach/router";
import { createLobby } from "../../client-socket.js"
import "./../pages/Lobby.css"



class CreateLobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: "",
        };

    };

    componentDidMount = () => {
        this.getNewRoomId();
    };

    getNewRoomId = () => {
        const newRoomId = this.newRoomId(6);
        this.setState({ roomId: newRoomId});

    };

    newRoomId = (numCharacters) => {
        let roomId = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let i = 0; i < numCharacters; i++) {
            const random = Math.floor(Math.random() * characters.length);

            roomId += characters.charAt(random);
        };

        return roomId;
    }

    render() {
        return (
            <div>
                {this.props.mode === "singleplayer" ? (<Link to={`/lobby/${this.state.roomId}`}>
                    <button class="button2" onClick={() => createLobby(this.state.roomId)}>practice</button>
                </Link>) : (<Link to={`/lobby/${this.state.roomId}`}>
                    <button class="button2" onClick={() => createLobby(this.state.roomId)}>create room</button>
                </Link>)}
                
            </div>

        )

    }
};

export default CreateLobby;