import axios from "axios";

const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com"
});

const getUsers = () => api.get("/users")

export { getUsers };