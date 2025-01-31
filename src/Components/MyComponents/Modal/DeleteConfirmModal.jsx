import React from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from 'reactstrap';

const DeleteConfirmModal = (props) => {
  return (
    <Modal isOpen={props?.isOpen} toggle={props?.toggle}>
      <ModalHeader toggle={props?.toggle}>Confirm Deletion</ModalHeader>
      <ModalBody>
        Are you sure you want to delete <b className='danger' style={{color:'crimson'}}>{props?.name}</b>?
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={props?.onDelete}>
          Delete
        </Button>{' '}
        <Button color="secondary" onClick={props?.toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteConfirmModal