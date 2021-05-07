import React, { useState } from "react";
import { Modal, Button, Row } from "react-bootstrap";

const QuantityPopup = (props) => {
    const [quantity, setQuantity] = useState(1);

    const handleInputChange = (e) => {
        setQuantity(e.target.value);
    };
    return (
        <>
            {/* <Button variant="primary" onClick={handleShowModal}>
            Launch demo modal
        </Button> */}

            <Modal show={props.showModal} onHide={props.handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>Phone: {props.phoneTitle}</Row>
                    <Row>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleInputChange}
                        />
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={props.handleCloseModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => props.handleSaveModal(quantity)}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default QuantityPopup;
