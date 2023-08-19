// habitSync

// api wrappers
export const fetchHabits = async (startDate : Date, userId : string | null) => {
    /**
     * Fetch an array of habit descriptors for the user logged in.
     */
    const res = await fetch(`http://127.0.0.1:5000/get-habit-descriptors/1`);
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


// loadHabits <==> storeHabits 
export const loadHabits = () => {
    // make all the data present

}

export const storeHabits = () => {

}

export const loadHabitDataWeek = () => {

}

export const storeHabitDataWeek = () => {

}
