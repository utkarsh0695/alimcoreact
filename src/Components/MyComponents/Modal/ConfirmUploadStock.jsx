import React from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';

const ConfirmUploadStock = (props) => {
    const partNumbers = props?.message?.map(error => error.row.part_number).join(', ');
    const errorMsg = props?.message?.map(error => <>
        {error.message}<br></br>
    </>);
    return (
        <Modal isOpen={props?.isOpen} toggle={props?.toggle}>
            <ModalHeader toggle={props?.toggle}>Upload Stock confirmation!</ModalHeader>
            <ModalBody>
                Part Number :
                <span className='invalid'>
                    [{
                        partNumbers
                    }]  {" "}
                </span>
                <br />
                <span className='invalid'>
                    {
                        errorMsg
                    }
                </span>
                <br />
                Are you sure you want to Upload Stock ?
            </ModalBody>
            <ModalFooter>
                <Button
                    type='submit'
                    color="primary" onClick={props?.onConfirm}
                    disabled={props?.disabled}
                >
                    {props?.disabled ? "Uploading..." : "Yes"}
                </Button>{' '}
                <Button color="secondary" onClick={props?.toggle}>
                    No
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default ConfirmUploadStock;