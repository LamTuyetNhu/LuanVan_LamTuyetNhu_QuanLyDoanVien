import React from "react";
import Modal from "react-bootstrap/Modal";

const ModalAddSuccess = (props) => {
  return (
<Modal show={props.show} onHide={props.onHide} className="custom-modal">
  <Modal.Header closeButton className="border-none">
    <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
  </Modal.Header>
  <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
    Thêm mới thành công!
  </Modal.Body>
  <Modal.Footer className="border-none">
    <button className="allcus-button" onClick={props.onHide}>
      Đóng
    </button>
  </Modal.Footer>
</Modal>
  );
};

export default ModalAddSuccess;
