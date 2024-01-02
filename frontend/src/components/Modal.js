// Tên file: CustomModal.js
import React from "react";
import Modal from "react-bootstrap/Modal";

const CustomModal = ({ showModal, handleClose, bodyContent, onConfirm  }) => {
  return (
    <Modal show={showModal} onHide={handleClose} className="custom-modal">
      <Modal.Header closeButton className="border-none">
        <Modal.Title className="custom-modal-title">Thông báo</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
        {bodyContent}
      </Modal.Body>
      <Modal.Footer className="border-none">
        <button className="allcus-button" onClick={handleClose}>
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
