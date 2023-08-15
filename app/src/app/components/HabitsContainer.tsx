"use client"

import React, { useState, useEffect } from 'react';
import HabitRow from './HabitRow';
import HabitModal from './HabitModal';
import WeekPicker from './WeekPicker';

export enum HabitType {
    Boolean = "boolean",
    Qualitative = "qualitative",
    Quantiative = "quantiative"
}

export type HabitRowDesc = {
    habitId: number,
    habitName: string, 
    startDate: Date
    habitType: HabitType
}

export type HabitDesc = {
    id: number
    name: string, 
    type: HabitType,
}
    
export type HabitsContainerProps = {
    startDate: Date
}

export const fetchHabits = async (startDate : Date, userId : string | null) => {
  console.log("=== RECEIVED fetchHabits");
  const res = await fetch(`http://127.0.0.1:5000/get-habits/1`);
  const json = await res.json();
  
  return json;
}

const HabitsContainer: React.FC<HabitsContainerProps> = ({ startDate }) => {    
        
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [newHabitName, setNewHabitName] = useState<string>("");
    const [newHabitType, setNewHabitType] = useState<HabitType>(HabitType.Boolean);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editHabitId, setEditHabitId] = useState<number>(-1);
    const [habits, setHabits] = useState<HabitDesc[]>([
        { id: 1, name: "Habit 1", type: HabitType.Boolean },
        { id: 2, name: "Habit 2", type: HabitType.Boolean },
    ]);

    useEffect(() => {
        console.log(`start date has changed to: ${startDate}`);
        const habits = fetchHabits(startDate, '1');
        console.log(habits); 

    }, [startDate]);

    const deleteHabit = (id: number) => {
        setHabits(habits.filter(habitDesc => { return habitDesc.id != id }));
    }

    const editHabit = (id: number) => {
        const habit: HabitDesc = habits.filter(habitDesc => habitDesc.id == id)[0];
        setNewHabitType(habit.type);
        setNewHabitName(habit.name);
        setEditHabitId(habit.id)
        setEditMode(true);
        setModalIsOpen(true);
    }

    const onFormNameChange = (name: string) => {
        if (name !== "") {
            setNewHabitName(name); 
        }
    }

    const onFormTypeChange = (habitType: HabitType) => setNewHabitType(habitType);

    const onFormSubmit = () => {
        const newHabit: HabitDesc = {
            id: 0,
            name: newHabitName,
            type: newHabitType || HabitType.Boolean 
        };
        if (editMode) { 
            console.log("Form submitted in edit mode"); 
            newHabit.id = editHabitId;
            const updatedHabits = habits.map(habit => habit.id === editHabitId ? newHabit : habit);
            setHabits(updatedHabits);
            setEditMode(false);
        } else {
            console.log("Form submitted in add mode");
            newHabit.id = (habits.length + 1); 
            setHabits([...habits, newHabit]);
        }
        setModalIsOpen(false);
        setNewHabitName("");
        setNewHabitType(HabitType.Boolean);
    }
    
    const onFormRequestClose = () => {
        setModalIsOpen(false);
        setEditMode(false);
        setNewHabitName("");
        setNewHabitType(HabitType.Boolean);
    }

    return (
        <div>
            This is the habit component

            Sunday, Monday, Tuesday, Wednesday, Thursday, Friday            
            <button onClick={() => setModalIsOpen(true)}> Add Habbit </button>
            
            <HabitModal
                isOpen={modalIsOpen}
                editMode={editMode}
                newHabitName={newHabitName}
                newHabitType={newHabitType}
                onFormNameChange={onFormNameChange}
                onFormTypeChange={onFormTypeChange}
                onFormSubmit={onFormSubmit}
                onFormRequestClose={onFormRequestClose}
            />
            {habits.map(habit => (
                <div>
                    <HabitRow habit={habit} startDate={startDate}/>
                    <button onClick={() => deleteHabit(habit.id)}> Remove </button>
                    <button onClick={() => editHabit(habit.id)}> Edit </button>
                </div>
            ))}
        </div>
    );
}

export default HabitsContainer;