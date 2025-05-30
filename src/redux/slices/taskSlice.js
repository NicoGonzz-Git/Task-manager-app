import { createSlice, createAsyncThunk, nanoid, createSelector } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, thunkAPI) => {
  try {
    const response = await taskService.getTasks();
    
    return response.data.data.map(task => {
      return {
      id: task.id,
      title: task.title,
      description: task.description,
      date: task.createdDate,
      color: task.priority,
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

export const createTaskAsync = createAsyncThunk(
  'tasks/createTask',
  async (taskData, thunkAPI) => {
    try {
      const taskToCreate = {
        ...taskData,
        role: taskData.role || 'user'
      };
      
      const response = await taskService.createTask(taskToCreate);
      
      return {
        id: response.data.id || nanoid(),
        title: taskData.title,
        description: taskData.description || '',
        role: taskData.role || 'user'
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }, thunkAPI) => {
    try {
      await taskService.updateTask(id, data);
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
            color: task.priority || 'blue',
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
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    })
    .addCase(updateTaskAsync.fulfilled, (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    })
    .addCase(deleteTaskAsync.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    })
  }
});

export const selectAllTasks = (state) => state.tasks.tasks;

const formatDateKey = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const selectTasksByDate = createSelector(
  [selectAllTasks, (_, date) => formatDateKey(date)],
  (tasks, formattedDate) => {
    return tasks.filter(task => {
      return formatDateKey(task.date) === formattedDate;
    });
  }
);

export const { addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;