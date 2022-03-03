import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";
const GOOGLE_CLIENT_ID = "195833754461-drg9a2g9abde0mlscautfq8dp01fsset.apps.googleusercontent.com";


import "./NavBar.css";

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="NavBar-container">
          <Link to="/" className="Nav-link"> Home Page </Link>
          <Link to='/rules' className="Nav-link"> Rules </Link>

          {/* {this.props.userId && (
            <Link to="/gameserver" className="Nav-link">Game</Link>
          )} */}
          
          {this.props.userId && (
            <Link to='/lobby' className="Nav-link"> Lobby </Link>
          )}
          
          {this.props.userId ? (
            <Link to="/">
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="go-right"
            />
            </Link>
          ) : (
            
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="go-right"
            />
            
          )}
        </div>
      </>
    );
  }
}

export default NavBar;
