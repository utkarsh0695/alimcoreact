import React from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from 'reactstrap';

const OpenTicketModal = (props) => {
  return (
    <Modal isOpen={props?.isOpen} toggle={props?.toggle}>
      <ModalHeader toggle={props?.toggle}>Ticket open confirmation!</ModalHeader>
      <ModalBody>
        Are you sure you want to open <b className='success' style={{color:'#29b63c'}}>{props?.name}</b> ticket?
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props?.onClick}>
          Yes
        </Button>{' '}
        <Button color="secondary" onClick={props?.toggle}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default OpenTicketModal