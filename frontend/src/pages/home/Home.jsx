import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../../App.css";
import "./Home.css";

function Home() {
  return (
    <>
    
      <div
        className="align-self-center align-content-center justify-content-center d-flex flex-column background-gradient"
        style={{ height: "100vh" }}
      >
        <div className="">
          <section style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="py-5">
              <div className="col align-items-center justify-content-center d-flex flex-column">
                <div className="">
                  <h2 className="text-white font-weight-bold">Discover cultural programmes in Hong Kong</h2>
                  <p className="text-white">Browse through a variety of cultural programmes and immerse yourself in the beauty of diversity.</p>
                </div>
                <div className="">
                  <Link to="/programmes">
                    <button className="btn explore-button btn-auth-small">Explore Now!</button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
