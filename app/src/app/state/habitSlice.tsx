// habitSlice.tsx
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

/**
 * Types
 */
export enum HabitType {
    Boolean = "boolean",
    Qualitative = "qualitative",
    Quantiative = "quantiative"
};

export type HabitWeekState = {
    startWeek: string,
    data: Record<string, boolean | string | number>
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

    // Find the week data by weekIndex
    const week: HabitWeekState = state[habitIndex].weeks[weekIndex];

    // Check if the dayKey exists in the week data
    if (week.data[dayKey] === undefined) return;

    // Set the boolean at dayKey to its inverse
    week.data[dayKey] = !week.data[dayKey];
    
    return;
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
        addHabit: addHabitState, 
        setHabits: setHabitStates,
    },
});

export const { invertBool, addHabit, setHabits } = habitSlice.actions;

export default habitSlice.reducer