import React, { useState } from "react";
import useAuth from "../services/useAuth";
import {
    Button,
    Modal,
} from "react-bootstrap";

function SignOutButton({callback}) {
    let auth = useAuth();
    let [showModal, setShowModal] = useState(false);
    function sign_out_pressed() {
        setShowModal(false);
        auth.signout(callback);
    }
    return (
        <>
            <Button variant="outline-danger" onClick={()=>setShowModal(true)}>Sign out</Button>
            <Modal show={showModal} onHide={()=>{setShowModal(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to sign out?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>{setShowModal(false)}}>
                        I've changed my mind
                    </Button>
                    <Button variant="primary" onClick={sign_out_pressed}>
                        I actually do want to sign out
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SignOutButton;
