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
    startWeek: Date,
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
    action: PayloadAction<{ habitId: string; weekIndex: number; dateKey: string}>  
) => {
    const { habitId, weekIndex, dateKey } = action.payload;

    // find the habit by habitId
    const habitIndex: number = state.findIndex((hs) => hs.habitId === habitId);
    if (habitIndex === -1) return;

    // find the week in the habit by weekIndex
    const week : HabitWeekState = state[habitIndex].weeks[weekIndex];
    if (!week || week.data[dateKey] === undefined) return;

    // set the boolean at dateKey to its inverse
    week.data[dateKey] = !week.data[dateKey];

    return;
} 

/**
 * Habit Slice
 */
export const habitSlice = createSlice({
    name: 'habits',
    initialState: initalState, 
    reducers: {
        invert: invertBooleanState,
    },
});

export const { invert } = habitSlice.actions;

export default habitSlice.reducer