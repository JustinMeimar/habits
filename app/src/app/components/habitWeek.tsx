import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../state/store';
import { HabitWeekState } from '../state/habitSlice';
import { HabitState, addHabitWeek } from '../state/habitSlice';
import HabitAtom from "./habitAtom";
import "../globals.css";

type HabitRowProps = {
    habit: HabitState
    startDate: string
};

export const findHabitWeekByStartDate = (habitState: HabitState, startDate: string): HabitWeekState | null => {
    const weekData = habitState.weeks.find(
        (hs: HabitWeekState) => hs.startWeek === startDate
    ); 
    return weekData || null;
};

const HabitWeek: React.FC<HabitRowProps> = ({ habit, startDate }) => {
    
    const [habitWeekData, setHabitWeekData] = useState<HabitWeekState>();
    const dispatch = useDispatch<AppDispatch>(); 
    
    useEffect(() => {
        let weekData : HabitWeekState | null = findHabitWeekByStartDate(habit, startDate);        
        if (weekData === null) {
            dispatch(addHabitWeek({habitId: habit.habitId, startWeek: startDate, data: undefined}));
            weekData = findHabitWeekByStartDate(habit, startDate);
        }
        if (weekData !== null) {
            setHabitWeekData(weekData);
        }
    }, [startDate, habit]);    

    const renderHabitAtoms = () => {
        if (habitWeekData) {
            return Object.entries(habitWeekData.data).map(([key, value]) => (
                <HabitAtom habitId={habit.habitId} weekKey={startDate} key={key} dateKey={key} atomValue={value} type={habit.habitType} />
            ));
        } 
    }; 

    return (
        <div className="habit-week-container">
            <div style={{ display: 'flex'}}>
                <div className="habit-week-title-container">
                    { habit.title } 
                </div>
                <div className="habit-week-type-container">
                    { habit.habitType }
                </div>
            </div>
            <div className="habit-week-atoms-container">
                { renderHabitAtoms() }
            </div>
        </div>
    );
}

export default HabitWeek;