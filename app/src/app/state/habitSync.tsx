// habitSync

// api wrappers
export const fetchHabits = async (startDate : Date, userId : string | null) => {
    /**
     * Fetch an array of habit descriptors for the user logged in.
     */
    const res = await fetch(`http://127.0.0.1:5000/get-user-habits/1`);
    const json = await res.json();
    
    return json;
}

export const fetchHabitData = async (habitId: number, startDateRange: Date, endDateRange: Date) => {
    /**
     * Fetch an array of HabitWeeks for a given habitId over the date range given. 
     */
    const startDateStr: string = startDateRange.toDateString(); 
    const endDateStr: string = endDateRange.toDateString(); 
    
    const url = 'http://127.0.0.1:5000'
    const res = await fetch(
        `${url}/get-habit-data/${habitId}?start-week=${startDateStr}&end-week=${endDateStr}`
    );

    return await res.json();
}

import { getLastSundayFromDate, subtractWeeksFromString } from "../util/dateUtil";
import { addHabit } from "./habitSlice";
import { useSelector, useDispatch } from 'react-redux';
import { HabitState } from "./habitSlice";

// loadHabits <==> storeHabits 
const loadHabits = () => {
    
    const dispatch = useDispatch();

    // make all the data present
    const endDateRange = getLastSundayFromDate(new Date());
    const startDateRange = subtractWeeksFromString(endDateRange, 10);

    const fetchedHabits = fetchHabits(new Date(startDateRange), "1").then((response) => {
        response.habits.map((hab: any) => {
            console.log(hab)
            // const habitState: HabitState = {
            //     title: hab.title,
            //     habitId: hab.id,
            //     habitType: hab.type,
            //     weeks: []
            // };

            // dispatch(addHabit(habitState));
        })
    }); 
}

export const storeHabits = () => {

}

export const loadHabitDataWeek = () => {

}

export const storeHabitDataWeek = () => {

}
