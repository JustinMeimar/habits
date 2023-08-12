"use client"
import React, { useState } from 'react';

export type WeekTy = {
    num: number,
    year: number,
    repr: string
}

export const getCurWeek = (d: Date): WeekTy => {
    return {
        num: getWeekNumber(d),
        year: d.getFullYear(),
        repr: getWeekRepr(d)
    };
}

const getWeekNumber = (d: Date): number => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

const getWeekRepr = (d: Date): string => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getWeekOrdinal = (weekNum: number): string => {
        switch (weekNum) {
            case 1: return "1st";
            case 2: return "2nd";
            case 3: return "3rd";
            case 4: return "4th";
            case 5: return "5th";
            default: return "";
        }
    };

    const startOfWeek = new Date(d);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const month = monthNames[startOfWeek.getMonth()];
    const year = startOfWeek.getFullYear();
    const weekOfMonth = Math.ceil(startOfWeek.getDate() / 7);

    return `${getWeekOrdinal(weekOfMonth)} Week of ${month}, ${year}`;
}

type WeekSliderProps = {
    curWeek: WeekTy;
    setCurWeek: React.Dispatch<React.SetStateAction<WeekTy>>;
};

const WeekSlider: React.FC<WeekSliderProps> = ({curWeek, setCurWeek}) => {

    const incrementWeek = () => {
        setCurWeek(prevWeek => {
            if (prevWeek.num >= 52) {
                return {
                    num: 1,
                    year: prevWeek.year + 1,
                    repr: getWeekRepr(new Date(prevWeek.year + 1, 0, 7))  // Adjust date to early January next year
                };
            } else {
                const nextDate = new Date(prevWeek.year, 0, prevWeek.num * 7);
                return {
                    num: prevWeek.num + 1,
                    year: prevWeek.year,
                    repr: getWeekRepr(nextDate)
                };
            }
        });
    }

    const decrementWeek = () => {
        setCurWeek(prevWeek => {
            if (prevWeek.num <= 1) {
                return {
                    num: 52,
                    year: prevWeek.year - 1,
                    repr: getWeekRepr(new Date(prevWeek.year - 1, 11, 28))  // Adjust date to late December previous year
                };
            } else {
                const prevDate = new Date(prevWeek.year, 0, (prevWeek.num - 2) * 7);
                return {
                    num: prevWeek.num - 1,
                    year: prevWeek.year,
                    repr: getWeekRepr(prevDate)
                };
            }
        });
    }

    return (
        <div>
            <button onClick={decrementWeek} >Previous</button>
            <span>{curWeek.repr}</span>
            <button onClick={incrementWeek} >Next</button>
        </div>
    );
}

export default WeekSlider;