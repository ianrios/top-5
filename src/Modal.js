import { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalExample = ({
    buttonLabel,
    className,
    toggle,
    modal
}) => {
    return (
        <Modal isOpen={modal} toggle={toggle} className={className}>
            <ModalHeader>Create new task</ModalHeader>
            <ModalBody>
                reoccurring?
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalExample;