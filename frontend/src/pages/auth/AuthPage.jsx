import { Routes, Route, useMatch, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./Auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular, brands } from "@fortawesome/fontawesome-svg-core/import.macro";
import { logOut } from "./logic/AuthLogic.js";
import useAuthStore from "../../AuthStore";

const Auth = () => {
  const match = useMatch("/auth/*"); // Note the pattern

  return (
    <div className="bg">
      <Routes>
        <Route path="/" element={<AuthMain />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {match ? <Route path="*" element={<h1>Not Found in login</h1>} /> : null}
      </Routes>
    </div>
  );
};

const AuthMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenExists, setIsTokenExists] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthStore();

  async function checkTokenExists() {
    /* simulate loading */
    const _delayTimeMilliseconds = 500;
    /* check token value from zustand store with a delay */
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, _delayTimeMilliseconds);
    });
  }

  useEffect(() => {
    checkTokenExists().then((result) => {
      setIsTokenExists(result);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingComponent />;
  } else {
    if (isTokenExists) {
      return <AlreadyLoggedInComponent navigate={navigate} />;
    } else {
      return <Login />;
    }
  }
};

const LoadingComponent = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 60px)" }}>
      <div className="login-box">
        <h4>Checking Token...</h4>
        <div style={{ height: "25px" }}></div>
        {/* font awesome spinner */}
        <div className="container d-flex justify-content-center align-items-center">
          <div className="spinner-border text-dark" role="status" />
        </div>
      </div>
    </div>
  );
};

const AlreadyLoggedInComponent = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout(); // This will update the Zustand store and clear local storage
    navigate("/auth/login"); // Redirect to login page after logout
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 60px)" }}>
      <div className="login-box">
        <h2>Auth</h2>
        <p className="text-secondary">You are already logged in.</p>
        <div style={{ height: "25px" }}></div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-dark" onClick={() => navigate("/")}>
            Go to main page
          </button>
          <button className="btn btn-link text-decoration-underline" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
