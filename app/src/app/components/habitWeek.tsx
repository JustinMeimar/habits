import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HabitAtom from "./habitAtom";
import { RootState } from '../state/store';
import { HabitWeekState } from '../state/habitSlice';
import { invertBool, setQuantitative } from '../state/habitSlice';
import "../globals.css";
import { HabitState, addHabitWeek, HabitType } from '../state/habitSlice';

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
    const habitStates = useSelector((state: RootState) => state.habits);
    const dispatch = useDispatch(); 
    
    useEffect(() => {
        console.log(habitStates);
        let weekData : HabitWeekState | null = findHabitWeekByStartDate(habit, startDate);        
        if (weekData === null) {
            dispatch(addHabitWeek({habitId: habit.habitId, startWeek: startDate, data: undefined}));
            weekData = findHabitWeekByStartDate(habit, startDate);
        }

        if (weekData !== null) {
            setHabitWeekData(weekData);
        }
    }, [startDate, habitStates]);    

    const handleEditAtom = (dateKey: string, type: HabitType) => {
        // flip the boolean value
        console.log("click on atom:", type)
        switch (type) {
            case HabitType.Boolean: {
                console.log("handle edit boolean");
                dispatch(invertBool({habitId: habit.habitId, weekKey: startDate, dayKey: dateKey}));
                break;
            }
            case HabitType.Quantitative: {
                console.log("handle edit quantitative");
                console.log(habit.habitId, startDate, dateKey, 0);
                dispatch(setQuantitative({habitId: habit.habitId, weekKey: startDate, dayKey: dateKey, value: 0}))    
                break;
            }
            case HabitType.Qualitative: {
                console.log("handle edit quantitative");    
                break;
            }
            default: {
                console.log("no match")
            }
        }
    }

    const renderHabitAtoms = () => {
        if (habitWeekData) {
            return Object.entries(habitWeekData.data).map(([key, value]) => (
                <HabitAtom habitId={habit.habitId} weekKey={startDate} key={key} dateKey={key} atom={value} type={habit.habitType} editAtom={handleEditAtom} />
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