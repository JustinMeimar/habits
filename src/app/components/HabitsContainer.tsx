"use client"

import React, { useState, useEffect } from 'react';
import WeekSlider, { WeekTy, getCurWeek } from './WeekSlider';
import HabitRow from './HabitRow';
import HabitModal from './HabitModal';

export enum HabitType {
    Boolean = "boolean",
    Qualitative = "qualitative",
    Quantiative = "quantiative"
}

export type HabitDesc = {
    id: number
    name: string, 
    type: HabitType
}

const HabitsContainer: React.FC = () => {    

    const [curWeek, setCurWeek] = useState<WeekTy>(getCurWeek(new Date())); 
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [newHabitName, setNewHabitName] = useState<string>("");
    const [newHabitType, setNewHabitType] = useState<HabitType>();
    const [habits, setHabits] = useState<HabitDesc[]>([
        { id: 1, name: "Habit 1", type: HabitType.Boolean },
        { id: 2, name: "Habit 2", type: HabitType.Boolean },
    ]);

    const deleteHabit = (id: number) => {
        console.log("detel habbit");
        console.log(habits, id)
        setHabits(
            habits.filter(habitDesc => { return habitDesc.id != id})
        );
        console.log(habits)
    }

    const onFormNameChange = (name: string) => {
        if (name !== "") {
            console.log("name change")
            setNewHabitName(name); 
        }
    }

    const onFormTypeChange = (habitType: HabitType) => setNewHabitType(habitType);

    const onFormSubmit = () => {
        const new_habit: HabitDesc = {
            id: (habits.length + 1),
            name: newHabitName,
            type: newHabitType || HabitType.Boolean 
        };
        setHabits([...habits, new_habit]);
        setModalIsOpen(false);
    }
    
    const onFormRequestClose = () => {
        console.log("request close")
        setModalIsOpen(false);
    }

    return (
        <div>
            {<WeekSlider curWeek={curWeek} setCurWeek={setCurWeek}/>}
            This is the habit component

            Sunday, Monday, Tuesday, Wednesday, Thursday, Friday
            <button onClick={() => setModalIsOpen(true)}> Add Habbit </button>
            
            <HabitModal
                isOpen={modalIsOpen}
                newHabitName={newHabitName}
                newHabitType={newHabitType}
                onFormNameChange={onFormNameChange}
                onFormTypeChange={onFormTypeChange}
                onFormSubmit={onFormSubmit}
                onFormRequestClose={onFormRequestClose}
            />

            {habits.map(habit => (
                <div>
                    <HabitRow habit={habit} />
                    <button onClick={() => deleteHabit(habit.id)}> Remove </button>
                </div>
            ))}

        </div>
    );
}

export default HabitsContainer;