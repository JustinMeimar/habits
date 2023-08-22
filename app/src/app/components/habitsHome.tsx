"use client"

import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { addHabit, setHabits, HabitState, HabitWeekState } from '@/app/state/habitSlice';
import { AppDispatch, RootState } from '@/app/state/store'
import { HabitType } from '@/app/state/habitSlice';
import { getLastSundayFromDate, subtractWeeksFromString } from '@/app/util/dateUtil';
import { fetchHabits } from '@/app/api/request';
import { addNewHabitThunk, deleteHabitThunk } from '@/app/state/habitThunk';
import { addDaysToDateString } from '@/app/util/dateUtil';

import WeekHeader from './calendar/weekHeader';
import HabitWeek from './habitWeek';
import HabitModal from './habitModal';

import '../globals.css';

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


export const getUninitializedHabitWeek = (habitType: HabitType) : HabitWeekState => {
    const startDate : string = getLastSundayFromDate(new Date());
    const defaultData: Record<string, boolean | string | number | null> = {}; 
    
    for (let i = 0; i < 7; i++) {
        const dateKey = addDaysToDateString(startDate, i);
        defaultData[dateKey] = null;
    }

    return {
        startWeek: startDate,
        data: defaultData 
    };
} 

export type HabitsHomeProps = {
    startDate: string
}

const HabitsHome: React.FC<HabitsHomeProps> = ({ startDate }) => {    
    
    // Get the count from the Redux state
    const habitStates = useSelector((state: RootState) => state.habits);
    
    // container vars
    const [newHabitName, setNewHabitName] = useState<string>("");
    const [newHabitType, setNewHabitType] = useState<HabitType>(HabitType.Boolean); 
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    useEffect(() => {
        loadHabitsOnInit();

        console.log("reload on habit states change");
    }, [habitStates])

    // Get the dispatch function
    const dispatch = useDispatch<AppDispatch>();
    
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
            dispatch(setHabits(habitStateArr));
        }); 
    }
 
    const onFormSubmit = () => { 

        console.log("submitted in add mode");
        const newHabit : HabitState = {
            habitId: (habitStates.length + 1).toString(), 
            title: newHabitName, 
            habitType: newHabitType, 
            weeks: [getUninitializedHabitWeek(newHabitType)]
        };
        dispatch(addNewHabitThunk({habit: newHabit}));        

        setModalIsOpen(false);
        setNewHabitName("");
        setNewHabitType(HabitType.Boolean);
    }
    
    const onFormRequestClose = () => {
        setModalIsOpen(false);
        setNewHabitName("");
        setNewHabitType(HabitType.Boolean);
    }

    return (
        <div className="habit-home">
            <HabitModal
                isOpen={modalIsOpen}
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
                    {<WeekHeader startDate={startDate} />} 
                    {habitStates.map((habit, idx) => (
                    <div key={`habit-week-wrapper-${idx}`} className="habit-week-wrapper">
                        <HabitWeek habit={habit} startDate={startDate} />
                    </div>
                    ))}
                    <div className="habit-menu-buttons">
                        <div className="add-habit-button" 
                            key="add-habit-button" 
                            onClick={() => {setModalIsOpen(true)}}
                            style={{
                                border: "1px solid lightgray",
                                borderRadius: "5px",
                                marginTop: "10px"
                            }}
                        > Add habit
                        </div> 
                    </div> 
                </div>
            </div>
        </div> 
    );
}

export default HabitsHome;