// store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer, { CounterState } from './counterSlice';
import habitReducer, {HabitState} from './habitSlice';  
import userReducer, { UserState } from './userSlice';

export interface RootState {
    counter: CounterState,
    user: UserState,
    habits: HabitState[]
}

const store = configureStore({
  reducer: {
    counter: counterReducer,
    habits: habitReducer,
    user: userReducer
  },
});

export default store;