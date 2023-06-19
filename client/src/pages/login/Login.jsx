import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  const handleRegister = () => {
    navigate("/register")
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <input type="hidden" id="hiddenInput" />
          <form className="loginBox" onSubmit={handleClick}>
            <div className="inputContainer">
            
              <input
                id="email"
                type="email"
                required
                className="loginInput"
                ref={email}
              />
              <label htmlFor="email" id="emailLabel">Email</label>
            </div>
            
            <div className="inputContainer">
              <input
                id="password"
                type="password"
                required
                minLength="6"
                className="loginInput"
                ref={password}
              />
              <label htmlFor="password" id="passwordLabel">Password</label>
            </div>
            
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button onClick={handleRegister} className="loginRegisterButton">
              {isFetching ? (
                <CircularProgress />
              ) : (
                "Create a New Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
