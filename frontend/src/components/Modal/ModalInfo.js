import React from "react";
import Modal from "react-bootstrap/Modal";

const ModalAddSuccess = ({ show, onHide, message }) => {

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton className="border-none">
        <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
      <p dangerouslySetInnerHTML={{__html: message.replace(/\n/g, '<br/>')}} />
      </Modal.Body>
      <Modal.Footer>
        <button className="allcus-button" onClick={onHide}>
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddSuccess;
