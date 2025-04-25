import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    {
      id: '1',
      title: 'Work Meeting',
      date: new Date(2025, 3, 24),
      color: 'red',
      description: 'Develop meeting '
    },
    {
      id: '2',
      title: 'Proyect delivery',
      date: new Date(2025, 3, 15),
      color: 'blue',
      description: 'Deadline for the proyect'
    }
  ]
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push({
        id: Date.now().toString(),
        ...action.payload
      });
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    }
  }
});

export const { addTask, updateTask, deleteTask } = taskSlice.actions;

export const selectTasks = state => state.tasks.tasks;

export const selectTasksByDate = (state, date) => {
  return state.tasks.tasks.filter(task => 
    task.date.getDate() === date.getDate() &&
    task.date.getMonth() === date.getMonth() &&
    task.date.getFullYear() === date.getFullYear()
  );
};

export default taskSlice.reducer;