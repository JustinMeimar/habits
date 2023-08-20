// habitSlice.tsx
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { addDaysToDateString } from '../util/dateUtil';
import { setAtomStateThunk } from './habitThunk';

/**
 * Types
 */
export enum HabitType {
    Boolean = "boolean",
    Qualitative = "qualitative",
    Quantitative = "quantitative"
};

export type HabitWeekState = {
    startWeek: string,
    data: Record<string, boolean | string | number | null>
};

export type HabitState = {
    title: string, 
    habitId: string, 
    habitType: HabitType, 
    weeks: HabitWeekState[]; 
};

const initialState: HabitState[] = [];


export const findHabitIndex = (state: HabitState[],habitId: string) : number => {
    const habitIndex: number = state.findIndex((hs) => hs.habitId === habitId);
    return habitIndex;
}

/**
 * Reducers
 */
const setAtomState = (
    state: HabitState[], 
    action: PayloadAction<{ 
        habitId: string; 
        weekKey: string; 
        dayKey: string, 
        value: boolean | string | number}>  
) => {
    const { habitId, weekKey, dayKey, value } = action.payload;

    const habitIndex: number = state.findIndex((hs) => hs.habitId === habitId);
    if (habitIndex === -1) return;

    const weekIndex = state[habitIndex].weeks.findIndex((week) => week.startWeek === weekKey);
    if (weekIndex === -1) return;

    const week: HabitWeekState = state[habitIndex].weeks[weekIndex];
    if (week.data[dayKey] === undefined) return;

    week.data[dayKey] = value;
    return;
}

const setBooleanState = (
    state: HabitState[], 
    action: PayloadAction<{ habitId: string; weekKey: string; dayKey: string, value: boolean}>  
) => {
    const { habitId, weekKey, dayKey, value } = action.payload;

    const habitIndex: number = state.findIndex((hs) => hs.habitId === habitId);
    if (habitIndex === -1) return;

    const weekIndex = state[habitIndex].weeks.findIndex((week) => week.startWeek === weekKey);
    if (weekIndex === -1) return;

    const week: HabitWeekState = state[habitIndex].weeks[weekIndex];
    if (week.data[dayKey] === undefined) return;

    week.data[dayKey] = value;
    return;
}

const setQuantitativeState = (
    state: HabitState[],
    action: PayloadAction<{ habitId: string, weekKey: string, dayKey: string, value: number}>
) => {
    const { habitId, weekKey, dayKey, value } = action.payload;

    const habitIndex: number = state.findIndex((hs) => hs.habitId === habitId);
    if (habitIndex === -1) return;

    const weekIndex = state[habitIndex].weeks.findIndex((week) => week.startWeek === weekKey);
    if (weekIndex === -1) return;

    const week: HabitWeekState = state[habitIndex].weeks[weekIndex];
    if (week.data[dayKey] === undefined) return;

    week.data[dayKey] = value; 
    return;
}

const addHabitWeekState = (
    state: HabitState[],
    action: PayloadAction<{ habitId: string; startWeek: string; data?: Record<string, boolean | string | number> }>
) => {
    const { habitId, startWeek, data } = action.payload;

    // find the habit by habitId
    const habitIndex: number = state.findIndex((hs) => hs.habitId === habitId);
    if (habitIndex === -1) return;

    const defaultData: Record<string, boolean | string | number | null> = {};

    for (let i = 0; i < 7; i++) {
        const dateKey = addDaysToDateString(startWeek, i);
        defaultData[dateKey] = null;
    }

    const weekData = { startWeek, data: data || defaultData };

    state[habitIndex].weeks.push(weekData);
}

const addHabitState = (
    state: HabitState[],
    action: PayloadAction<{ habit: HabitState}>
) => {
    state.push(action.payload.habit);
}

const setHabitStates = (
    state: HabitState[], 
    action: PayloadAction<HabitState[]>
) => {
    return action.payload;
} 

/**
 * Habit Slice
 */

import { addNewHabitThunk } from './habitThunk';
export const habitSlice = createSlice({
    name: 'habits',
    initialState: initialState, 
    reducers: {
        setQuantitative: setQuantitativeState, 
        setBoolean: setBooleanState,
        addHabitWeek: addHabitWeekState,
        addHabit: addHabitState, 
        setHabits: setHabitStates,
    },
    extraReducers: (builder) => {
        builder.addCase(setAtomStateThunk.fulfilled, (state, action) => {
            setAtomState(state, action);
        })

        builder.addCase(addNewHabitThunk.fulfilled, (state, action) => {
            addHabitState(state, action);
        })
    }
});

export const { 
    setQuantitative,
    addHabitWeek, 
    addHabit, 
    setHabits 
} = habitSlice.actions;

export default habitSlice.reducer