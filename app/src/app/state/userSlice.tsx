import { createSlice } from '@reduxjs/toolkit';

export type UserState = {
    username: string;
    email: string
}

const initialState: UserState = {
    username: "fifferfaffer", 
    email: "justin@meimar.com"
};

export const userSlice = createSlice({
  name: 'counter',
  initialState: initialState, 
  reducers: {},
});

export default userSlice.reducer;