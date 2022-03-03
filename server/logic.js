const uuidv4 = require("uuid/v4");
const SUITS = ["spades", "diamonds", "clubs", "hearts"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const equalsCard = (firstCard, secondCard) => {
  if (firstCard.value === secondCard.value && firstCard.suit === secondCard.suit) {
    return true;
  };
  return false;
}

const getValue = (card) => {
  let value = VALUES.indexOf(card.value) + 1;
  return value;
}

const newRandomRules = (numRules) => {
  let randomList = [0, 1, 2];
  let randomRules = [];
  const rand1 = Math.floor(Math.random()*4);
  const rand2 = Math.floor(Math.random()*4);
  const rand3 = Math.floor(Math.random()*3);

  for (let i = 0; i < numRules; i++) {
    const rand = Math.floor(Math.random()*3)
    const realRand = randomList.splice(rand, 1);
    if (realRand[0] === 0) {
      randomRules.push([realRand[0], rand1]);
    } else if (realRand[0] === 1) {
      randomRules.push([realRand[0], rand2]);
    } else if (realRand[0] === 2) {
      randomRules.push([realRand[0], rand3])
    }
  }
  
  return randomRules;
}

const get_color = (cur_card) => {
    return cur_card.suit==="spades" || cur_card.suit==="clubs" ? "black" : "red";
};


/* framework for implementing more rules */
/* first reds then blacks */
const rule1 = (index, cur_hand, lastCard) => {
  let copy_hand = cur_hand.slice()
  let cur_card = copy_hand[index];
  let color = get_color(cur_card);

  copy_hand.splice(index, 1);

  if (color === "black") {
    //there better be no reds in the deck
    for(let i = 0; i < copy_hand.length; i++) {
      let check = copy_hand[i]

      if (get_color(check) === "red") {
        return [false, "Rule 1 violation"];
      }
    }
  };

  return [true, ""];
}

/* can only play the highest card */
const rule2 = (index, cur_hand, lastCard) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];
  let card_value = cur_card.value;
  copy_hand.splice(index, 1);


  for(let i = 0; i< copy_hand.length; i++) {
    let check = copy_hand[i].value;
    if (VALUES.indexOf(check) > VALUES.indexOf(card_value)) {
      return [false, "Rule 2 violation"];
    }
  }
  return [true, ""]
};

/* can only play cards in the first half of your hand */
const rule3 = (index, cur_hand, lastCard) => {
  let copy_hand = cur_hand.slice();
  
  if (index < Math.floor(copy_hand.length / 2) ) {
    return [false, "Rule 3 violation"];
  };
  return [true, ""];
};

/* only play cards with the same suit as the last card */
const rule4 = (index, cur_hand, last_card) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];

  copy_hand.splice(index, 1);
  
  if (cur_card.suit === last_card.suit) {
    return [true, ""];
  } else {
    for (let i = 0; i < copy_hand.length; i++) {
      const card = copy_hand[i];
      if (card.suit === last_card.suit) {
        return [false, "Rule 4 violation"];
      }
    }
    return [true, ""];
  }
};

/* only place cards with the same parity as the last card*/
const rule5 = (index, cur_hand, last_card) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];

  copy_hand.splice(index, 1);

  if (getValue(cur_card) % 2 === getValue(last_card) % 2) {
    return [true, ""];
  } else {
    for (let i = 0; i<copy_hand.length; i++) {
      const card = copy_hand[i];
      if (getValue(card) % 2 === getValue(last_card) % 2) {
        return [false, "Rule 5 violation"];
      }
    };
    return [true, ""]
  }
};

/* if the last card was red place black and vice versa (if you have it)*/
const rule6 = (index, cur_hand, last_card) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];

  copy_hand.splice(index, 1);
  let correct_color = get_color(last_card)
  if (get_color(cur_card) !== correct_color) {
    //if wrong color, checks if you could have played the right color
    for (let i = 0; i < copy_hand.length; i++) {
      const tempCard = copy_hand[i];
      if (get_color(tempCard) === correct_color) {
        return [false, "Rule 6 violation"];
      }
    };
  }
  return [true, ""]
};

/* all letter cards must be played first*/
const rule7 = (index, cur_hand, last_card) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];

  copy_hand.splice(index, 1);
  let correct_values = [1, 11, 12, 13];

  if (correct_values.includes(getValue(cur_card))) {
    //if right value, return true
    return [true, ""]

  } else {
    //if you didnt place a letter card but you had one return false
    for (let i = 0; i < copy_hand.length; i++) {

      const tempCard = copy_hand[i];
      if (correct_values.includes(getValue(tempCard))) {
        return [false, "Rule 7 violation"];
      }
    };
  }
  return  [true, ""]
};

/* only cards at even indexes are accepted*/
const rule8 = (index, cur_hand, last_card) => {
  
  if (index % 2 === 0) {
    return  [true, ""];
  } else {
    return [false, "Rule 8 violation"];
  }
  
};

