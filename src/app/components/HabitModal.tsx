import React from 'react';
import Modal from 'react-modal';

export enum HabitType {
    Boolean = "boolean",
    Qualitative = "qualitative",
    Quantiative = "quantiative"
}

interface Props {
    isOpen: boolean;
    newHabitName: string;
    newHabitType: HabitType;
    onFormNameChange: (name: string) => void;
    onFormTypeChange: (type: HabitType) => void;
    onFormSubmit: () => void;
    onFormRequestClose: () => void;
}

/*
                isOpen={modalIsOpen}
                newHabitName={newHabitName}
                newHabitType={newHabitType}
                onFormNameChange={onFormNameChange}
                onFormTypeChange={onFormTypeChange}
                onFormSubmit={onFormSubmit}
                onFormRequestClose={onFormRequestClose}
*/

const HabitModal: React.FC<Props> = ({
    isOpen,
    newHabitName,
    newHabitType,
    onFormNameChange,
    onFormTypeChange,
    onFormSubmit,
    onFormRequestClose
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onFormRequestClose}
            contentLabel="Add Habit Modal"
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
            <h2>Add New Habit</h2>
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
                <button onClick={onFormSubmit}>Add Habit</button>
                <button onClick={onFormRequestClose} style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
        </Modal>
    );
}

export default HabitModal;