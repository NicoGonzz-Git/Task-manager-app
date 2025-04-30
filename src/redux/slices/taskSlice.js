import { createSlice, nanoid } from '@reduxjs/toolkit';

/**
 * Array of tasks
 */
const initialState = {
  tasks: [
    {
      id: nanoid(),
      title: 'Meeting with Team',
      description: 'Discuss project progress',
      date: new Date(2025, 3, 29),
      color: 'red',
      userId: '3'
    },
    {
      id: nanoid(),
      title: 'Submit Report',
      description: 'Deadline for financial report',
      date: new Date(2025, 3, 29),
      color: 'green',
      userId: '5'
    },
    {
      id: nanoid(),
      title: 'Auth login',
      description: 'Structure the auth for the login page',
      date: new Date(2025, 2, 28),
      color: 'purple',
      userId: '8'
    }
  ]
};

/**
 * Slice from redux that manage task logic
 */
export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer: (state, action) => {
        state.tasks.push(action.payload);
      },
      prepare: (task) => {
        console.log(task)
        return {
          payload: {
            id: nanoid(),
            title: task.title,
            description: task.description || '',
            date: task.date || new Date(),
            color: task.color || 'blue',
            userId: task.userId || '' 
          }
        };
      }
    },
    /**
     * Update an existing task according to the ID
     */
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    /**
     * Delete an existing task according to the ID
     */
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    }
  }
});

/**
 * Bring all the tasks 
 */
export const selectAllTasks = (state) => state.tasks.tasks;

/**
 * Bring the tasks according to an especific date
 */
export const selectTasksByDate = (state, date) => {
  if (!date) return [];
  const targetDate = new Date(date);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const day = targetDate.getDate();
  
  return state.tasks.tasks.filter(task => {
    const taskDate = new Date(task.date);
    return (
      taskDate.getFullYear() === year &&
      taskDate.getMonth() === month &&
      taskDate.getDate() === day
    );
  });
};

export const { addTask, updateTask, deleteTask } = taskSlice.actions;

export default taskSlice.reducer;