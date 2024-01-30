import React from "react";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { namhoc } from "../../services/apiService";

const ExcelDataModal = ({ onClose, onConfirm }) => {
  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);

  useEffect(() => {
    fetchDSNamHoc();
  }, [idnamhoc]);

  const fetchDSNamHoc = async () => {
    try {
      let res = await namhoc();
      if (res.status === 200) {
        const NamHocdata = res.data.dataNH;

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

  const handleConfirm = () => {
    onConfirm(idnamhoc);
    onClose();
  };

  return (
    <Modal show={true} onHide={onClose} className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
      </Modal.Header>
      <Modal.Body  className="custom-modal-body" bsPrefix="custom-modal-body">
        <div className="searchDV-input searchDV-input-small"> Chọn năm học: 
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
        <br />Bạn chắc chắn ứng tuyển?
      </Modal.Body>
      <Modal.Footer>
        <button className="allcus-button" onClick={handleConfirm}>
          Xác nhận
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExcelDataModal;
