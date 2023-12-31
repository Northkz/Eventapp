import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../AuthStore.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular, brands } from "@fortawesome/fontawesome-svg-core/import.macro";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import "./Programmes.css";
import "../../App.css";
import "../auth/Auth.css";
import VenuesInMap from "./VenuesInMap.jsx";

const Programmes = () => {
  const { token } = useAuthStore();
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("venues");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(150);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [sort, setSort] = useState("price-asc");
  const [sortVenues, setSortVenues] = useState("name-asc");
  const [searchTerm, setSearchTerm] = useState(""); // Add this line
  const [refreshing, setRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState("");

  useEffect(() => {
    if (token) fetchVenuesAndEvents();
  }, [token]);

  async function fetchVenuesAndEvents() {
    try {
      const venuesResponse = await fetch(`${apiUrl}/api/venue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventsResponse = await fetch(`${apiUrl}/api/event`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!venuesResponse.ok || !eventsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const venuesData = await venuesResponse.json();
      const eventsData = await eventsResponse.json();

      setVenues(venuesData.venues);
      setEvents(eventsData.events);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  }

  const refreshData = async () => {
    try {
      // show loading spinner replacing the table
      setRefreshing(true);
      const response = await fetch(`${apiUrl}/api/venue/updateVenues`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh data");
      }

      // get version_date_start and version_date_end
      const data = await response.json();
      const { version_date_start, version_date_end } = data;

      await fetchVenuesAndEvents(); // Call it inside refreshData
      setRefreshing(false);
      setRefreshResult(
        "Data refreshed successfully: " +
          version_date_start.slice(0, 4) +
          "-" +
          version_date_start.slice(4, 6) +
          "-" +
          version_date_start.slice(6, 8) +
          " to " +
          version_date_end.slice(0, 4) +
          "-" +
          version_date_end.slice(4, 6) +
          "-" +
          version_date_end.slice(6, 8)
      );
      console.log("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error.message);
      setRefreshing(false);
      setRefreshResult("Failed to refresh data");
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderVenues = () => {
    let sortedVenues = [...venues]; // Create a new copy of the array
    switch (sortVenues) {
      case "name-asc":
        sortedVenues.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedVenues.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "events-asc":
        sortedVenues.sort((a, b) => a.eventsList.length - b.eventsList.length);
        break;
      case "events-desc":
        sortedVenues.sort((a, b) => b.eventsList.length - a.eventsList.length);
        break;
      default:
        break;
    }
    let filteredVenues = sortedVenues.filter((venue) => venue.name.toLowerCase().includes(searchTerm.toLowerCase())); // Add this line

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVenues.slice(indexOfFirstItem, indexOfLastItem); // Use filteredVenues instead of venues

    /* show name, latitude, longitude, and id */
    return (
      <div className="table-responsive">
        {activeTab === "venues" && (
          <div className="filter-sort-container">
            <div className="sort-container">
              <div>
                <strong>Sort by</strong>
              </div>
              <select value={sortVenues} onChange={(e) => handleSortVenues(e.target.value)}>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="events-asc">Number of Events (Low to High)</option>
                <option value="events-desc">Number of Events (High to Low)</option>
              </select>
            </div>
            <div className="sort-container">
              <div>
                <strong>Search</strong>
              </div>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
            </div>{" "}
            <div className="ms-auto">
              <RefreshButtonComponent refreshData={refreshData} />
            </div>
          </div>
        )}
        {refreshResult && <div className="refresh-result fw-bold form-text">{refreshResult}</div>}
        <p>Total {venues.length} results</p>
        <button className="btn btn-secondary me-1" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          className="btn btn-secondary me-1"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(venues.length / itemsPerPage)}
        >
          Next
        </button>

        {/* show current page and total pages */}
        <span>
          {" "}
          Page {currentPage} of {Math.ceil(venues.length / itemsPerPage)}{" "}
        </span>
        <div class="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Venue Name</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Number of Events</th>
                <th>View</th>
              </tr>
            </thead>
            {!refreshing ? (
              <tbody>
                {currentItems.map((venue) => (
                  <tr key={venue.id}>
                    <td>{venue.name}</td>
                    <td>{venue.latitude}</td>
                    <td>{venue.longitude}</td>
                    <td>{venue.eventsList.length}</td>
                    <td>
                      <Link to={`/venue/${venue.id}`}>
                        View <FontAwesomeIcon icon={solid("arrow-right")} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              // loading spinner
              <tbody>
                <tr>
                  <td colSpan="5">
                    <div className=" d-flex justify-content-center align-items-center p-5">
                      {/* <div className="spinner-border text-dark" role="status" /> */}
                      {/* refreshing ... */}
                      <span style={{ marginLeft: "10px" }}>Refreshing...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        <button className="btn btn-secondary me-1" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          className="btn btn-secondary me-1"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(venues.length / itemsPerPage)}
        >
          Next
        </button>
        {/* show current page and total pages */}
        <span>
          {" "}
          Page {currentPage} of {Math.ceil(venues.length / itemsPerPage)}{" "}
        </span>
      </div>
    );
  };
  const renderEvents = () => {
    let filteredEvents = events.filter((event) => {
      const price = parseFloat(event.price);
      return price >= minPrice && price <= maxPrice;
    });

    let sortedEvents = [...filteredEvents]; // Create a new copy of the array

    switch (sort) {
      case "price-asc":
        sortedEvents.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        sortedEvents.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "alpha-asc":
        sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "alpha-desc":
        sortedEvents.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedEvents.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div className="table-responsive">
        {activeTab === "events" && (
          <div className="filter-sort-container">
            <div className="filter-container">
              <div>
                <strong>Filter by price</strong>
              </div>
              <div className="price-slider">
                <Slider className="custom-slider" range min={0} max={2000} value={[minPrice, maxPrice]} onChange={handleFilterChange} />
                <span>
                  ${minPrice} - ${maxPrice}
                </span>
              </div>
            </div>
            <div className="sort-container">
              <div>
                <strong>Sort by</strong>
              </div>
              <select value={sort} onChange={(e) => handleSort(e.target.value)}>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="alpha-asc">Alphabetical (A-Z)</option>
                <option value="alpha-desc">Alphabetical (Z-A)</option>
              </select>
            </div>
            <div className="ms-auto">
              <RefreshButtonComponent refreshData={refreshData} />
            </div>{" "}
          </div>
        )}
        {refreshResult && <div className="refresh-result fw-bold form-text">{refreshResult}</div>}
        {/* show total number of results */}
        <p>Total {filteredEvents.length} results</p>
        <button className="btn btn-secondary me-1" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          className="btn btn-secondary me-1"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredEvents.length / itemsPerPage)}
        >
          Next
        </button>
        {/* show current page and total pages */}
        <span>
          {" "}
          Page {currentPage} of {Math.ceil(filteredEvents.length / itemsPerPage)}{" "}
        </span>
        <div class="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Price</th>
                <th>Presenter</th>
              </tr>
            </thead>
            {!refreshing ? (
              <tbody>
                {currentItems.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.description}</td>
                    <td>{event.date}</td>
                    <td>{event.price}</td>
                    <td>{event.presenter}</td>
                    {/* <td>
                    <Link to={`/event/${event.id}`}>
                      View <FontAwesomeIcon icon={solid("arrow-right")} />
                    </Link>
                  </td> */}
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="5">
                    <div className=" d-flex justify-content-center align-items-center p-5">
                      {/* <div className="spinner-border text-dark" role="status" /> */}
                      {/* refreshing ... */}
                      <span style={{ marginLeft: "10px" }}>Refreshing...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        <button className="btn btn-secondary me-1" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          className="btn btn-secondary me-1"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredEvents.length / itemsPerPage)}
        >
          Next
        </button>
        {/* show current page and total pages */}
        <span>
          {" "}
          Page {currentPage} of {Math.ceil(filteredEvents.length / itemsPerPage)}{" "}
        </span>
      </div>
    );
  };

  const handleSort = (value) => {
    setSort(value);
    setCurrentPage(1);
  };
  const handleSortVenues = (value) => {
    setSortVenues(value);
    setCurrentPage(1);
  };
  const handleFilterChange = (value) => {
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
    setCurrentPage(1); // Reset page number when filtering changes
  };
  if (!token) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-body" style={{ height: "calc(100vh - 60px)" }}>
        <div className="login-box">
          <h4>Oops! You are not logged in.</h4>
          <div style={{ height: "25px" }}></div>
          <Link to="/auth">
            <button className="btn btn-primary">Login</button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="programmes-page">
      <h4 className="page-title">Programmes</h4>
      <VenuesInMap token={token} />
      <div className="tab-buttons">
        <button
          className={activeTab === "venues" ? "tab-button active" : "tab-button"}
          onClick={() => {
            setActiveTab("venues");
            setCurrentPage(1);
          }}
        >
          View by Venues
        </button>
        <button
          className={activeTab === "events" ? "tab-button active" : "tab-button"}
          onClick={() => {
            setActiveTab("events");
            setCurrentPage(1);
          }}
        >
          View Whole Event List
        </button>
      </div>

      {/* show number of results */}

      <div className="table-viewer">{activeTab === "venues" ? renderVenues() : renderEvents()}</div>
      {/* Pagination and filtering components  */}
    </div>
  );

  function RefreshButtonComponent({ refreshData }) {
    return (
      <button onClick={refreshData} className="btn btn-secondary" style={{ width: "150px" }}>
        {refreshing ? (
          <div className="spinner-border spinner-border-sm text-light fs-6 fw-lighter" role="status">
            <span className="visually-hidden">Refreshing...</span>
          </div>
        ) : (
          // <FontAwesomeIcon icon={solid("sync-alt")} />  refresh icon and text
          <div>
            <FontAwesomeIcon icon={solid("sync-alt")} /> Refresh
          </div>
        )}
      </button>
    );
  }
};

const LoadingComponent = () => {
  return (
    <div className="d-flex justify-content-center align-items-center bg-body" style={{ height: "calc(100vh - 60px)" }}>
      <div className="login-box">
        <h4>Loading...</h4>
        <div style={{ height: "25px" }}></div>
        {/* font awesome spinner */}
        <div className=" d-flex justify-content-center align-items-center">
          <div className="spinner-border text-dark" role="status" />
        </div>
      </div>
    </div>
  );
};

export default Programmes;
