import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
// import "./index.css";
import App from "./App";
import store from "./store/ReduxStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular, brands } from "@fortawesome/fontawesome-svg-core/import.macro";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    {/* <div className="bg-info">
      <h2>CSCI2720 Project frontend</h2>
      <p>
        The below three links are initial versions of three pages. <br />
        They are to be merged inside the &lt;App /&gt; component later, not directly linked like below. <br />
        After that, this component will be removed.
      </p>
      <p>
        <a href="/auth">Auth Page</a>
        <br />
        <a href="/admin">Admin Page</a>
        <br />
        <a href="/user">User Page</a>
      </p>
      <h6>
        Below are some example implementations of <i>Font Awesome</i> Icons
      </h6>
      <FontAwesomeIcon icon={solid("triangle-exclamation")} className="p-2" fade />
      <FontAwesomeIcon icon={solid("spinner")} className="p-2" spinPulse />
      <FontAwesomeIcon icon={solid("location-dot")} className="p-2" bounce />
      <FontAwesomeIcon icon={regular("bell")} className="p-2" shake />
      <FontAwesomeIcon icon={solid("arrows-rotate")} className="p-2" spin />
    </div> */}
    <Provider store={store}>
    <App />
    </Provider>
  </>
); //! remove this line later
// root.render(<App />);  //! Leave only this line after merging pages into App component

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
