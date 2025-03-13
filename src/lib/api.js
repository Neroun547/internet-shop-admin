import axios from "axios";
import useUserStore from "../stores/user.js";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    authorization: localStorage.getItem("token"),
  }
});

instance.interceptors.response.use((response) => {
  return response;
}, error => {
  if(window.location.pathname !== "/admin/auth" && (error.status === 403 || error.status === 401)) {
    const userStore = useUserStore();

    userStore.setIsAuthenticated(false);

    window.location.href = "/admin/auth";

    return
  }
  return Promise.reject(error);
});

export default instance;

