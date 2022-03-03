import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

const GOOGLE_CLIENT_ID = "195833754461-bljcrgumk568k57aav8r6pke7anbsedj.apps.googleusercontent.com";

import "../../utilities.css";
import "./Skeleton.css";
import "./Landing.css";
import img1 from "../../public/3_of_clubs.png";
import img2 from "../../public/A_of_spades.png";
import img3 from "../../public/J_of_diamonds.png";
import img4 from "../../public/K_of_hearts.png";

import img5 from "../../public/J_of_clubs.png";
import img6 from "../../public/A_of_hearts.png";
import img7 from "../../public/2_of_diamonds.png";
import img8 from "../../public/10_of_spades.png";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID

class Skeleton extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <div className="u-textCenter">

          <h1>Loki : The Game With No Rules</h1>
          <h2> May the best mind win!</h2>

          {this.props.userId ? (<div className="form-box box-shadow">
            <div className="skeleton-buttons">
              <Link to="/lobby"><button className="button5">  Play Now  </button></Link>
              <Link to="/rules"><button className="button5">How to Play</button></Link>
            </div>      
          </div>) : (
          
          <div class="falling-container">
            <div class="set">
              <div><img src={img1} /></div>
              <div><img src={img2} /></div>
              <div><img src={img3} /></div>
              <div><img src={img4} /></div>
              <div><img src={img1} /></div>
              <div><img src={img2} /></div>
              <div><img src={img3} /></div>
              <div><img src={img4} /></div>
            </div>
            <div class="set set2">
              <div><img src={img5} /></div>
              <div><img src={img6} /></div>
              <div><img src={img7} /></div>
              <div><img src={img8} /></div>
              <div><img src={img5} /></div>
              <div><img src={img6} /></div>
              <div><img src={img7} /></div>
              <div><img src={img8} /></div>
            </div>
            <div class="set set3">
              <div><img src={img1} /></div>
              <div><img src={img2} /></div>
              <div><img src={img3} /></div>
              <div><img src={img4} /></div>
              <div><img src={img1} /></div>
              <div><img src={img2} /></div>
              <div><img src={img3} /></div>
              <div><img src={img4} /></div>
            </div>
          </div>
          
          )}
          
          

        
          
        </div>
      </>
    );
  }
}

export default Skeleton;
