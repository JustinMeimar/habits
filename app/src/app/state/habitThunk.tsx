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
    console.log('update db', params);

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

export const apiAddHabitWeek = async (habitId: string, startWeek: string) => {

    console.log("api add new habit week:", habitId, startWeek);
    const userId = '1'  
    const baseUrl = 'http://127.0.0.1:5000'
    
    let url = `${baseUrl}/api/add-habit-week/${userId}/${habitId}`
        url += `?start-week=${startWeek}`

    console.log(url);
    
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const json = await res.json();
    
    console.log(res, json)
}

export const apiUpdateHabitTitle = async (userId: string, habitId: string, newTitle: string) => {
    console.log("api update habit title:", habitId, newTitle);
    
    const baseUrl = 'http://127.0.0.1:5000'
 
    let url = `${baseUrl}/api/update-habit-title/${userId}/${habitId}`
        url += `?new-title=${newTitle}`

    console.log(url);
 
    const res = await fetch(url, { method: 'POST'});
    const json = await res.json();
    
    console.log(res, json)
}

export const apiDeleteHabit = async (userId: string, habitId: string) => {
    console.log("api delete habit :", habitId);
    
    const baseUrl = 'http://127.0.0.1:5000'
 
    let url = `${baseUrl}/api/delete-habit/${userId}/${habitId}`

    console.log(url);
 
    // const res = await fetch(url, { method: 'POST'});
    // const json = await res.json();
    
    // console.log(res, json)
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
       
        // TODO: receieve the habit_id assigned by the database and 
        // update the object state in the frontend accordingly
        await apiAddNewHabit(habit);

        // something like: 
        // const returnedHabitId = await apiNewHabit(habit);
        // habit.habit_id = returnedHabitId

        return { habit };
    }
)

export const addHabitWeekThunk = createAsyncThunk(
    'habits/addNewHabitWeek',
    async (params: { habitId: string; startWeek: string  }, thunkAPI) => {
        const { habitId, startWeek } = params;
        
        await apiAddHabitWeek(habitId, startWeek);

        return { habitId, startWeek };
    }
)

export const updateHabitTitleThunk = createAsyncThunk(
    'habits/updateHabitTitle',
    async (params: { habitId: string; newTitle: string  }, thunkAPI) => {
        const { habitId, newTitle } = params;
 
        await apiUpdateHabitTitle('1', habitId, newTitle);

        return { habitId, newTitle };
    }
)

export const deleteHabitThunk = createAsyncThunk(
    'habits/deleteHabit',
    async (params: { habitId: string }, thunkAPI) => {
        const { habitId } = params;
 
        await apiDeleteHabit('1', habitId);

        return { habitId };
    }
)