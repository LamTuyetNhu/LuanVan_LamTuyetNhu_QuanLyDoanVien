import axios from "axios"
import jwtDecode from 'jwt-decode';

const token = localStorage.getItem("token");

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})

export default instance;