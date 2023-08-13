import React, { useState, useEffect } from 'react';
import HabitAtom from "./HabitAtom";
import { HabitDesc } from "./HabitsContainer";

type HabitRowProps = {
    habit: HabitDesc;
};

const HabitRow: React.FC<HabitRowProps> = ({ habit }) => {
    
    const numDailyHabits: number = 7;    
    const [habitsChecked, setHabitsChecked] = useState(Array(numDailyHabits).fill(false));

    const getWeekCount = (): number => {
        return habitsChecked.filter(checked => checked).length;
    };

    const handleHabitToggle = (index: number) => {
        // invert the state of the habit at index
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