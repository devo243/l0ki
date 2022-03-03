import React, { Component } from "react";
import { socket, gamesocket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";
import Card from "./Card.js"
import { move } from "../../client-socket.js"
import "./Game.css";
import "./Cards.css";
import {DragDropContext, Droppable} from 'react-beautiful-dnd';



class DeckServer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cards: [],
        hand: [],
        winner: null,
        placedCard: "placeCard",
        lastCard: "placeCard",
        isTurn: false,
        violation: ["<- Place a card on the pile"],
        enemyCardNumber: new Array(7).fill(this.props.numCards),
        enemies: this.getEnemies(),

    }
    
  }

  componentDidMount = () => {
    socket.on("deck", (deck) => {
      this.setState({cards: deck.cards});
      console.log("this should only log once")
    });

    socket.on("hand", (hand) => {
      this.setState({hand: hand.cards});
    });

    socket.on("updateDeck", (deck) => {
      this.setState({cards: deck.cards})
    });

    socket.on("updateHand", (hand) => {
      this.setState({hand: hand.cards})
    });

    gamesocket.on("actualLastCard", (card) => {
      if (card !== null){
        this.setState({lastCard: card.suit+card.value})
      }
    });

    gamesocket.on("violation", (isViolation, violations, numCardsAdded) => {
      this.setState({violation: violations})
      /*console.log(isViolation) TESTING!
      console.log(violations)
      console.log(numCardsAdded)
      console.log("INTERESTING STUFF")
      console.log(this.props.players)
      console.log(this.props.playerTurn)
      console.log(this.props.userName)
      console.log("enemies", this.state.enemies)*/

      //THIS WILL UPDATE THE ENEMY CARDS!
      //if its your action, don't update
      if (this.props.playerTurn !== this.props.userName) {
          console.log(this.props.playerTurn);
          console.log(this.props.userName);
          let enemyIndex = this.state.enemies.indexOf(this.props.playerTurn);
          let tempEnemyCards = this.state.enemyCardNumber.slice();
        //if there was a violation, see the number of cards changed
        if (isViolation) {
          tempEnemyCards[enemyIndex] += (numCardsAdded - 1);

        //if no violation, decrease the number of cards by 1
        } else {
          tempEnemyCards[enemyIndex] -= 1;
        }
        this.setState({enemyCardNumber: tempEnemyCards})
      } 
      
    });

    /* Kill if broken */
    if (this.props.playerTurn === this.props.userName) {
      this.setState({isTurn: true});
    }
  }

  componentWillUnmount = () => {
    socket.removeAllListeners("deck");
    socket.removeAllListeners("hand");
    socket.removeAllListeners("updateDeck");
    socket.removeAllListeners("updateHand");
    gamesocket.removeAllListeners("actualLastCard");
    gamesocket.removeAllListeners("violation");
  }

  onDragEnd = result => {
    const { destination, source, draggableId} = result;

    if (!destination){
      return;
    }
    if (destination.droppableId== source.droppableId && destination.index == source.index) {
      return;
    }
    const movingCard = this.state.hand[source.index];
    if (destination.droppableId == "targetContainer"){
      this.setState({lastCard: movingCard.suit+movingCard.value});
      move(source.index, this.state.hand, this.state.cards, this.props.rule);
      
      this.state.hand.splice(source.index, 1);
      
      
      return;
    }
    
    const cardHandBox = "handContainer";
    const newHand =  Array.from(this.state.hand)
    newHand.splice(source.index, 1);
    newHand.splice(destination.index, 0, movingCard);

    this.setState({hand: newHand});
  };

  getEnemies = () => {
    //makes a copy of the players array
    let enemies = this.props.players.slice();
    enemies.splice(this.props.players.indexOf(this.props.userName), 1) //removes your username from the enemies array

    return enemies;

  }

  render() {


    
    return (

      <div >

        <DragDropContext onDragEnd={this.onDragEnd}
        >

        <div className="enemyBoxContainer-top">
          
          { this.state.enemies.length > 1 && <div className="enemyBox"> 
            <p className="enemyText"> {this.state.enemies[1]+""} </p>
            <div className="enemyCardsContainer">
            {[...Array(this.state.enemyCardNumber[1])].map((e, i) => <div className="enemyCard" key={i}></div>)}
            </div>
          </div>}
          { this.state.enemies.length > 0 && <div className="enemyBox"> 
            <p className="enemyText"> {this.state.enemies[0]+""} </p>
            <div className="enemyCardsContainer">
            {[...Array(this.state.enemyCardNumber[0])].map((e, i) => <div className="enemyCard" key={i}></div>)}
            </div>
          </div> }
          { this.state.enemies.length > 2 && <div className="enemyBox"> 
            <p className="enemyText">{this.state.enemies[2]+""} </p>
            <div className="enemyCardsContainer">
            {[...Array(this.state.enemyCardNumber[2])].map((e, i) => <div className="enemyCard" key={i}></div>)}
            </div>
          </div>}

        </div>
        
        <div className="u-textCenter">
              {this.props.playerTurn ? (<h3>{this.props.newTurn}'s Turn</h3>) : (<h3> Game has yet to start</h3>)}
              {console.log("ITS ME:", this.props.userName)}
          </div>

        <div className="gameTableAndEnemyContainter">

          <div className="enemyBoxContainer-sides">
            
            {this.state.enemies.length > 3 && <div className="enemyBox"> 
              <p className="enemyText"> {this.state.enemies[3]+""} </p>
              <div className="enemyCardsContainer">
              {[...Array(this.state.enemyCardNumber[3])].map((e, i) => <div className="enemyCard" key={i}></div>)}
              </div>
            </div>}
            {this.state.enemies.length > 5 && <div className="enemyBox"> 
              <p className="enemyText"> {this.state.enemies[5]+""} </p>
              <div className="enemyCardsContainer">
              {[...Array(this.state.enemyCardNumber[5])].map((e, i) => <div className="enemyCard" key={i}></div>)}
              </div>
            </div>}

          </div>

          

          <div className="gameTable">

            <Droppable droppableId={"targetContainer"} direction="horizontal">

            {(provided, snapshot) => (
              <div className = {(this.props.isDraggingOver ? "hoverPile" : "cardPile")} ref={provided.innerRef} {...provided.droppableProps} 
              isDraggingOver={snapshot.isDraggingOver}
              >

                <div className={"cardSetting " + this.state.lastCard}> </div>

              </div>
            )}
            </Droppable>

            <div style={{marginLeft: '20px'}}>
            {this.state.violation.map((violationName, index) => <p key={index}>{violationName}</p>)}
            
            </div>

          </div>

          <div className="enemyBoxContainer-sides">
            
          {this.state.enemies.length > 4 &&<div className="enemyBox"> 
              <p className="enemyText"> {this.state.enemies[4]+""} </p>
              <div className="enemyCardsContainer">
              {[...Array(this.state.enemyCardNumber[4])].map((e, i) => <div className="enemyCard" key={i}></div>)}
              </div>
            </div>}
            {this.state.enemies.length > 6 && <div className="enemyBox"> 
              <p className="enemyText"> {this.state.enemies[6]+""} </p>
              <div className="enemyCardsContainer">
              {[...Array(this.state.enemyCardNumber[6])].map((e, i) => <div className="enemyCard" key={i}></div>)}
              </div>
            </div>}

          </div>
        </div>

        <br/>
        <br/>

        <Droppable droppableId={"handContainer"} direction="horizontal">
          {(provided) => (

            <div className = "handContainer" ref={provided.innerRef} {...provided.droppableProps}>
              {this.state.hand.map((card, index) => (<Card value={card.value} index={index} key={card._id} suit={card.suit} _id={card._id} playerMove={() => move(index, this.state.hand, this.state.cards)}/>))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <br/>
        <br/>
        
        
        </DragDropContext>
      </div>
    );
  }
}

export default DeckServer;