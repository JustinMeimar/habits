import React, { useState, useEffect } from 'react';
import HabitAtom from "./HabitAtom";
import { HabitDesc } from "./HabitsContainer";
import { exec } from 'child_process';

type HabitRowProps = {
    habit: HabitDesc;
    startDate: Date
};

const HabitRow: React.FC<HabitRowProps> = ({ habit, startDate}) => {
    
    const numDailyHabits: number = 7;    
    const [habitsChecked, setHabitsChecked] = useState<boolean[]>(Array(numDailyHabits).fill(false));

    useEffect(() => {
        syncRowData();
        return () => {
            
        };
    }, [habitsChecked]);

    async function syncRowData() {

        try {
            console.log("called by useEffect");
            console.log(habit);
            console.log(startDate);
            // const response = await fetch(`http://127.0.0.1:5000/get-habits?
            //     habitId=${habit.id}
            //     startDate=${startDate}
            // `);
            // const rowData = await response.json();
            // console.log(rowData); 
        } catch {
            console.log("error");
        }         
    }

    const getWeekCount = (): number => {
        return habitsChecked.filter(checked => checked).length;
    };

    const handleHabitToggle = (index: number) => {
        /* invert the state of the habit at index */
        setHabitsChecked(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    }

    return (
        <div>
            <div style={{ display: 'flex', border: '1px solid black' }}>
                {habit.id}
                {habit.name} 
                {habit.type}
                {
                    habitsChecked.map((_, idx) => (
                        <HabitAtom key={idx} onToggle={() => handleHabitToggle(idx)}/>
                    ))
                } 
                { getWeekCount() }
            </div>
        </div>
    );
}

export default HabitRow;