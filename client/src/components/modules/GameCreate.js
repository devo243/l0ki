import React, { Component } from "react";
import { gamesocket } from "../../client-socket.js";
import DeckServer from "./DeckServer.js";
import { post } from "./../../utilities.js";

const uuidv4 = require("uuid/v4");

const SUITS = ["spades", "diamonds", "clubs", "hearts"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CARD_IN_HAND = 5;
const NUM_DECKS = 1;

class GameCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cards: [],
        hand: [],
        winner: false,
        lastCard: undefined,
        playerTurn: undefined,
        numCardsPerPlayer: this.getNumCardsofPlayers(this.props.players, this.props.numCards),
        lastPlayerTurn: undefined,
    }
  }

  getNumCardsofPlayers = (players, numCards) => {
    let numCardstoPlayer = {};
    for (let i = 0; i< players.length; i++) {
      numCardstoPlayer[players] = numCards;
    };

    return numCardstoPlayer;
  }

  componentDidMount = () => {
    // const newDeck = this.multipleDeck(NUM_DECKS);
    const newDeck = []
    // this.shuffleDeck(newDeck);
    const newHand = this.newRandomHand();
    // this is now just the discard pile

    post("/api/deck", {cards: newDeck, gameId: this.props.gameId, action: "create"}); //change

    post("/api/hand", {cards: newHand, gameId: this.props.gameId, action: "create"}); //change

    gamesocket.on("rules", (rules) => this.setState({ rule: rules}));
    gamesocket.on("newLastCard", (lastCard) => this.setState({ lastCard: lastCard }));

    gamesocket.on("update", async (newHand, newDeck) => {
      await Promise.all([
      post("/api/deck", {cards: newDeck, gameId: this.props.gameId, action: "update"}),
      post("/api/hand", {cards: newHand, gameId: this.props.gameId, action: "update"}),
      ]);
    });

    gamesocket.on("nextUser", (user) => {
      console.log(`Is ${user._id} turn to play!`)
      this.setState({playerTurn: user.name});

    })

    gamesocket.on("currentUser", (user) => {
      console.log(user.name);
      this.setState({lastPlayerTurn: user.name});
    })

  }
  componentWillUnmount = () => {
    gamesocket.removeAllListeners("update");
    gamesocket.removeAllListeners("rules");
    gamesocket.removeAllListeners("newLastCard");
    gamesocket.removeAllListeners("nextUser");
    gamesocket.removeAllListeners("currentUser");
    post("/api/deck", {action: "delete"});
    post("/api/hand", {action: "delete"});
  }
  newRandomHand = () => {
    let hand = [];
    for (let i=0; i < this.props.numCards; i++) {
      let newCard = this.newCard();
      hand.push(newCard);
    }
    return hand;
  }

  newHand = (deck) => {
    let cur_hand = deck.splice(0,CARD_IN_HAND);
    return cur_hand
  } 
  // old way to get cards (may be useful later)
  // newDeck = () => {
  //   let cur_deck = [];
  //   let tmp_id = 0;
  //   for (let i = 0; i < SUITS.length; i++) {
  //       for (let j = 0; j< VALUES.length; j++) {
  //           let cur_card = {
  //               _id: tmp_id,
  //               suit: SUITS[i],
  //               value: VALUES[j]
  //           }
  //           tmp_id += 1;
  //           cur_deck.push(cur_card);
  //       }
  //   }
  //   return cur_deck;
  // }

  // multipleDeck = (numDecks) => {
  //   let cur_deck = [];
  //   for (let i = 0; i < numDecks; i++) {
  //     const deck = this.newDeck();
  //     cur_deck = cur_deck.concat(deck);
      
  //   };

  //   return cur_deck;
  // }

  // shuffleDeck = (deck) => {
  //   for (let i = deck.length - 1; i > 0; i--) {
  //       let j = Math.floor(Math.random() * (i+1));
  //       [deck[i], deck[j]] = [deck[j], deck[i]];
  //   }
  // }

  newCard = () => {
    const id = uuidv4();
    const suit = Math.floor(Math.random()*(4));
    const value = Math.floor(Math.random()*(13));
    const card = {
      suit: SUITS[suit],
      value: VALUES[value],
      _id: id, 
    };
    return card;
  }


  render() {
    return (

      <div>
          {this.props.userId && (<DeckServer winner={this.state.winner} 
          playerTurn={this.state.lastPlayerTurn}  lastCard={this.state.lastCard} userName={this.props.userName}
          players={this.props.players} numCards={this.props.numCards} newTurn={this.state.playerTurn}/>)}
      </div>
    );
  }
}

export default GameCreate;