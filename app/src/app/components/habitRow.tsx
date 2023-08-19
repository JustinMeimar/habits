import React, { useState, useEffect } from 'react';
import HabitAtom from "./habitAtom";
import { HabitDescriptor, HabitWeekData } from "./habitsContainer";

type HabitRowProps = {
    habit: HabitDescriptor;
    startDate: Date
};

const HabitRow: React.FC<HabitRowProps> = ({ habit, startDate}) => {
    
    const numDailyHabits: number = 7;    
    const [habitWeekData, setHabitWeekData] = useState<HabitWeekData|null>(null);

    useEffect(() => {
        const dateString = startDate.toISOString().split('T')[0];
        const curWeekData : HabitWeekData | undefined = habit.data.find((weekData: HabitWeekData) => {
            return weekData.week === dateString;
        });
        if (curWeekData !== undefined) {
            setHabitWeekData(curWeekData);
            console.log(habitWeekData);
        }
    }, [startDate]);    

    const handleEditAtom = (dateKey: string, newVal : boolean | number | string) => {
        console.log("do nothing", dateKey, newVal);
        if (habitWeekData) {
            /** Todo: 
             *  Generalize over number and string types
             */
            const updatedWeekData = { ...habitWeekData };
            updatedWeekData.data[dateKey] = newVal;
            setHabitWeekData(updatedWeekData);
        }
    }

    const renderHabitAtoms = () => {
        if (habitWeekData !== null) {
            return Object.entries(habitWeekData.data).map(([key, value]) => (
                <HabitAtom key={key} dateKey={key} atom={value} editAtom={handleEditAtom} />
            ));
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', border: '1px solid black' }}>
                {habit.id}
                {habit.name} 
                {habit.type}
                { renderHabitAtoms() } 
            </div>
        </div>
    );
}

export default HabitRow;