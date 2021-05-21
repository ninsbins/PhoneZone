import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Select, Form } from "react-bootstrap";

const QuantityPopup = (props) => {
    const [quantity, setQuantity] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const maxNum = props.stock - props.quantityInCart;

    useEffect(() => {
        if (maxNum === 0) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [maxNum, props.quantityInCart]);

    const handleInputChange = (e) => {
        if (e.target.value > maxNum) {
            setQuantity(maxNum);
        } else {
            setQuantity(e.target.value);
        }
    };

    const generateOptions = () => {
        let items = [];

        for (let i = 1; i <= maxNum; i++) {
            items.push(
                <option key={i} value={i}>
                    {i}
                </option>
            );
        }

        return items;
    };
    return (
        <>
            {/* <Button variant="primary" onClick={handleShowModal}>
            Launch demo modal
        </Button> */}

            <Modal show={props.showModal} onHide={props.handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Quantity</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ marginLeft: "10px", padding: "1.5em" }}>
                    <Row className="pb-5">
                        <span style={{ fontWeight: "bold" }}>Phone:</span>{" "}
                        {props.phoneTitle}
                    </Row>
                    {disabled ? (
                        <Row>
                            <p>Unable to add to cart, insufficient stock</p>
                        </Row>
                    ) : (
                        <Row>
                            <Form>
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    as="select"
                                    onChange={handleInputChange}
                                >
                                    {generateOptions()}
                                </Form.Control>
                            </Form>
                        </Row>
                    )}

                    {/* <Row>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleInputChange}
                            max={maxNum}
                            min={0}
                            disabled={disabled}
                        />
                    </Row> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={props.handleCloseModal}
                    >
                        Cancel
                    </Button>
                    {!disabled && (
                        <Button
                            variant="primary"
                            onClick={() => props.handleSaveModal(quantity)}
                            disabled={disabled}
                        >
                            Confirm
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default QuantityPopup;
