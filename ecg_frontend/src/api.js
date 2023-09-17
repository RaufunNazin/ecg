import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.31.104:80",
  timeout: 1200000,
  // withCredentials: true,
});