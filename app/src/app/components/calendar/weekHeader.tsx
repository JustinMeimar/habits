import next from 'next/types';
import React, { useState, useEffect } from 'react';

export type WeekHeaderProps = {
    startDate: string, 
}

import { addDaysToDateString } from '../../util/dateUtil';

const WeekHeader: React.FC<WeekHeaderProps> = ({ startDate }) => {
 
    const daysOfWeek = ['S', 'M', 'T', 'W', 'R', 'F', 'S'];
     
    return (
        <div className="week-header-container">
            {daysOfWeek.map((day, idx) => (
                <div className="week-header-day" key={idx}>
                    <div className="week-header-day-of-week" style={{
                        fontSize: '26px',
                        fontWeight: '250'
                    }}> 
                        {day} 
                    </div>
                    
                    <div className="week-header-date" style={{
                        marginTop: '6px',
                        fontSize: '18px',
                        fontWeight: '350',
                        color: 'gray'
                    }}> 
                        {addDaysToDateString(startDate, idx).slice(-2)}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default WeekHeader;