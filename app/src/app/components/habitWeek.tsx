import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HabitAtom from "./habitAtom";
import { RootState } from '../state/store';
import { HabitWeekData } from './habitsContainer';
import { HabitWeekState } from '../state/habitSlice';
import { invertBool } from '../state/habitSlice';

type HabitRowProps = {
    habit: HabitState
    startDate: string
};

import { HabitState } from '../state/habitSlice';


export const findHabitWeekByStartDate = (habitState: HabitState, startDate: string): HabitWeekState | null => {
    console.log("findHabitWeekByStartDate:", startDate, habitState); 
    const weekData = habitState.weeks.find(
        (hs: HabitWeekState) => hs.startWeek === startDate
    );

    return weekData || null;
};



const HabitWeek: React.FC<HabitRowProps> = ({ habit, startDate }) => {
    
    const numDailyHabits: number = 7;    
    const [habitWeekData, setHabitWeekData] = useState<HabitWeekState>();
  
    const habitStates = useSelector((state: RootState) => state.habits);
    
    useEffect(() => {
        
        const weekData = findHabitWeekByStartDate(habit, startDate);        

        if (weekData !== null) {
            setHabitWeekData(weekData);
        }

        console.log("render habit week:", habitWeekData);

    }, [startDate, habitStates]);    

    const dispatch = useDispatch(); 

    const handleEditAtom = (dateKey: string, newVal : boolean | number | string) => {
        // flip the boolean value
        dispatch(invertBool({habitId: habit.habitId, weekKey: startDate, dayKey: dateKey}));
    }

    const renderHabitAtoms = () => {
        if (habitWeekData) {
            return Object.entries(habitWeekData.data).map(([key, value]) => (
                <HabitAtom key={key} dateKey={key} atom={value} editAtom={handleEditAtom} />
            ));
        } else {
            const nullArray: null[] = Array(7).fill(null);
            
            return nullArray.map((nullVal, idx) => (
                <div 
                    style={{
                        flex: 1,
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRight: '1px solid black',
                        cursor: 'pointer'
                    }} 
                >
                    ?
                </div>
                // <HabitAtom key={`null-atom-${idx}`} dateKey={startDate}></HabitAtom>
            ));
            
        }
    }; 

    return (
        <div>
            <div style={{ display: 'flex', border: '1px solid black' }}>
                { habit.title } 
                { habit.habitType }
                { renderHabitAtoms() }
            </div>
        </div>
    );
}

export default HabitWeek;