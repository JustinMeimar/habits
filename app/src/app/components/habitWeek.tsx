import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../state/store';
import { HabitWeekState } from '../state/habitSlice';
import { HabitState } from '../state/habitSlice';
import { addHabitWeekThunk, updateHabitTitleThunk, deleteHabitThunk } from '../state/habitThunk';

import HabitAtom from "./habitAtom";
import DeleteModal from './modal/deleteModal';
import "../globals.css";

type HabitRowProps = {
    habit: HabitState
    startDate: string
};

export const findHabitWeekByStartDate = (habitState: HabitState, startDate: string): HabitWeekState | null => {
    const weekData = habitState.weeks.find(
        (hs: HabitWeekState) => hs.startWeek === startDate
    ); 
    return weekData || null;
};

const HabitWeek: React.FC<HabitRowProps> = ({ habit, startDate }) => {
     
    const [habitWeekData, setHabitWeekData] = useState<HabitWeekState>();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editHabitTitle, setEditHabitTitle] = useState<string>(habit.title);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const dispatch = useDispatch<AppDispatch>();    
     
    useEffect(() => {
        let weekData : HabitWeekState | null = findHabitWeekByStartDate(habit, startDate);        
        if (weekData === null) {
            // dispatch(addHabitWeek({habitId: habit.habitId, startWeek: startDate, data: undefined}));
            dispatch(addHabitWeekThunk({habitId: habit.habitId, startWeek: startDate}));
            weekData = findHabitWeekByStartDate(habit, startDate);
        }
        if (weekData !== null) {
            setHabitWeekData(weekData);
        }
    }, [startDate, habit]);    

    const renderHabitTitle = () => {
        const handleTitleChange = () => {
            setEditMode(false);
            dispatch(updateHabitTitleThunk({habitId: habit.habitId, newTitle: editHabitTitle}));
        }
        return editMode ? (
            <div>
                <input className="habit-week-title-container"
                    type="text" 
                    value={ editHabitTitle }
                    onChange={(e) => setEditHabitTitle(e.target.value)}
                    onBlur={() => {handleTitleChange()}}
                    style = {{ border: 'none', outline: 'none', boxShadow: 'none', width: '350px' }}
                />
            </div>
        ) : (
            <div>
                {habit.title}
            </div>
        );
    }

    const handleShowDeleteModal = () => setShowDeleteModal(true); 
    const handleCloseModal = () => setShowDeleteModal(false);
     
    const handleDeleteModal = () => {
        console.log("delete habit", habit)
        setShowDeleteModal(false);
        dispatch(deleteHabitThunk({ habitId: habit.habitId }))
    } 

    const renderHabitAtoms = () => {
        if (habitWeekData) {
            return Object.entries(habitWeekData.data).map(([key, value]) => (
                <HabitAtom habitId={habit.habitId} weekKey={startDate} key={key} dateKey={key} atomValue={value} type={habit.habitType} />
            ));
        } 
    }; 

    return (
        <div className="habit-week-container" style={{ position: 'relative'}}>
            <div style={{ display: 'flex'}}>
                <div className="habit-week-title-container">
                    { renderHabitTitle() } 
                </div>
                <div className="habit-week-type-container"
                    style={{ display: editMode ? 'none' : 'flex'}} 
                >
                    { habit.habitType }
                </div>
            </div>
            <div className="habit-week-atoms-with-button-container" style={{ display: 'flex'}}>
                <div className="habit-week-atoms-container" style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                    { renderHabitAtoms() }
                </div>
                <div className="edit-button" key={`edit-btn-${habitWeekData?.startWeek}`} onClick={() => {setEditMode(!editMode)}} >
                    ✏️
                </div>
                <div className="delete-button" 
                        key={`delete-btn-${habitWeekData?.startWeek}`} 
                        onClick={handleShowDeleteModal}
                        style={{ display: editMode? 'flex' : 'none', position: 'absolute', right: '-40px', top: '50px'}}
                    >
                    🗑️
                </div>
            </div>
            
            <DeleteModal 
                show={showDeleteModal} 
                handleClose={handleCloseModal} 
                handleDelete={handleDeleteModal} 
            /> 
        </div>
    );
}

export default HabitWeek;