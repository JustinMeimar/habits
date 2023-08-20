import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { HabitState } from "./habitSlice";

/**
 * Thunk Plan:
 *  
 * setAtomStateThunk (habitId, weekKey, dayKey, value)
 *  
 * addHabitThunk(habitId, userId)
 *  // add a new habit with an uninitialized week at current startDate
 * 
 * deleteHabitThunk(habitId, userId) 
 *  // delete an existing habit and its data
 * 
 * editHabitThunk() 
 *  // replace habit metadata (name)
 *  
 * initHabitWeekThunk(habitId, weekKey) 
 *  // add a new uninitialized week to the data of a habit
 */
type UpdateDatabaseParams = {
  habitId: string;
  weekKey: string;
  dayKey: string;
  value: boolean | number | string;
};

export const updateDatabase = async (params: UpdateDatabaseParams) => {
    console.log('update db');

    const userId = '1' 
    
    const baseUrl = 'http://127.0.0.1:5000'
    let url = `${baseUrl}/api/update-atom/${userId}/${params.habitId}`
    url += `?week-key=${params.weekKey}&day-key=${params.dayKey}`

    console.log(url);
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: params.value})
    });

    const json = await res.json();
    
    console.log(res, json)
} 

export const apiAddNewHabit = async (habit : HabitState) => {

    console.log('add new habit:', habit);    

    const userId = '1' 
    
    const baseUrl = 'http://127.0.0.1:5000'
    let url = `${baseUrl}/api/add-habit/${userId}`

    console.log(url);
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ habit: habit })
    });

    const json = await res.json();
    
    console.log(res, json)
}

export const setAtomStateThunk = createAsyncThunk(
    'habits/setAtomState',
    async (params: { habitId: string; weekKey: string; dayKey: string, value: boolean | number | string }, thunkAPI) => {
        const { habitId, weekKey, dayKey, value } = params;
        
        // const rootState : RootState = thunkAPI.getState() as RootState;
        await updateDatabase(params);
        
        return { habitId, weekKey, dayKey, value};
    }
);

export const addNewHabitThunk = createAsyncThunk(
    'habits/addNewHabit',
    async (params: { habit: HabitState }, thunkAPI) => {
        const { habit } = params;
        
        await apiAddNewHabit(habit);

        return { habit };
    }
)