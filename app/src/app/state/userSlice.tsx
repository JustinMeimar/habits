import { createSlice } from '@reduxjs/toolkit';

export type UserState = {
    username: string;
    email: string
}

const initalState: UserState = {
    username: "fifferfaffer", 
    email: "justin@meimar.com"
};

export const userSlice = createSlice({
  name: 'counter',
  initialState: initalState, 
  reducers: {},
});

export default userSlice.reducer;