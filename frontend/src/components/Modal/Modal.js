import React from "react";
import { Modal, Button } from "react-bootstrap";

const Modal1 = ({ show, onHide, message, isError }) => {
  return (
    <Modal show={show} onHide={onHide} className="custom-modal">
      <Modal.Header  className="border-none" closeButton>
        <Modal.Title className="custom-modal-title"  >{isError ? "Lỗi" : "Thành công"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer className="border-none">
        <button className="allcus-button" variant={isError ? "danger" : "success"} onClick={onHide}>
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default Modal1;