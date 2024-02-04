import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Link } from "react-router-dom";
import "./Auth.css";
import { registerUser } from "./logic/AuthLogic.js";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validatorMessage, setValidatorMessage] = useState("");
  const [isValidatorError, setIsValidatorError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonCheck, setButtonCheck] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let errorMessages = [];
    setIsValidatorError(true);
    document.querySelectorAll(".input-error").forEach((element) => {
      element.classList.remove("input-error");
    });
    // regex for email
    const emailRegex = /\S+@\S+\.\S+/;
    // check if email is valid
    if (!emailRegex.test(email)) {
      errorMessages.push("* Email is invalid.");
      document.querySelector(".email-input").parentElement.classList.add("input-error");
    }
    if (password.length < 8) {
      errorMessages.push("* Password must be at least 8 characters long.");
      document.querySelector(".password-input").parentElement.classList.add("input-error");
    }
    if (password !== confirmPassword && (password.length > 0 || confirmPassword.length > 0)) {
      errorMessages.push("* Password must match.");
      document.querySelector(".password-confirm-input").parentElement.classList.add("input-error");
    }

    // display error messages & submit
    if (errorMessages.length > 0) {
      setValidatorMessage(errorMessages.map((error, i) => <div key={i}>{error}</div>));
    } else {
      /* NOTE validation passed */

      // reset validation state
      setIsValidatorError(false); // Set validation state to success
      setValidatorMessage(""); // Clear validation message

      // first disable the button & change to loading state
      setIsLoading(true);

      /* SECTION submit logic */
      registerUser(email, password)
        .then((result) => {
          // reset the button

          setIsValidatorError(false);
          // show success component
          setButtonCheck(true);
          setTimeout(() => {
            // use react router to redirect
            navigate("/auth/login", { state: { didComeFromRegister: true } });
          }, 1000);
        })
        .catch((error) => {
          // reset the button
          setIsLoading(false);
          setValidatorMessage(error.message);
          setIsValidatorError(true);
        });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 60px)" }}>
      <div className="login-box">
        {" "}
        {/* Using the same class for similar styling */}
        <h2>Register</h2>
        <p className="text-secondary">Create your account</p>
        <div style={{ height: "25px" }}></div>
        <form onSubmit={handleFormSubmit} action="/">
          <div className="form-group d-flex align-items-center">
            <FontAwesomeIcon icon={solid("user")} className="mr-2 form-icon" />
            <input
              type="text"
              className="form-control email-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {/* <div className="form-group d-flex align-items-center mt-2">
            <FontAwesomeIcon icon={solid("envelope")} className="mr-2" />
            <input type="email" className="form-control email-input" placeholder="Email" />
          </div> */}
          <div className="form-group d-flex align-items-center mt-2">
            <FontAwesomeIcon icon={solid("lock")} className="mr-2 form-icon" />
            <input
              type="password"
              className="form-control password-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group d-flex align-items-center mt-2">
            {password === confirmPassword && password.length > 0 ? (
              <FontAwesomeIcon icon={solid("check")} className="mr-2 form-icon" />
            ) : (
              <FontAwesomeIcon icon={solid("not-equal")} className="mr-2 form-icon" />
            )}
            <input
              type="password"
              className="form-control password-confirm-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className={`validator-message-box ${isValidatorError ? "validator-message-box-error" : ""}`}>{validatorMessage}</div>
          {buttonCheck ? (
            <button className={`btn login-button w-100 ${buttonCheck ? "btn-success" : "btn-primary"}`}>
              <FontAwesomeIcon icon={solid("check")} className="mr-2 form-icon" />
            </button>
          ) : (
            <button className={`btn login-button w-100 ${buttonCheck ? "btn-success" : "btn-primary"}`} disabled={isLoading}>
              {isLoading ? (
                <div className="spinner-border text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Register"
              )}
            </button>
          )}
        </form>
        <p className="text-center mt-3">
          Already have an account?
          <div className="btn-special-effect">
            <Link to="/auth/login">Login</Link>
          </div>
        </p>
      </div>
    </div>
  );
};

export default Register;
