import React, { useState } from 'react';
import AtomicHabit from "./AtomicHabit";

const WeekHabit: React.FC = () => {

    const numDailyHabits: number = 7;
    const getHabits = () => {
        return [...Array(numDailyHabits)].map((_, idx) => <AtomicHabit key={idx}/>);
    }

    return (
        <div>
            {getHabits().map(habit => habit)}
        </div>
    );
}

export default WeekHabit;