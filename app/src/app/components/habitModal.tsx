import React, { useEffect } from 'react';
import Modal from 'react-modal';
// import { HabitType } from './habitsContainer'
import { HabitType } from '../state/habitSlice';

interface HabitModalProps {
    isOpen: boolean;
    editMode: boolean;
    newHabitName: string;
    newHabitType: HabitType;
    onFormNameChange: (name: string) => void;
    onFormTypeChange: (type: HabitType) => void;
    onFormSubmit: () => void;
    onFormRequestClose: () => void;
}

const HabitModal: React.FC<HabitModalProps> = ({
    isOpen,
    editMode,
    newHabitName,
    newHabitType,
    onFormNameChange,
    onFormTypeChange,
    onFormSubmit,
    onFormRequestClose
}) => {

    // console.log(editMode);
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onFormRequestClose}
            contentLabel={ editMode ? "Edit Habit" : "Add Habit"}
            ariaHideApp={false} 
            style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px',
                    width: '400px',
                    background: '#fff'
                }
            }}
        >
            <h2>{editMode ? "Edit Habit" : "Add New Habit"}</h2>
            <input
                type="text"
                placeholder="Habit Name"
                value={newHabitName}
                onChange={e => onFormNameChange(e.target.value)}
            />
            <select value={newHabitType} onChange={e => onFormTypeChange(e.target.value as HabitType)}>
                {Object.values(HabitType).map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <div>
                <button onClick={onFormSubmit}>{editMode ? "Edit Habit" : "Add Habit"}</button>
                <button onClick={onFormRequestClose} style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
        </Modal>
    );
}

export default HabitModal;