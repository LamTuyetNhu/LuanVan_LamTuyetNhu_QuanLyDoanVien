import React from "react";
import { Modal } from "react-bootstrap";

const ExcelDataModal = ({onClose, handleConfirmExcelData }) => {

  const handleConfirmClick = () => {
    onClose();
    handleConfirmExcelData();
  };

  return (
    <Modal show={true} onHide={onClose} className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
      </Modal.Header>
      <Modal.Body  className="custom-modal-body" bsPrefix="custom-modal-body">
        Bạn muốn thay đổi mẫu ứng tuyển?
      </Modal.Body>
      <Modal.Footer>
        <button className="allcus-button" onClick={handleConfirmClick}>
          Xác nhận
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExcelDataModal;
