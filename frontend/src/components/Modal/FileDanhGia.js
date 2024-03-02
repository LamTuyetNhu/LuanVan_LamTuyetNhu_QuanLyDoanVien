import React from "react";
import { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { namhoc } from "../../services/apiService";

const ExcelDataModal = ({ excelData, idnamhoc, onClose, onConfirm, selectedFile, DSNamHoc   }) => {

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          <div className="searchDV-input">
          </div>
        </tr>
        <tr>
          <th>MSSV</th>
          <th>Điểm HK1</th>
          <th>Điểm HK2</th>
          <th>Điểm RL HK1</th>
          <th>Điểm RL HK2</th>
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody>
        {excelData.slice(0, 10).map((data, index) => (
          <tr key={index}>
            <td>{data.MSSV}</td>
            <td>{data.hk1}</td>
            <td>{data.hk2}</td>
            
            <td>{data.rl1}</td>
            <td>{data.rl2}</td>
          </tr>
        ))}
      </tbody>
    );
  };

  const handleConfirm = () => {
    // Thực hiện xác nhận dữ liệu và gọi hàm onConfirm
    onConfirm(
      idnamhoc
    );

    // Đóng modal
    onClose();
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Dữ Liệu từ File Excel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Xác Nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExcelDataModal;
