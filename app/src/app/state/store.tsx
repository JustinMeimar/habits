// store.ts
import { configureStore } from '@reduxjs/toolkit';
import habitReducer, {HabitState} from './habitSlice';  
import userReducer, { UserState } from './userSlice';

export interface RootState {
    user: UserState,
    habits: HabitState[]
}

const store = configureStore({
  reducer: {
    habits: habitReducer,
    user: userReducer
  },
});

export type AppDispatch = typeof store.dispatch;

export default store;
