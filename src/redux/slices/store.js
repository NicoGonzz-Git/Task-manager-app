import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';

/**
 * Create the store to save the data
 */
export const store = configureStore({
    reducer: {
        tasks: taskReducer
    }
});