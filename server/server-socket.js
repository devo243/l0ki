let io;
let game;
const logic = require("./logic.js");
const user = require("./models/user.js");

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object
const rooms = {};
const userToRoom = {};
const socketToRoom = {};

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const getListofPlayers = (room) => {
  if (rooms[room]) {
    const players = Object.keys(rooms[room]).slice(3);
    return players;
  };
};

const getUserFromFilterSocketID = (socketid, filter) => {
  const filteredSocketId = socketid.replace(filter, "");
  
  return getUserFromSocketID(filteredSocketId);
};

const changeReadyStatus = (room, users, status) => {
  for (let i = 0; i < users.length; i++) {
    rooms[room][users[i]].isReady = status;
  };
};

const checkIfAllReady = (room) => {
  const players = getListofPlayers(room);
  for (let i = 0; i < players.length; i++) {
    if (!rooms[room][players[i]].isReady) {
      return false;
    }
  }
  return true;
};

const changeHost = (room, socketid, status) => {
  rooms[room][socketid].isHost = status;
};

const nextTurn = (room, socket) => {
  const players = getListofPlayers(room);
  const numPlayers = players.length;

  const nextTurn = (players.indexOf(socket.id) + 1) % numPlayers;
  const nextUser = players[nextTurn];

  console.log(socket.id, "this is the old turn");
  console.log(nextUser, "this is the new turn");

  rooms[room][socket.id].isTurn = false;
  rooms[room][nextUser].isTurn = true;

  game.to(room).emit("nextUser", rooms[room][nextUser].user);

}


const addUsertoRoom = (user, socket, room) => {
  if (rooms[room]) {
    if (!(socket.id in rooms[room])) {
      const userData = {
        user: user,
        isHost: false,
        isTurn: false,
        isReady: true,
      }

      rooms[room][socket.id] = userData,
      userToRoom[user._id] = room;
      socketToRoom[socket.id] = room;
    };
  } else {
    rooms[room] = {
      pageStatus: "lobby",
      rules: [],
      lastCard: null,
    };
    
    const userData = {
      user: user,
      isHost: true,
      isTurn: false,
      isReady: true,
    }

    rooms[room][socket.id] = userData;
    userToRoom[user._id] = room;
    socketToRoom[socket.id] = room;
  }

};

