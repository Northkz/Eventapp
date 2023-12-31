import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular, brands } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Link } from "react-router-dom";
import { loginUser } from "./logic/AuthLogic.js";
import useAuthStore from "../../AuthStore";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const didComeFromRegister = state.didComeFromRegister || false;
  const didComeFromLogout = state.didComeFromLogout || false;
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setLoginSuccess(false); // Reset success state

    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      // check input
      const regExp = /\S+@\S+\.\S+/;
      // if (!email || !password || !regExp.test(email)) {  // email validation, but email might be changed in admin page so...
      if (!email || !password) {
        throw new Error("Please enter a valid email and password");
      }
      const emailRegex = /\S+@\S+\.\S+/;
      const data = await loginUser(email, password);
      // Check if the login was unsuccessful
      if (!data || data.error) {
        throw new Error(data.error || "Login failed");
      }

      useAuthStore.setState({ email: data.email, token: data.token });
      setLoginSuccess(true); // Set success state
      setTimeout(() => navigate("/user"), 1000); // Redirect after a delay
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center flex-fill" style={{ height: "calc(100vh - 60px)" }}>
      <div className="login-box">
        {/* show corresponding alert bar when the user comes from register or logout */}
        {didComeFromRegister ? (
          <div className="alert alert-primary alert-dismissible fade show fw-light position-sticky" role="alert" style={{ fontSize: "0.8rem" }}>
            <strong className="">The verification link has been sent.</strong>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        ) : null}
        {didComeFromLogout ? (
          <div className="alert alert-dark alert-dismissible fade show fw-light position-sticky" role="alert" style={{ fontSize: "0.8rem" }}>
            <strong className="">Log out Successful!</strong>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        ) : null}
        <h2>Login</h2>
        <p className="text-secondary error-msgbox">Please login to continue</p>
        <div style={{ height: "25px" }}></div>
        <form onSubmit={handleFormSubmit} action="/">
          <div className="form-group email-form-group d-flex align-items-center">
            <FontAwesomeIcon icon={solid("user")} className="mr-2 form-icon" />
            <input type="text" className="form-control" placeholder="email" />
          </div>
          <div className="form-group password-form-group password-form d-flex align-items-center mt-2">
            <FontAwesomeIcon icon={solid("lock")} className="mr-2 form-icon" />
            <input type="password" className="form-control" placeholder="Password" />
          </div>
          {/* space */}
          <div className={`validator-message-box ${error ? "validator-message-box-error" : ""}`}>{error}</div>
          {/* make the button takes up the full width */}{" "}
          {loginSuccess ? (
            <button className={`btn login-button w-100 ${loginSuccess ? "btn-success" : "btn-primary"}`}>
              <FontAwesomeIcon icon={solid("check")} className="mr-2 form-icon" />
            </button>
          ) : (
            <button className={`btn login-button w-100 ${loginSuccess ? "btn-success" : "btn-primary"}`} disabled={isLoading}>
              {isLoading ? (
                <div className="spinner-border text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          )}
        </form>
        <p className="text-center mt-3">
          Don't have an account?
          <div className="btn-special-effect">
            <Link to="/auth/register">Register</Link>
          </div>
        </p>
      </div>
    </div>
  );
};

export default Login;
