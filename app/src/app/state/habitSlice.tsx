// habitSlice.tsx
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { addDaysToDateString } from '../util/dateUtil';

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

const initalState: HabitState[] = [];

/**
 * Reducers
 */
const invertBooleanState = (
    state: HabitState[], 
    action: PayloadAction<{ habitId: string; weekKey: string; dayKey: string}>  
) => {
    const { habitId, weekKey, dayKey } = action.payload;

    // find the habit by habitId
    const habitIndex: number = state.findIndex((hs) => hs.habitId === habitId);
    if (habitIndex === -1) return;

    // Find the week in the habit by weekKey
    const weekIndex = state[habitIndex].weeks.findIndex((week) => week.startWeek === weekKey);
    if (weekIndex === -1) return;

    const week: HabitWeekState = state[habitIndex].weeks[weekIndex];
    if (week.data[dayKey] === undefined) return;

    week.data[dayKey] = !week.data[dayKey]; 
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
    action: PayloadAction<HabitState>
) => {
    state.push(action.payload);
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
export const habitSlice = createSlice({
    name: 'habits',
    initialState: initalState, 
    reducers: {
        invertBool: invertBooleanState,
        setQuantitative: setQuantitativeState, 
        addHabitWeek: addHabitWeekState,
        addHabit: addHabitState, 
        setHabits: setHabitStates,
    },
});

export const { 
    invertBool, 
    setQuantitative,
    addHabitWeek, 
    addHabit, 
    setHabits 
} = habitSlice.actions;

export default habitSlice.reducer