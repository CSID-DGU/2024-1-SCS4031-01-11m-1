import axios from "axios";

const { VITE_APP_SERVER_PORT } = import.meta.env;

const instance = axios.create({
  baseURL: VITE_APP_SERVER_PORT + "/api/v1/",

  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default instance;