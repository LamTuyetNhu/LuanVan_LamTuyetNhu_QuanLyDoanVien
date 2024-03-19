import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayMotHoatDongdhct,
  CapNhatHoatDongdhct,
  XoaHoatDongdhct,
} from "../../../services/apiService";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import ModalSuccess from "../../Modal/ModalSuccess";
import DeleteSuccess from "../../Modal/DeleteSuccess";
import DeleteConfirmationModal from "../../Modal/DeleteConfirmationModal";
import { useParams } from "react-router-dom";

import {
  faBackward,
  faTrash,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChiTietHoatDong = (props) => {
  const { IDHoatDongDHCT } = useParams();
  const [HoatDong, setHoatDong] = useState([]);
  const navigate = useNavigate();

  const [editedDoanPhi, seteditedDoanPhi] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    // Thêm logic kiểm tra hạn của token nếu cần
    return true;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }
    layMotHoatDong();
  }, [IDHoatDongDHCT]);

  const layMotHoatDong = async () => {
    try {
      let res = await LayMotHoatDongdhct(IDHoatDongDHCT);

      if (res.status === 200) {
        setHoatDong(res.data.dataHD);
        seteditedDoanPhi(res.data.dataHD);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [errors, setErrors] = useState({
    TenHoatDongDHCT: "",
    NgayBatDauDHCT: "",
    NgayHetHanDHCT: "",
    ChiTietHDDHCT: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log("Input changed:", e.target.value);
    seteditedDoanPhi((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "",
    bodyContent: "",
  });

  const handleShowModal1 = (title, bodyContent) => {
    setModalContent({
      title,
      bodyContent,
    });
    setShowModal1(true);
  };

  const handleToggleEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const validateNgay = (Ngay) => {
    return String(Ngay).match(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    );
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const newErrors = {
      TenHoatDongDHCT: !editedDoanPhi.TenHoatDongDHCT
        ? "Vui lòng nhập tên hoạt động"
        : "",
        NgayBatDauDHCT:
        !editedDoanPhi.NgayBatDauDHCT.trim() === ""
          ? "Vui lòng nhập ngày bắt đầu"
          : !validateNgay(editedDoanPhi.NgayBatDauDHCT)
          ? "Ngày định dạng là dd/mm/yyyy"
          : "",

          NgayHetHanDHCT:
        !editedDoanPhi.NgayHetHanDHCT.trim() === ""
          ? "Vui lòng nhập ngày hết hạn"
          : !validateNgay(editedDoanPhi.NgayHetHanDHCT)
          ? "Ngày định dạng là dd/mm/yyyy"
          : "",
          ChiTietHDDHCT: !editedDoanPhi.ChiTietHDDHCT
        ? "Vui lòng nhập chi tiết hoạt động"
        : "",
    };

    if (
      new Date(editedDoanPhi.NgayHetHanDHCT) <= new Date(editedDoanPhi.NgayBatDauDHCT)
    ) {
      newErrors.NgayHetHanDHCT = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error(
        "Vui lòng nhập đầy đủ thông tin và kiểm tra định dạng ngày!"
      );
      return;
    }

    try {
      await CapNhatHoatDongdhct(editedDoanPhi);
      layMotHoatDong();

      setHoatDong(editedDoanPhi);
      setShowModalUpdate(true);
      setIsEditing(false);
      
      console.log("Hoạt động đã được thêm mới thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm mới hoạt động:", error);
    }
  };

  /**/
  // const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDelete = async () => {
    try {
      await XoaHoatDongdhct(IDHoatDongDHCT);
      setShowModal(false);
      handleShowModal1(true);
      console.log("Hoạt động đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center">{HoatDong.TenHoatDongDHCT}</h2>

        <form id="customerForm" className="update">
          <div className="formadd">
            <Form.Label htmlFor="TenHoatDongDHCT" className="formadd-label">
              Tên hoạt động
            </Form.Label>

            {isEditing ? (
              <Form.Control
                className="form-control"
                type="text"
                id="TenHoatDongDHCT"
                aria-describedby="TenHoatDongDHCT"
                value={editedDoanPhi.TenHoatDongDHCT}
                onChange={handleChange}
              />
            ) : (
              <Form.Control
                type="text"
                id="TenHoatDongDHCT"
                aria-describedby="TenHoatDongDHCT"
                value={HoatDong.TenHoatDongDHCT}
                onChange={handleChange}
                disabled
              />
            )}
            <div className="error-message">{errors.TenHoatDongDHCT}</div>
          </div>
          <div className="row flex">
            <div className="col formadd">
              <Form.Label htmlFor="NgayBatDauDHCT" className="formadd-label">
                Ngày bắt đầu
              </Form.Label>

              {isEditing ? (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="NgayBatDauDHCT"
                  aria-describedby="NgayBatDauDHCT"
                  value={editedDoanPhi.NgayBatDauDHCT}
                  onChange={handleChange}
                  placeholder="Ngày bắt đầu phải có định dạng là DD/MM/YYYY"
                />
              ) : (
                <Form.Control
                  type="text"
                  id="NgayBatDauDHCT"
                  aria-describedby="NgayBatDauDHCT"
                  value={HoatDong.NgayBatDauDHCT}
                  onChange={handleChange}
                  disabled
                />
              )}
              <div className="error-message">{errors.NgayBatDauDHCT}</div>
            </div>
            <div className="col formadd">
              <Form.Label htmlFor="NgayHetHanDHCT" className="formadd-label">
                Ngày kết thúc
              </Form.Label>

              {isEditing ? (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="NgayHetHanDHCT"
                  aria-describedby="NgayHetHanDHCT"
                  value={editedDoanPhi.NgayHetHanDHCT}
                  onChange={handleChange}
                  placeholder="Ngày hết hạn phải có định dạng là DD/MM/YYYY"
                />
              ) : (
                <Form.Control
                  type="text"
                  id="NgayHetHanDHCT"
                  aria-describedby="NgayHetHanDHCT"
                  value={HoatDong.NgayHetHanDHCT}
                  onChange={handleChange}
                  disabled
                />
              )}
              <div className="error-message">{errors.NgayHetHanDHCT}</div>
            </div>
          </div>
          <div className="formadd">
            <Form.Label htmlFor="ChiTietHDDHCT" className="formadd-label">
              Chi tiết
            </Form.Label>

            {isEditing ? (
              <Form.Control
                className="form-control"
                type="text"
                id="ChiTietHDDHCT"
                aria-describedby="ChiTietHDDHCT"
                as="textarea"
                rows={5}
                value={editedDoanPhi.ChiTietHDDHCT}
                onChange={handleChange}
              />
            ) : (
              <Form.Control
                type="text"
                id="ChiTietHDDHCT"
                as="textarea"
                rows={5}
                aria-describedby="ChiTietHDDHCT"
                value={HoatDong.ChiTietHDDHCT}
                onChange={handleChange}
                disabled
              />
            )}
            <div className="error-message">{errors.ChiTietHDDHCT}</div>
          </div>{" "}
          <br />
          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink to="/DaiHocCanTho/HoatDong" className="navlink">
                <FontAwesomeIcon icon={faBackward} />
              </NavLink>
            </button>

            {isEditing ? (
              <>
                <button className="allcus-button bgcapnhat" onClick={handleSaveChanges}>
                  <FontAwesomeIcon icon={faSave} /> Lưu
                </button>
              </>
            ) : (
              <button className="allcus-button bgcapnhat" onClick={handleToggleEdit}>
                <FontAwesomeIcon icon={faEdit} /> Cập nhật
              </button>
            )}

            <button
              className="allcus-button button-error"
              type="button"
              onClick={() => setShowModal(true)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </form>
      </div>

      <DeleteConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        handleDelete={handleDelete}
      />

      <NavLink to={`/DaiHocCanTho/HoatDong`} className="navlink">
        <DeleteSuccess show={showModal1} onHide={() => setShowModal1(false)} />
      </NavLink>

      <ModalSuccess
        show={showModalUpdate}
        onHide={() => setShowModalUpdate(false)}
      />
    </>
  );
};

export default ChiTietHoatDong;