/* only cards on the center third of the hand are accepted (inclusive)*/
const rule9 = (index, cur_hand, last_card) => {
  let copy_hand = cur_hand.slice();

  let thirdValue = copy_hand.length / 3.0;
  
  if ( index > Math.floor(thirdValue) && index < Math.ceil(2*thirdValue) + 1 ) {
    return [true, ""];
  } else {
    return [false, "Rule 9 violation"];
  }
};

/* follow the alphabetical order of highest suits: (first) clubs, diamonds, hearts, spades (last) */
const rule10 = (index, cur_hand, last_card) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];

  copy_hand.splice(index, 1);
  let suit_order = ["clubs", "diamonds", "hearts", "spades"];
  let suit_index = suit_order.indexOf(cur_card.suit);
  let lower_suits = suit_order.slice(0, suit_index);

    //checks to see if you have any cards that should have gone first 
    for (let i = 0; i < copy_hand.length; i++) {

      const tempCardSuit = copy_hand[i].suit;
      if (lower_suits.includes(tempCardSuit)) {
        return [false, "Rule 10 violation"];
      }
    };
  
  return  [true, ""]
};

/* if you have a card lower than the last placed, you have to place it */
const rule11 = (index, cur_hand, last_card) => {
  let copy_hand = cur_hand.slice();
  let cur_card = copy_hand[index];

  copy_hand.splice(index, 1);
  let lastCardValue = getValue(last_card);
  
  //if the value you placed isn't lower than the last card
  if (getValue(cur_card) >= lastCardValue){}

    //checks to see if you had any cards that were lower. If yes, return false. otherwise, return true
    for (let i = 0; i < copy_hand.length; i++) {

      const tempCard = copy_hand[i];
      if (getValue(tempCard) < lastCardValue) {
        return [false, "Rule 11 violation"];
      }
    };
  
  return  [true, ""]
};

const rules = [rule1, rule2, rule3, rule4, rule9];

//RULES CATEGORIES
const rulesNumbers = [rule2, rule5, rule7, rule11];
const rulesSuits = [rule1, rule4, rule6, rule10];
const rulesPlacement = [rule3, rule8, rule9];

const validMove = (index, cur_hand, lastCard, rulesList) => { //add rule_index here
  console.log("Checks move");

  let isViolation = false;
  let violations = [];
  let changeNumCards = 0;
  console.log(rulesList);


  for(let i = 0; i < rulesList.length; i++) {
    if (rulesList[i][0] === 0) {
      const result = rulesNumbers[rulesList[i][1]](index, cur_hand, lastCard);

      if (!result[0]) {
        isViolation = true;
        violations.push(result[1]);
        changeNumCards += 1;
      };
    } else if ( rulesList[i][0] === 1) {
      const result = rulesSuits[rulesList[i][1]](index, cur_hand, lastCard);

      if (!result[0]) {
        isViolation = true;
        violations.push(result[1]);
        changeNumCards += 1;
      };
    } else if ( rulesList[i][0] === 2) {
      const result = rulesPlacement[rulesList[i][1]](index, cur_hand, lastCard);

      if (!result[0]) {
        isViolation = true;
        violations.push(result[1]);
        changeNumCards += 1;
      };
    }
  };

  return [isViolation, violations, changeNumCards];

};

/* */


const newCard = () => {
    const id = uuidv4();
    const random = Math.floor(Math.random()*52);
    const suit = random % 4;
    const value = random % 13;
    const card = {
      suit: SUITS[suit],
      value: VALUES[value],
      _id: id, 
    };
    return card;
  }

const checkWin = (hand) => {
    if (hand.length === 0) {
        return true
        };
    return false
};

const playerMove = (index, hand, deck, lastCard, rules) => {
    let newHand = hand.slice();
    let newDeck = deck.slice();

    let moveResults = validMove(index, newHand, lastCard, rules);
    let isViolation = moveResults[0];
    let violations = moveResults[1];
    let changeNumCards = moveResults[2];

    if (!isViolation) {
        let removedCard = newHand.splice(index, 1);
        newDeck = newDeck.concat(removedCard);
        changeNumCards = -1;
        violations = ["No violations"]
    } else {
      let removedCard = newHand.splice(index, 1);
      newDeck = newDeck.concat(removedCard);
      newHand = violation(newHand, changeNumCards);
    };

    const winner =  checkWin(newHand);


    return([newHand, newDeck, winner, isViolation, violations, changeNumCards]);

};

const violation = (hand, numCards) => {
  console.log("A rule has been violated!");
  let newHand = hand.slice();
  for (let i=0; i< numCards; i++) {
    const violationCard = newCard();
    newHand = newHand.concat(violationCard);
  }
  return newHand;
}


module.exports = {
    playerMove,
    violation,
    newRandomRules,
    newCard,
};