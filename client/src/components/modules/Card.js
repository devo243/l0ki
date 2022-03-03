import React, { Component } from "react";
import "./Cards.css";
import {Draggable} from 'react-beautiful-dnd';


class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(this.props._id);
    return (
      
      <Draggable draggableId={this.props._id} index={this.props.index}>
        
        {(provided) => (

         <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={"cardSetting " + this.props.suit + this.props.value + " sexyCard"} 
            onClick={this.props.playerMove}
          />
        )}
      </Draggable>
    );
  }
}

export default Card;