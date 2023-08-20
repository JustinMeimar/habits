import next from 'next/types';
import React, { useState, useEffect } from 'react';
import "../../globals.css"

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
        <div className="week-picker-container">
            <div className="week-picker-button" onClick={decrementWeek}>&lt;</div>
            <span> Week of { startDate.toDateString() } </span>
            <div className="week-picker-button" onClick={incrementWeek}>&gt;</div>
        </div>
    );
}

export default WeekPicker;