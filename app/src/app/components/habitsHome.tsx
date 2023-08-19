"use client"

import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../state/counterSlice';
import { addHabit, setHabits, HabitState, HabitWeekState } from '../state/habitSlice';
import { RootState } from '../state/store'
import { getDateString, getLastSundayFromDate, getLastSundayFromString, subtractWeeksFromString } from '../util/dateUtil';
import { HabitType } from '../state/habitSlice';
import HabitModal from './habitModal';
import HabitWeek from './habitWeek';
import '../globals.css';
import WeekHeader from './weekHeader';

export const fetchHabits = async (startDate : Date, userId : string | null) => {
    /**
     * Fetch an array of habit descriptors for the user logged in.
     */
    const res = await fetch(`http://127.0.0.1:5000/get-user-habits/1`);
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

export const parseHabitData = (data: any) : HabitState => {
    const habitState: HabitState = {
        title: data.title, 
        habitId: data.id,
        habitType: data.type,
        weeks: data.weeks.map((week: any) : HabitWeekState => {
            return {
                startWeek: week.start_date,
                data: week.week_data
            }
        })
    };
    return habitState
}

export type HabitsHomeProps = {
    startDate: string
}


const HabitsHome: React.FC<HabitsHomeProps> = ({ startDate }) => {    
    
    // Get the count from the Redux state
    const userName = useSelector((state: RootState) => state.user.username);
    const habitStates = useSelector((state: RootState) => state.habits);
    
    // container vars
    const [newHabitName, setNewHabitName] = useState<string>("");
    const [newHabitType, setNewHabitType] = useState<HabitType>(HabitType.Boolean); 
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editHabitId, setEditHabitId] = useState<number>(-1);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    useEffect(() => {
        loadHabitsOnInit();
    }, [])

    // Get the dispatch function
    const dispatch = useDispatch();
    
    const loadHabitsOnInit = () => {
        // make function idempotent
        if (habitStates.length > 0) {
            return;
        }

        // make all the data present
        const endDateRange = getLastSundayFromDate(new Date());
        const startDateRange = subtractWeeksFromString(endDateRange, 10);
        
        fetchHabits(new Date(startDateRange), "1").then((response) => {
            const habitStateArr: HabitState[] = []; 
            response.habits.map((hab: any) => {
                const parsedData = parseHabitData(hab); 
                habitStateArr.push(parsedData);
            })
            console.log(habitStateArr);
            dispatch(setHabits(habitStateArr));
        }); 
    }
 
    const deleteHabit = (id: number) => {
        // TODO: delete a habit
    }

    const editHabit = (id: number) => {
        // TODO: edit a habit 

        // setNewHabitType(habit.type);
        // setNewHabitName(habit.name);
        // setEditHabitId(habit.id)
        setEditMode(true);
        setModalIsOpen(true);
    }

    const onFormSubmit = () => { 
        if (editMode) {
            // TODO: handle edit submit form
        } else {
            console.log("submitted in add mode");
            const newHabit : HabitState = {
                habitId: (habitStates.length + 1).toString(), 
                title: newHabitName, 
                habitType: newHabitType, 
                weeks: []
            };
            dispatch(addHabit(newHabit));
        }
        setModalIsOpen(false);
        setNewHabitName("");
        setNewHabitType(HabitType.Boolean);
    }
    
    const onFormRequestClose = () => {
        setModalIsOpen(false);
        setEditMode(false);
        setNewHabitName("");
        setNewHabitType(HabitType.Boolean);
    }

    return (
        <div className="habit-home">
            <HabitModal
                isOpen={modalIsOpen}
                editMode={editMode}
                newHabitName={newHabitName}
                newHabitType={newHabitType}
                onFormNameChange={(name : string) => {setNewHabitName(name)}}
                onFormTypeChange={(type: HabitType) => {setNewHabitType(type)}}
                onFormSubmit={onFormSubmit}
                onFormRequestClose={onFormRequestClose}
            />
            <div className="habit-container">
                <div>
                    
                    <br></br>
                    {
                        <WeekHeader startDate={startDate} />
                    } 
                    {habitStates.map((habit, idx) => (
                    <div key={`habit-week-wrapper-${idx}`} className="habit-week-wrapper">
                        <HabitWeek habit={habit} startDate={startDate} />
                        <div className="button-wrapper">      
                            {/* <div className="button" key={`delete-btn-${idx}`} onClick={() => {}}>
                                ❌
                            </div> */}
                            <div className="button" key={`edit-btn-${idx}`} onClick={() => {}}>
                            ✏️
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div> 
    );
}

export default HabitsHome;