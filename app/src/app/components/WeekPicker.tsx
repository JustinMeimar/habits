import React, { useState, useEffect } from 'react';

export type WeekPickerProps = {
    startDate: Date, 
    setStartDate: React.Dispatch<React.SetStateAction<Date>>;
}

const WeekPicker: React.FC<WeekPickerProps> = ({startDate, setStartDate}) => {
    
    const incrementWeek = () => {
        const nextStartDate = new Date(startDate);
        nextStartDate.setDate(nextStartDate.getDate() + 7);
        setStartDate(nextStartDate);
    }

    const decrementWeek = () => {
        const nextStartDate = new Date(startDate);
        nextStartDate.setDate(nextStartDate.getDate() - 7);
        setStartDate(nextStartDate);
    }

    return (
        <div>
            <button onClick={decrementWeek} >Previous</button>
            <span> {startDate.getDate()} </span>
            <button onClick={incrementWeek} >Next</button>
        </div>
    );
}

export default WeekPicker;