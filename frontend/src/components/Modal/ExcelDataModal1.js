import React from "react";
import { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { namhoc } from "../../services/apiService";

const ExcelDataModal = ({ excelData, onClose, onConfirm, selectedFile  }) => {
  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);

  useEffect(() => {
    fetchDSNamHoc();
  }, [idnamhoc]);

  const fetchDSNamHoc = async () => {
    try {
      let res = await namhoc();
      if (res.status === 200) {
        // setListKhoa(res.data.dataNH); // Cập nhật state với danh sách khóa học
        const NamHocdata = res.data.dataNH;

        // Kiểm tra nếu khoaData là mảng trước khi cập nhật state
        if (Array.isArray(NamHocdata)) {
          setDSNamHoc(NamHocdata);
        } else {
          console.error("Dữ liệu khóa không hợp lệ:", NamHocdata);
        }
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setNamHoc(selectedIDNamHoc);
  };

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          <th className="mb-tableItem">MSSV</th>
          <th>Họ Tên</th>
          <th className="NoneMoblie">Email</th>
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody>
        {excelData.slice(0, 10).map((data, index) => (
          <tr key={index}>
            <td className="mb-tableItem mb-tableItem1">{data.MSSV}</td>
            <td>{data.HoTen}</td>
            <td className="NoneMoblie">{data.Email}</td>
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
      <div className="searchDV-input">Năm học: 
            <select
              type="text"
              className="search_name"
              value={idnamhoc}
              onChange={handleNamHocChange}
            >
              {DSNamHoc.map((item, index) => {
                return (
                  <option key={index} value={item.IDNamHoc}>
                    {item.TenNamHoc}
                  </option>
                );
              })}
            </select>
          </div>
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
