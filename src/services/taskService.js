import apiService from "./apiService";

const taskService = {
  getTasks: () => apiService.get("/api/tasks"),
  getTaskById: (id) => apiService.get("/api/tasks/${id}"),
  createTask: (data) => apiService.post("/api/tasks", data),
  updateTask: (id, data) => apiService.put("/api/tasks/${id}", data),
  deleteTask: (id) => apiService.delete("/api/tasks/${id}"),
};

export default taskService;