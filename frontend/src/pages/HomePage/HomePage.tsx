import React from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to EquityKing</h1>
      <p>Log in with your account to continue</p>
      <div>
        <Link to="/login">
          <button className="login-button">Log in</button>
        </Link>
        <Link to="/signup">
          <button className="login-button">Sign up</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
