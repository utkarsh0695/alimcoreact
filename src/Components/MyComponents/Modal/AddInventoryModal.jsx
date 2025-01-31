import React from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from 'reactstrap';

const AddInventoryModal = (props) => {
  return (
    <Modal isOpen={props?.isOpen} toggle={props?.toggle}>
      <ModalHeader toggle={props?.toggle}>Add To Inventory confirmation!</ModalHeader>
      <ModalBody>
        Are you sure you want to Add to Inventory ?
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props?.onClose}>
          Yes
        </Button>{' '}
        <Button color="secondary" onClick={props?.toggle}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default AddInventoryModal