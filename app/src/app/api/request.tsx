import { getDateString } from "../util/dateUtil";

export const fetchHabits = async (startDate : Date, userId : string | null) => {
    /**
     * Fetch an array of habit descriptors for the user logged in.
     */
    const url = 'http://127.0.0.1:5000'
    const dateString = getDateString(startDate)
    const res = await fetch(`${url}/api/get-user-habits/${userId}?start-date=${dateString}`);
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
        `${url}/api/get-habit-data/${habitId}?start-week=${startDateStr}&end-week=${endDateStr}`
    );

    return await res.json();
}

export const updateDatabase = async (habitId: string) => {

} 