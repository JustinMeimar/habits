"use client"
import React, { useState } from 'react'
import WeekPicker from '@/app/components/calendar/weekPicker';
import store from '@/app/state/store'
import { Provider } from 'react-redux'
import HabitsHome from '@/app/components/habitsHome'
import HomeHeader from '@/app/components/homeHeader';
import { getDateString } from '@/app/util/dateUtil';

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
      <Provider store={store}>
        {<HomeHeader/>}
        {<WeekPicker startDate={startDate} setStartDate={setStartDate} />}
        {<HabitsHome startDate={getDateString(startDate)}/>} 
      </Provider> 
    </main>
  )
}