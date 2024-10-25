import axios from "axios";
import { CONFIG } from "../config";

const API_URL = CONFIG.API_URL;

const instance = axios.create({
   baseURL: API_URL,
});

instance.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("token");
      if (token) {
         config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   },
);

instance.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response && error.response.status === 401) {
         // Handle 401 error - e.g., redirect to login page or refresh token
         console.log("Unauthorized, redirecting to login");
         // You might want to use your app's routing mechanism here
         // For example, if using react-router:
         // import history from '../history';
         // history.push('/login');
      }
      return Promise.reject(error);
   },
);

export default instance;
