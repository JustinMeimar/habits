import React from 'react';
import { Modal, Button } from 'react-bootstrap';

type DeleteModalProps = {
    show: boolean;
    handleClose: () => void;
    handleDelete: () => void;
};

const DeleteModal: React.FC<DeleteModalProps> = ({ show, handleClose, handleDelete }) => (

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete this item?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
                Delete
            </Button>
        </Modal.Footer>
    </Modal>
);

export default DeleteModal;