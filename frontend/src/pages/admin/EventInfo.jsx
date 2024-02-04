import React, { useState, useEffect } from "react";
import useAuthStore from "../../AuthStore";
import "./EventInfo.css";

const apiUrl = process.env.REACT_APP_API_URL;

const EventInfo = () => {
  const { email, token } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    venue_id: "",
    date: "",
    description: "",
    presenter: "",
    price: "",
  });
  const [editedEvent, setEditedEvent] = useState({
    title: "",
    venue_id: "",
    date: "",
    description: "",
    presenter: "",
    price: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  // GET
  const fetchEvents = async () => {
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/event`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch event information");
      }
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error("Error fetching event information:", error);
    }
  };

  const handleNewEventInputChange = (event) => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEditedEventInputChange = (event) => {
    setEditedEvent((prevEvent) => ({
      ...prevEvent,
      [event.target.name]: event.target.value,
    }));
  };

  // POST
  const handleCreateEvent = async (event) => {
    event.preventDefault();
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setNewEvent({
        title: "",
        venue_id: "",
        date: "",
        description: "",
        presenter: "",
        price: "",
      });
      setError("");
      fetchEvents();
    } catch (error) {
      setError(error.message);
    }
  };

  // PUT need to fix
  const handleUpdateEvent = async (event, id) => {
    event.preventDefault();
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/event?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedEvent),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setError("");
      fetchEvents();
    } catch (error) {
      setError(error.message);
    }
  };

  // DELETE
  const handleDeleteEvent = async (event, id) => {
    event.preventDefault();
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/event?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Delete Error");
      }
      setError("");
      fetchEvents();
    } catch (error) {
      setError(error.message);
    }
  };

  if (events.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Event Information</h2>
      <div className="content">
        {/* Error message display */}
        {error && <div className="error-message">Error: {error}</div>}
        <h3>Create a New Event</h3>
        <form className="form"onSubmit={handleCreateEvent}>
          <input type="text" placeholder="Title" name="title" value={newEvent.title} onChange={handleNewEventInputChange} required />
          <input type="text" placeholder="Venue ID" name="venue_id" value={newEvent.venue_id} onChange={handleNewEventInputChange} required />
          <input type="text" placeholder="Date" name="date" value={newEvent.date} onChange={handleNewEventInputChange} required />
          <input type="text" placeholder="Description" name="description" value={newEvent.description} onChange={handleNewEventInputChange} required />
          <input type="text" placeholder="Presenter" name="presenter" value={newEvent.presenter} onChange={handleNewEventInputChange} required />
          <input type="text" placeholder="Price" name="price" value={newEvent.price} onChange={handleNewEventInputChange} required />
          <button type="submit">Create a New Event</button>
        </form>
      </div>    

      <div className="content">
        <h3>Change Event Details</h3>
        <input type="text" className="input" placeholder="Title" name="title" value={editedEvent.title} onChange={handleEditedEventInputChange} required />
        <input type="text" className="input" placeholder="Venue ID" name="venue_id" value={editedEvent.venue_id} onChange={handleEditedEventInputChange} required />
        <input type="text" className="input" placeholder="Date" name="date" value={editedEvent.date} onChange={handleEditedEventInputChange} required />
        <input type="text" className="input" placeholder="Description" name="description" value={editedEvent.description} onChange={handleEditedEventInputChange} required />
        <input type="text" className="input" placeholder="Presenter" name="presenter" value={editedEvent.presenter} onChange={handleEditedEventInputChange} required />
        <input type="text" className="input" placeholder="Price" name="price" value={editedEvent.price} onChange={handleEditedEventInputChange} required />  
      </div>

      <div className="content">
        <h3>Existing Events:</h3>
        {events.map((event) => (
          <div key={event.id} className="event-item">
            {/* <h4><strong>{event.title}</strong></h4> */}
            <p><strong>Title:</strong> {event.title}</p>
            <p><strong>Event ID:</strong> {event.id}</p>
            <p><strong>Venue ID:</strong> {event.venue_id}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Presenter:</strong> {event.presenter}</p>
            <p><strong>Price:</strong> {event.price}</p>
            <button
              onClick={(e) => {
                handleUpdateEvent(e, event.id);
              }}
            >
              Change Event Details
            </button>
            <button
              onClick={(e) => {
                handleDeleteEvent(e, event.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default EventInfo;
