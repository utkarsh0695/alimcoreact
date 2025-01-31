import React from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from 'reactstrap';

const ConfirmModal = (props) => {
  return (
    <Modal isOpen={props?.isOpen} toggle={props?.toggle}>
      <ModalHeader toggle={props?.toggle}>Ticket close confirmation!</ModalHeader>
      <ModalBody>
        Are you sure you want to close <b className='success' style={{color:'#29b63c'}}>{props?.name}</b> ticket?
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props?.onTicketClose}>
          Yes
        </Button>{' '}
        <Button color="secondary" onClick={props?.toggle}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmModal