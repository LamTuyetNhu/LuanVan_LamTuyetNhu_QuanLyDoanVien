import React from "react";
import Modal from "react-bootstrap/Modal";

const DeleteConfirmationModal = ({ show, onHide, handleDelete }) => {
  return (
    <Modal show={show} onHide={onHide} className="custom-modal">
      <Modal.Header closeButton className="border-none">
        <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
        Bạn chắc chắn xóa?
      </Modal.Body>
      <Modal.Footer className="border-none">
        <button
          className="allcus-button button-error"
          onClick={() => handleDelete()}
        >
          Xóa
        </button>
        <button className="allcus-button" onClick={() => onHide()}>
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
