import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, thunkAPI) => {
  try {
    const response = await taskService.getTasks();
    console.log(response)
    
    return response.data.data.map(task => {
      return {
      id: task.id,
      title: task.title,
      description: task.description,
      date: task.createdDate,
      color: 'blue',
      userId: task.userEmail,
      userName: task.userName,
      userLastName: task.userLastName,
      userImageURL: task.userImageURL,
      role: task.role
      }
    });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await taskService.updateTask(id, data);
      console.log(response)
      return {
        id,
        ...data
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id, thunkAPI) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer: (state, action) => {
        state.tasks.push(action.payload);
      },
      prepare: (task) => {
        return {
          payload: {
            id: nanoid(),
            title: task.title,
            description: task.description || '',
            date: task.createdDate,
            color: task.color || 'blue',
            userId: task.userId || '',
            userName: task.userName || '',
            userLastName: task.userLastName || '',
            userImageURL: task.userImageURL || '',
            role: task.role || ''
          },
        };
      }
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const selectAllTasks = (state) => state.tasks.tasks;

export const selectTasksByDate = (state, date) => {
  if (!date) return [];
  
  const targetDate = new Date(date);
  
  const year = targetDate.getUTCFullYear();
  const month = targetDate.getUTCMonth();
  const day = targetDate.getUTCDate();
  
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