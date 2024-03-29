import React from "react";
import { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { DanhSachUngTuyenCuaDV } from "../../services/apiService";
import { format } from "date-fns";

const ExcelDataModal = ({ onClose  }) => {
    const IDDoanVien = localStorage.getItem("IDDoanVien");
    const [DSUngTuyen, setDSUngTuyen] = useState([]);

  useEffect(() => {
    fetchDoanVienSVNT();
  }, [IDDoanVien]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  const fetchDoanVienSVNT = async () => {
    try {
      let res = await DanhSachUngTuyenCuaDV(IDDoanVien);
      if (res.status === 200) {
        const UngTuyenData = res.data.dataUT;
          setDSUngTuyen(UngTuyenData);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          <th>MSSV</th>
          <th className="NoneMoblie">Họ Tên</th>
          <th className="NoneMoblie">Ngày ứng tuyển</th>
          <th>Năm học</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody>
        {DSUngTuyen.map((data, index) => (
          <tr key={index}>
            <td>{data.MSSV}</td>
            <td className="NoneMoblie">{data.HoTen}</td>
            <td className="col-center NoneMoblie">{formatDate(data.NgayUngTuyen)}</td>
            <td className="col-center">{data.TenNamHoc}</td>
            <td>{data.TTUngTuyen === 0 ? "Chưa xét duyệt" : data.TTUngTuyen === 1 ? "Đã xét duyệt" : "Không đủ điều kiện"}</td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <Modal show={true} onHide={onClose} size="lg" className="custom-modal">
      <Modal.Header closeButton  className="border-none">
        <Modal.Title className="custom-modal-title">Kết quả xét duyệt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <button className="allcus-button" onClick={onClose}>
        Đóng
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExcelDataModal;
