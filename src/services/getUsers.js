import apiService from "./apiService";

const userService = {
  getUsers: () => apiService.get("/api/users"),
  getUsersById: (id) => apiService.get(`/api/users/${id}`),
  createUsers: (data) => apiService.post("/api/users", data),
  updateUsers: (id, data) => apiService.put(`/api/users/${id}`, data),
  deleteUsers: (id) => apiService.delete(`/api/users/${id}`),
};

export default userService;