"use client"
import React, { useState } from 'react'
import WeekPicker from './components/calendar/weekPicker';
import store from './state/store'
import { Provider } from 'react-redux'
import HabitsHome from './components/habitsHome'
import HomeHeader from './components/homeHeader';

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

import { getDateString } from './util/dateUtil';

export default function Home() {
    
  const [startDate, setStartDate] = useState<Date>(initializeStartDate());

  return (
    <main className="">
      <Provider store={store}>
        {<HomeHeader/>}
            {/* <div className="habit-menu-buttons">
                <div className="add-habit-button" key="add-habit-button" onClick={() => {setModalIsOpen(true)}}>
                    Add
                </div> 
                <div className="remove-habit-button" key={`remove-habit-button`} onClick={() => {}}>
                    Remove
                </div>
            </div> */}
        {<WeekPicker startDate={startDate} setStartDate={setStartDate} />}
        {<HabitsHome startDate={getDateString(startDate)}/>} 
      </Provider> 
    </main>
  )
}