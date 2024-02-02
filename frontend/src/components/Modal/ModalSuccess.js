import React from "react";
import Modal from "react-bootstrap/Modal";

const ModalSuccess = (props) => {
  const handleClose = () => {
    props.onHide();
    window.location.reload();
  };
  return (
    <Modal
    show={props.show} onHide={props.onHide}
      className="custom-modal"
    >
      <Modal.Header closeButton className="border-none">
        <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
        Cập nhật thành công!
      </Modal.Body>
      <Modal.Footer className="border-none">
        <button className="allcus-button" onClick={handleClose}>
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSuccess;
