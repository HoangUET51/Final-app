import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { deleteUser } from "../services/UserService";
import { toast } from "react-toastify";

const ModalDeleteUser = (props) => {
  const { handleClose, show, dataUserDelete, handleDeleteFromModal } = props;
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const handleDeleteUser = async () => {
    let res = await deleteUser(dataUserDelete.id);
    console.log(">>>>>>>>.Check res", res);
    if (res && +res.status === 204) {
      handleClose();
      toast.success("Delete success");
      handleDeleteFromModal(dataUserDelete.id);
    } else {
      toast.error("Delete Fail");
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete users ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            ARE YOU SURE TO DELETE
            <br />
            <b>Email = {dataUserDelete.email}?</b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleDeleteUser()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDeleteUser;
