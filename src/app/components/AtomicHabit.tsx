"use client"
import React, { useState } from 'react';

const AtomicHabit: React.FC = () => {

    const [checked, setChecked] = useState(false);

    return (
        <div onClick={() => setChecked(!checked)}
            style={{ border: '1px solid black', padding: '10px', cursor: 'pointer' }} 
        >
            {checked ? '✅' : '❌'}
        </div>
    );
}

export default AtomicHabit;
