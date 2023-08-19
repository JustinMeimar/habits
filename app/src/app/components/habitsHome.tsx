"use client"

import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../state/counterSlice';
import { addHabit, setHabits, HabitState } from '../state/habitSlice';
import { RootState } from '../state/store'
import { getDateString, getLastSundayFromDate, getLastSundayFromString, subtractWeeksFromString } from '../util/dateUtil';

export const fetchHabits = async (startDate : Date, userId : string | null) => {
    /**
     * Fetch an array of habit descriptors for the user logged in.
     */
    const res = await fetch(`http://127.0.0.1:5000/get-habit-descriptors/1`);
    const json = await res.json();
    
    return json;
}

export const fetchHabitData = async (habitId: number, startDateRange: Date, endDateRange: Date) => {
    /**
     * Fetch an array of HabitWeeks for a given habitId over the date range given. 
     */
    const startDateStr: string = startDateRange.toDateString(); 
    const endDateStr: string = endDateRange.toDateString(); 
    
    const url = 'http://127.0.0.1:5000'
    const res = await fetch(
        `${url}/get-habit-data/${habitId}?start-week=${startDateStr}&end-week=${endDateStr}`
    );

    return await res.json();
}

const HabitsHome: React.FC = () => {    
    
    // Get the count from the Redux state
    const count = useSelector((state: RootState) => state.counter.count);
    const userName = useSelector((state: RootState) => state.user.username);
    const habitStates = useSelector((state: RootState) => state.habits);

    // get data from last ten weeks
    const endDateRange = getLastSundayFromDate(new Date());
    const startDateRange = subtractWeeksFromString(endDateRange, 10);

    useEffect(() => {

        console.log(startDateRange, endDateRange);
        console.log("habitStates before fetch:", habitStates);

        const fetchedHabits = fetchHabits(new Date(startDateRange), "1").then((response) => {
            response.habits.map((hab: any) => {
                console.log(hab)
                const habitState: HabitState = {
                    title: hab.title,
                    habitId: hab.id,
                    habitType: hab.type,
                    weeks: []
                };
                /**
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

                 */
                
                dispatch(addHabit(habitState));
            })
            console.log("habitStates after fetch:", habitStates);
        }); 
    }, [])

    // Get the dispatch function
    const dispatch = useDispatch();

    return (
        <div className="redux-container">
            This is the habits home
            <div>
                <h1>Hello, {userName}</h1>
                <h1>Count: {count}</h1>
                <button onClick={() => dispatch(increment())}>Increment</button>
            </div>
        </div>
    );
}

export default HabitsHome;