import React, { useState, useEffect } from 'react';
import { HabitType } from '../state/habitSlice';
import { useDispatch } from 'react-redux';
import { setQuantitative } from '../state/habitSlice';
import { setBooleanStateThunk, setAtomStateThunk} from '../state/habitThunk';
import { AppDispatch } from '../state/store';

type HabitAtomProps = {
    habitId: string,
    weekKey: string,
    dateKey: string,  
    atomValue: boolean | string| number | null;
    type: HabitType;
};

const HabitAtom: React.FC<HabitAtomProps> = ({ habitId, weekKey, dateKey, atomValue, type }) => {
    
    // const [atomType, setAtomType] = useState<any | null>(null);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
 
    useEffect(() => {
    }, []);

    const dispatch = useDispatch<AppDispatch>();

    const handleQuantAtomInput = (input: string) => {
        const parsedInt: number = parseInt(input, 10);
        if (!isNaN(parsedInt)) {
            dispatch(setAtomStateThunk({habitId: habitId, weekKey: weekKey, dayKey: dateKey, value: parsedInt}))
        }
        setShowInput(false)
    }

    const handleBoolAtomClick = () => {
        let updateValue: boolean = true;
        if ( atomValue !== null) {
            updateValue = !atomValue;
        } 
        dispatch(setAtomStateThunk({habitId: habitId, weekKey: weekKey, dayKey: dateKey, value: updateValue}))
    }

    const renderAtom = () => {
        switch (type) {
            case HabitType.Boolean: {
                return <div 
                    onClick = {handleBoolAtomClick} 
                    style={{
                        width: '20px', 
                        height: '20px',
                        border: '1px solid grey',
                        borderRadius: '3px',
                        backgroundColor: atomValue !== null ? (atomValue ? '#97ed5a' : '#f0f0f0') : 'transparent',
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
                            backgroundColor: atomValue !== null ? '#b7fb95' : 'transparent',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center', 
                        }}>
                        {atomValue}
                    </div>
                );
            case HabitType.Qualitative:
                return atomValue || 'None';
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
        <div style={{
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