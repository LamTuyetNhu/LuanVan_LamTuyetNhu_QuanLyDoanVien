import React from "react";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { CapNhatTrangThai } from "../../services/apiService";

const ModalUpdateStatus = ({ onClose, selectedIDUngTuyen }) => {
  const [newTrangThai, setNewTrangThai] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  useEffect(() => {}, []);

  const handleTrangThaiChange = (e) => {
    setNewTrangThai(e.target.value);
  };

  const handleCapNhatTrangThai = async () => {
    try {
      let res = await CapNhatTrangThai(selectedIDUngTuyen, newTrangThai);
      if (res.status === 200) {
        setUpdateSuccess(true);
        setShowModalUpdate(true);
        alert("Cập nhâp thành công!");

        onClose();
          window.location.reload();
      } else {
        alert("Cập nhâp thất bại!");
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  return (
    <>
      <Modal show={true} onHide={onClose} className="custom-modal">
        <Modal.Header closeButton className="border-none">
          <Modal.Title className="custom-modal-title">
            Cập nhật trạng thái
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="custom-modal-body custom-modal-body-trangthai"
          bsPrefix="custom-modal-body"
        >
          <div className="searchDV-input">
            <select
              className="search_name"
              value={newTrangThai}
              onChange={handleTrangThaiChange}
            >
              <option value="" disabled selected>
                Trạng thái
              </option>
              <option value="1">Đã xét duyệt</option>
              <option value="0">Chưa xét duyệt</option>
              <option value="2">Không đủ điều kiện</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="allcus-button bgcapnhat" onClick={handleCapNhatTrangThai}>
            Cập nhật
          </button>
          <button className="allcus-button" onClick={onClose}>
            Đóng
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalUpdateStatus;
