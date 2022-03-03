import React, { Component } from "react";
import {get} from "../../utilities";
import "./Rules.css";
import "./EpicRules.css";
import "./Lobby.css";


class Rules extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div>
      <h1 class="glow-green" style={{textAlign:"center"}}>Rules</h1>
      <div className="rule-container">
        <h2> Objective</h2>
        <p> Your goal is to get rid of all your cards. When it is your turn, you can 
          place a card in the Card Pile. If your card doesn't violate the rule of the round, 
          the card is successfully discarded and you are one step closer to winning! However, 
if the card you placed violates the rule, you will get a new card from the deck. You don’t know 
which rule you are playing with, so your goal is to figure that out before your opponent so you can
finish your cards before them and win!. 
</p>    
      <p>Note: You are always able to abide by all the rules. In case your hand does not have any cards that fit the rule, you can place any card. 
</p>
      </div>

      <div className="rule-container">
        <h2> Types of Rules </h2>
        <h4> Card Value Rules: </h4>
        <p> Rules that are dependent on the value that the card has (A, 2, 3, etc.)
Example: place a card with the value higher than the last card placed on the pile. If you don’t have a higher card, you can just play any card.
</p>
        <h4> Card Suit Rules: </h4>
        <p> Rules that are dependent on the suit or color of the card. 
          Example: place a card with a different suit than the one on the pile. If you don't have a card with a different suit, place any card. 
        </p>

        <h4> Card Placement Rules: </h4>
        <p> Rules that are dependent on the position of the card on your hand. Example: place cards that are  on the right side of your hand. </p>



      </div>

      <div className="rule-container">
        Created by Brian, Leon and Karen. 
      </div>
    </div>
    );
  }
}

export default Rules;
