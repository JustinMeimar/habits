import React, { useState, useEffect } from 'react';

type HabitAtomProps = {
    dateKey: string,  
    atom: boolean | string | number;
    editAtom: (dateKey : string, newVal: boolean | string | number) => void;
};

const HabitAtom: React.FC<HabitAtomProps> = ({ dateKey, atom, editAtom }) => {
    
    const [atomType, setAtomType] = useState<any | null>(null);

    const handleClick = () => {
        if (atom !== null) {
            switch (atomType) {
                case 'boolean':
                    editAtom(dateKey, !atom); 
                case 'number':
                    return
                case 'string':
                    return;
            }
        }    
    }

    useEffect(() => {
        if (typeof atom === 'boolean') {
            setAtomType('boolean');
        } else if (typeof atom === 'number') {
            setAtomType('number');
        } else if (typeof atom === 'string') {
            setAtomType('string');
        }
    }, [atom]);

    const renderAtom = () => {
        switch (atomType) {
            case 'boolean':
                return atom !== null ? (atom ? '✅' : '❌') : ' ';
            case 'number':
                return atom !== null ? atom.toString() : 'None';
            case 'string':
                return atom || 'None';
            default:
                return 'None'; // default case if the type is not recognized
        }
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
            {<div>{ renderAtom() }</div>}
        </div>
    );
}

export default HabitAtom;