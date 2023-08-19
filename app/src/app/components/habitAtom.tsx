import React, { useState, useEffect } from 'react';
import { HabitType } from '../state/habitSlice';

type HabitAtomProps = {
    dateKey: string,  
    atom: boolean | string| number | null;
    type: HabitType;
    editAtom: (dateKey : string, type: HabitType) => void; 
};

const HabitAtom: React.FC<HabitAtomProps> = ({ dateKey, atom, type, editAtom }) => {
    
    // const [atomType, setAtomType] = useState<any | null>(null);

    const handleClick = () => {
        console.log("click on:", type);
        editAtom(dateKey, type);
    }

    useEffect(() => {
     
    }, [atom]);

    const renderAtom = () => {
        switch (type) {
            case HabitType.Boolean: {
                return <div style={{
                    width: '20px', 
                    height: '20px',
                    border: '1px solid grey',
                    borderRadius: '3px',
                    backgroundColor: atom !== null ? (atom ? '#97ed5a' : '#f0f0f0') : 'transparent',
                }}>
                </div>
            }
            case HabitType.Quantitative:
                return <div style={{
                    width: '20px', 
                    height: '20px',
                    border: '1px solid grey',
                    borderRadius: '3px',
                    backgroundColor: atom !== null ? '#b7fb95' : 'transparent',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center', 
                }}>
                    {atom}
                </div>
            case HabitType.Qualitative:
                return atom || 'None';
            default:
                return (
                    <div className="habit-atom" style={{
                        width: '20px', 
                        height: '20px',
                        border: '1px solid grey',
                        borderRadius: '3px',
                    }}></div>
                ); // default case if the type is not recognized
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
                cursor: 'pointer'
            }} 
        >
            {<div>{ renderAtom() }</div>}
        </div>
    );
}

export default HabitAtom;