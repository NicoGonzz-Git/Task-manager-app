import apiService from "./apiService";

const taskService = {
  getTasks: () => apiService.get("/api/tasks"),
  getTaskById: (id) => apiService.get(`/api/tasks/${id}`),
  createTask: (data) => 
    {
      const taskData = {
        ...data,
        role: "user"
      };
      apiService.post("/api/tasks", taskData)
    },
  updateTask: (id, data) => apiService.put(`/api/tasks/${id}`, data),
  deleteTask: (id) => apiService.delete(`/api/tasks/${id}`),
};

export default taskService;