"use client"

import React, { useState, useEffect } from 'react';
import HabitRow from './habitRow';
import HabitModal from './habitModal';
import { useSelector, useDispatch } from 'react-redux';

export enum HabitType {
    Boolean = "boolean",
    Qualitative = "qualitative",
    Quantiative = "quantiative"
}

export type HabitWeekData = {
    week: string,
    data: Record<string, boolean | number | string>
}

export type HabitDescriptor = {
    id: number, 
    name: string, 
    type: HabitType,
    startDateRange: Date,
    endDateRange: Date, 
    data: HabitWeekData[]
}

export type HabitsContainerProps = {
    startDate: Date
}

export const fetchHabits = async (startDate : Date, userId : string | null) => {
  
  const res = await fetch(`http://127.0.0.1:5000/get-habit-descriptors/1`);
  const json = await res.json();
  
  return json;
}

export const fetchHabitData = async (habitId: number, startDateRange: Date, endDateRange: Date) => {

    const startDateStr: string = startDateRange.toDateString(); 
    const endDateStr: string = endDateRange.toDateString(); 

    const res = await fetch(
        `http://127.0.0.1:5000/get-habit-data/${habitId}?start-week=${startDateStr}&end-week=${endDateStr}`
    );

    return await res.json();
}

const HabitsContainer: React.FC<HabitsContainerProps> = ({ startDate }) => {    
        
    const [newHabitName, setNewHabitName] = useState<string>("");
    const [newHabitType, setNewHabitType] = useState<HabitType>(HabitType.Boolean); 
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editHabitId, setEditHabitId] = useState<number>(-1);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    
    const [habits, setHabits] = useState<HabitDescriptor[]>([]);

    const startDateRange = new Date('2023-07-02');
    const endDateRange = new Date('2023-08-15');

    useEffect(() => {
        fetchHabits(startDate, '1')
            .then((data) => {
                const fetchedHabits: HabitDescriptor[] = data.habits.map((habit: any) => ({
                    id: habit.id, 
                    name: habit.title,
                    type: habit.type,
                    startDateRange: new Date(),
                    endDateRange: new Date(),
                    data: []
                })); 

                const promise = fetchedHabits.map((habit: HabitDescriptor) => {
                    return fetchHabitData(habit.id, startDateRange, endDateRange).then((data) => {
                        const habitWeekData: HabitWeekData[] = data.map((item: any) => ({
                            week: item.start_date,
                            data: item.week_data
                        })); 
                        
                        habit.data = habitWeekData; 
                    });
                })
                // wait for the doubly nested async promise to resolve.
                Promise.all(promise).then(() => {
                    setHabits(fetchedHabits);
                }); 
            });
            
    }, [startDate]);

    const count = useSelector((state: any) => state.counter.count);
    
    const deleteHabit = (id: number) => {
        setHabits(habits.filter(habitDesc => { return habitDesc.id != id }));
    }

    const editHabit = (id: number) => {
        const habit: HabitDescriptor = habits.filter(habitDesc => habitDesc.id == id)[0];
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
        const newHabit: HabitDescriptor = {
            id: 0,
            name: newHabitName,
            type: newHabitType || HabitType.Boolean, 
            startDateRange: new Date(),
            endDateRange: new Date(),
            data: [] 
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
        <div className="habit-container">
            This is the habit component
            <h2> {count} </h2> 
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
            {habits.map((habit, idx) => (
                <div key={`row-div-${idx}`}>
                    <HabitRow key={`habit-row${idx}`} habit={habit} startDate={startDate} />
                    <button key={`delete-btn-${idx}`} onClick={() => deleteHabit(habit.id)}> Remove </button>
                    <button key={`edit-btn-${idx}`} onClick={() => editHabit(habit.id)}> Edit </button>
                </div>
            ))}
        </div>
    );
}

export default HabitsContainer;