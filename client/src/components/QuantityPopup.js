import React, { useState, useEffect } from "react";
import { Modal, Button, Row } from "react-bootstrap";

const QuantityPopup = (props) => {
    const [quantity, setQuantity] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const maxNum = props.stock - props.quantityInCart;

    useEffect(() => {
        if (maxNum === 0) {
            setDisabled(true);
        }
    }, [maxNum]);

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
                    {disabled && (
                        <Row>
                            <p>Unable to add to cart, insufficient stock</p>
                        </Row>
                    )}
                    <Row>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleInputChange}
                            max={maxNum}
                            min={0}
                            disabled={disabled}
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
