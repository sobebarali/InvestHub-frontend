import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = (event: any) => {
    event.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    fetch("https://agreeable-crown-tick.cyclic.app/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      console.log(res);
      if (res.status === 200) {
        window.alert("Login successful");
        navigate("/");
      } else {
        window.alert("Login failed");
      }
    });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={"Email"}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={"Password"}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="login-or">
        <hr className="hr-or" />
        <span className="span-or">or</span>
      </div>
      <div className="login-google">
        <a href="https://agreeable-crown-tick.cyclic.app/api/auth/google">
          <img
            src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png"
            alt="google login"
          />
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
