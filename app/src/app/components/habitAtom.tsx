import React, { useState, useEffect } from 'react';
import { HabitType } from '../state/habitSlice';
import { useDispatch } from 'react-redux';
import { setQuantitative } from '../state/habitSlice';

type HabitAtomProps = {
    habitId: string,
    weekKey: string,
    dateKey: string,  
    atom: boolean | string| number | null;
    type: HabitType;
    editAtom: (dateKey : string, type: HabitType) => void; 
};

const HabitAtom: React.FC<HabitAtomProps> = ({ habitId, weekKey, dateKey, atom, type, editAtom }) => {
    
    // const [atomType, setAtomType] = useState<any | null>(null);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");

    const handleClick = () => {
        console.log("click on:", type);
        editAtom(dateKey, type);
    }

    useEffect(() => {
    }, []);

    const dispatch = useDispatch();

    const handleQuantAtomInput = (input: string) => {
        console.log("set this value to the habit data:", input)

        const parsedInt: number = parseInt(input, 10);

        if (!isNaN(parsedInt)) {
            dispatch(setQuantitative({habitId: habitId, weekKey: weekKey, dayKey: dateKey, value: parsedInt}))
        }
        setShowInput(false)
        // dispatch(setQuantitative({habitId: habitId))
    }

    // to be put in quantitativeHabitAtom component
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
                return showInput ? (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={() => handleQuantAtomInput(inputValue)}
                        autoFocus
                        style = {{
                            width: '40px',
                            border: 'none'
                        }}
                    />
                ) : (
                    <div 
                        onClick={() => setShowInput(true)} 
                        style={{
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
                );
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
            onClick={ type === HabitType.Boolean ? handleClick : () => {}}
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