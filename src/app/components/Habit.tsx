import React, { useState, useEffect } from 'react';
import WeekHabit from './WeekHabit';
import { WeekTy } from './WeekSlider';

type HabitProps = {
    name: string,
    ty: string,
    week_no: number
};

type WeekHabitProps = {
    week: number,
    habit_ty: string, 
    data: any // data corresponding to the state of each habit, so that it can be prefilled
};

const Habit: React.FC = (curWeek: WeekTy) => {
    return (
        <div>
            Test Habbit
        </div>
    );
}

export default Habit;

// const Habit: React.FC<HabitProps> = ({name, ty, week_no}) => {
    
//     const [curWeek, setCurWeek] = useState<WeekHabitProps | null>(null);
    
//     // upon inital load run this
//     useEffect() => {
        
//         // fetch week data
//         const weekData = await fetch(`localhost:5000/habit=${props.name}?week=${week_no}`)

//         // I want to set the current week to the WeekHabitProps type
//         setCurWeek(weekData);
//     }

//     return (
//         <div>
//             name: {props.name}
//             ty: {props.ty}

//             habits: {<WeekHabit data=/>}
//         </div>
//     );
// }

// export default Habit;