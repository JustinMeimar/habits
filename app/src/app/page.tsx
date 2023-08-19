"use client"
import React, { useState } from 'react'
import HabitsContainer from './components/habitsContainer'
import WeekPicker from './components/weekPicker';
import store from './state/store'
import { Provider } from 'react-redux'
import HabitsHome from './components/habitsHome'

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
        {<WeekPicker startDate={startDate} setStartDate={setStartDate} />}
        {<HabitsHome startDate={getDateString(startDate)} />} 
        {<HabitsContainer startDate={startDate}/>}
      </Provider> 
    </main>
  )
}


// redux state architecutre
/*

[
  {
    "user_id": 1, 
    "habit_id": 1, 
    "habit_data": {
      start_date: "2023-11-13",
      week_data: {
        "2023-11-13": True,
        "2023-11-14": True,
        "2023-11-15": True,
        "2023-11-16": False,
        "2023-11-18": True,
        "2023-11-19": False,
        "2023-11-20": True,
      }
    }
  },
  {
    "user_id": 1, 
    "habit_id": 2, 
    "habit_data": {
      start_date: "2023-11-13",
      week_data: {
        "2023-11-13": True,
        "2023-11-14": True,
        "2023-11-15": True,
        "2023-11-16": False,
        "2023-11-18": True,
        "2023-11-19": False,
        "2023-11-20": True,
      }
    }
  },
  {
    "user_id": 2, 
    "habit_id": 1, 
    "habit_data": {
      start_date: "2023-11-13",
      week_data: {
        "2023-11-13": True,
        "2023-11-14": True,
        "2023-11-15": True,
        "2023-11-16": False,
        "2023-11-18": True,
        "2023-11-19": False,
        "2023-11-20": True,
      }
    }
  },
]
*/