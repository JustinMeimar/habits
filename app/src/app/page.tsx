"use client"
import React, { useState } from 'react'
import HabitsContainer from './components/HabitsContainer'
import WeekPicker from './components/WeekPicker';

const initializeStartDate = () : Date => {
    /** 
     * Initialize the start date to the most recently passed or current Sunday. 
    */
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();  
    currentDate.setDate(currentDate.getDate() - dayOfWeek); 
    currentDate.setHours(0, 0, 0, 0);
    
    return currentDate;
}

export default function Home() {
    
  const [startDate, setStartDate] = useState<Date>(initializeStartDate());

  return (
    <main className="">
      {<WeekPicker startDate={startDate} setStartDate={setStartDate} />}
      {<HabitsContainer startDate={startDate}/>}
    </main>
  )
}
