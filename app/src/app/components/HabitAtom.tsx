import React, { useState } from 'react';

type HabitAtomProps = {
    onToggle: () => void;
};

const HabitAtom: React.FC<HabitAtomProps> = ({ onToggle }) => {
    const [checked, setChecked] = useState(false);

    const handleClick = () => {
        setChecked(!checked);
        onToggle();
    }

    return (
        <div 
            onClick={handleClick}
            style={{
                flex: 1,
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid black',
                cursor: 'pointer'
            }} 
        >
            {checked ? '✅' : '❌'}
        </div>
    );
}

export default HabitAtom;