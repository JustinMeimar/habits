// counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';

export type CounterState = {
    count: number;
}

const initalState: CounterState = {
    count: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState: initalState, 
  reducers: {
    increment: (state: CounterState) => {
      state.count += 1;
    },
  },
});

export const { increment } = counterSlice.actions;

export default counterSlice.reducer;