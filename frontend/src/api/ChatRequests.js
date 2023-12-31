import axios from 'axios'


const API = await axios.create({ baseURL: process.env.REACT_APP_API_URL });



export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);

export const getVenues = ()  => API.get(`api/chat/venue`);

export const createChat = (venueId) => API.post(`api/chat/${venueId}`);

export const joinChats = (userId, venueId) =>  API.get(`api/chat/?userId=${userId}&venueId=${venueId}`);

export const userChats = (id) => API.get(`api/chat/${id}`);