const removeUserfromRoom = (socket) => {
  const room = socketToRoom[socket.id];
  const user = getUserFromFilterSocketID(socket.id);
  if (room) {
    if (rooms[room][socket.id].isTurn) {
    nextTurn(room, socket);
    };
    if (Object.keys(rooms[room]).length > 4) {
      console.log("there is still at least a person left");
      const oldUser = rooms[room][socket.id].user;
      delete userToRoom[oldUser._id];
      game.to(room).emit("deletePlayer", oldUser);

      delete rooms[room][socket.id];
      delete socketToRoom[socket.id];

      // Changes the host if the previous host leaves
      const playerSockets = getListofPlayers(room);
      const newSocketHost = playerSockets[0];

      changeHost(room, newSocketHost, true);
      game.to(newSocketHost).emit("newHost", true);

    } else {
      console.log("the room has been deleted");
      const oldUser = rooms[room][socket.id].user;
      delete userToRoom[oldUser._id];
      delete rooms[room];
      delete socketToRoom[socket.id]
    };
  }
};

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];

  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    // oldSocket.disconnect();
    // delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);
    game = io.of("/game");

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
      // Listens for any card placement done by the client
      
    });
    // listens for any message from the client inside game and lobby
    game.on("connection", (socket) => {

      socket.on("disconnect", (reason) => {
        console.log("Player has disconnected")
        removeUserfromRoom(socket);
      });

      // testing purposes
      socket.on("test", (test, room) => {
        console.log(test);
        game.to(room).emit("testping", "testping");
      });

      socket.on("leave", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#")
        removeUserfromRoom(socket);

        socket.leave(room);
        console.log(`Player has left the lobby ${room}`, rooms[room])
      })

      // for joining/creating room
      socket.on("createLobby", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#");
        addUsertoRoom(user, socket, room);
        
        // make the user the host of the lobby
        changeHost(room, socket.id, true);

        socket.join(room);
        game.to(room).emit("newPlayer", user);
        console.log(`A player has joined room ${room}`, rooms[room]);
        console.log(rooms);
      });

      // now it doesn't rejoin
      socket.on("checkJoined", (room) => {
        let status;
        const user = getUserFromFilterSocketID(socket.id, "/game#");
        if (user) {
          if (userToRoom[user._id] === room) {
            status = true;
            addUsertoRoom(user, socket, room);
            socket.join(room);

            game.to(room).emit("newPlayer", user);
            
            const page = rooms[room].pageStatus;
            game.to(socket.id).emit("statusChange", page, null);
          } else {
            status = false;
          };
        } else {
          status = false;
        }

        game.to(socket.id).emit("isJoined", status);
      });

      socket.on("getPlayers", (room) => {
        if (room) {
          const players = getListofPlayers(room);
          if (players) {
            let users = players.map(player => rooms[room][player].user);
            
            game.to(room).emit("listPlayers", users);
          } 
        }
      })

      socket.on("joinLobby", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#");
        if(rooms[room]) {
          // hardcoded maxPlayers to 8
          const numPlayers = getListofPlayers(room).length
          const status = rooms[room].pageStatus;
          if ((numPlayers < 8) && (status === "lobby")) {
            addUsertoRoom(user, socket, room);
            socket.join(room);

            game.to(room).emit("newPlayer", user);
            console.log(`A player has joined room ${room}`, rooms[room], user._id);
            // console.log(userToRoom[user._id])
          } else{
            game.to(socket.id).emit("isJoined", false);
          }
        } else {
          game.to(socket.id).emit("isJoined", false)
        };
      });

      socket.on("startGame", (room) => {
        if(checkIfAllReady(room)) {
          game.to(room).emit("statusChange", "game", null);
          // get rules
          const rules = logic.newRandomRules(2);
          rooms[room].rules = rules;
          // get first card to the stack
          const lastCard = logic.newCard();
          rooms[room].lastCard = lastCard;
          game.to(room).emit("actualLastCard", lastCard);
          // starts game
          rooms[room][socket.id].isTurn = true;
          rooms[room].pageStatus = "game";
          game.to(room).emit("nextUser", rooms[room][socket.id].user)
        };
      });

      socket.on("returnLobby", (room) => {
        game.to(socket.id).emit("statusChange", "lobby", null);
        changeReadyStatus(room, [socket.id], true);
      })

      socket.on("checkHost", (room) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#")
        if(rooms[room] && rooms[room][socket.id]) {
          if (rooms[room][socket.id].isHost) {
            game.to(socket.id).emit("newHost", true);
          }
        }
      })

      socket.on("updateNumCards", (room, numCards) => {
        game.to(room).emit("newNumCards", numCards);
      })

      // use for playing the game
      socket.on("move", (index, hand, deck) => {
        const user = getUserFromFilterSocketID(socket.id, "/game#")

        const room = userToRoom[user._id];

        const players = getListofPlayers(room);
        const rules = rooms[room].rules;
        const lastCard = rooms[room].lastCard;
        const checkifTurn = rooms[room][socket.id].isTurn;

        if (checkifTurn) {
          if (user) {
            console.log("Move received")
            const newState = logic.playerMove(index, hand, deck, lastCard, rules);
            const newHand = newState[0];
            const newDeck = newState[1];
            const winner = newState[2];
            const isViolation = newState[3];
            const violations = newState[4];
            const changeNumCards = newState[5];


            // Sets the next turn to the next player
            nextTurn(room, socket);
            game.to(room).emit("currentUser", user);

            if (winner) {
              const message = user.name;
              game.to(room).emit("statusChange", "winner", message);

              // reset lobby values
              changeReadyStatus(room, players, false);
              rooms[room].lastCard = null;
              rooms[room].rules = [];
              rooms[room].pageStatus = "lobby";
            } else {
              game.to(socket.id).emit("update", newHand, newDeck);
              // isViolation(whether there is a violation), violations(array of messages with the violations/empty if no violations), changeNumCards(the change of numCards; -1 if is correct)
              game.to(room).emit("violation", isViolation, violations, changeNumCards );
              // the card that is shown in the stack
              rooms[room].lastCard = hand[index]
              // the actual last card
              game.to(room).emit("actualLastCard", hand[index])
            }
          };
        } else {
          const newHand = logic.violation(hand);
          const newDeck = deck;
          game.to(socket.id).emit("update", newHand, newDeck);
          game.to(socket.id).emit("violation", true, ["Playing when is not your turn!"], 1 );
        };

        
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
