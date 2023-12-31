import axios from 'axios'


const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const getMessages = (id) => API.get(`api/message/${id}`);

export const addMessage = (data) => API.post('api/message/', data);