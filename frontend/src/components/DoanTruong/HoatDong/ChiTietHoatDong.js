import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayMotHoatDong,
  CapNhatHoatDong,
  XoaHoatDong,
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
  const { IDHoatDong } = useParams();
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
  }, [IDHoatDong]);

  const layMotHoatDong = async () => {
    try {
      let res = await LayMotHoatDong(IDHoatDong);

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
    TenHoatDong: "",
    NgayBanHanh: "",
    NgayHetHan: "",
    ChiTietHD: "",
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
      TenHoatDong: !editedDoanPhi.TenHoatDong
        ? "Vui lòng nhập tên hoạt động"
        : "",
        NgayBanHanh:
        !editedDoanPhi.NgayBanHanh.trim() === ""
          ? "Vui lòng nhập ngày bắt đầu"
          : !validateNgay(editedDoanPhi.NgayBanHanh)
          ? "Ngày định dạng là dd/mm/yyyy"
          : "",

          NgayHetHan:
        !editedDoanPhi.NgayHetHan.trim() === ""
          ? "Vui lòng nhập ngày hết hạn"
          : !validateNgay(editedDoanPhi.NgayHetHan)
          ? "Ngày định dạng là dd/mm/yyyy"
          : "",
      ChiTietHoatDong: !editedDoanPhi.ChiTietHD
        ? "Vui lòng nhập chi tiết hoạt động"
        : "",
    };

    if (
      new Date(editedDoanPhi.NgayHetHan) <= new Date(editedDoanPhi.NgayBanHanh)
    ) {
      newErrors.NgayHetHan = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error(
        "Vui lòng nhập đầy đủ thông tin và kiểm tra định dạng ngày!"
      );
      return;
    }

    try {
      await CapNhatHoatDong(editedDoanPhi);
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
      await XoaHoatDong(IDHoatDong);
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
        <h2 className="text-center">{HoatDong.TenHoatDong}</h2>

        <form id="customerForm" className="update">
          <div className="formadd">
            <Form.Label htmlFor="TenHoatDong" className="formadd-label">
              Tên hoạt động
            </Form.Label>

            {isEditing ? (
              <Form.Control
                className="form-control"
                type="text"
                id="TenHoatDong"
                aria-describedby="TenHoatDong"
                value={editedDoanPhi.TenHoatDong}
                onChange={handleChange}
              />
            ) : (
              <Form.Control
                type="text"
                id="TenHoatDong"
                aria-describedby="TenHoatDong"
                value={HoatDong.TenHoatDong}
                onChange={handleChange}
                disabled
              />
            )}
            <div className="error-message">{errors.TenHoatDong}</div>
          </div>
          <div className="row flex">
            <div className="col formadd">
              <Form.Label htmlFor="NgayBanHanh" className="formadd-label">
                Ngày bắt đầu
              </Form.Label>

              {isEditing ? (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="NgayBanHanh"
                  aria-describedby="NgayBanHanh"
                  value={editedDoanPhi.NgayBanHanh}
                  onChange={handleChange}
                  placeholder="Ngày bắt đầu phải có định dạng là DD/MM/YYYY"
                />
              ) : (
                <Form.Control
                  type="text"
                  id="NgayBanHanh"
                  aria-describedby="NgayBanHanh"
                  value={HoatDong.NgayBanHanh}
                  onChange={handleChange}
                  disabled
                />
              )}
              <div className="error-message">{errors.NgayBanHanh}</div>
            </div>
            <div className="col formadd">
              <Form.Label htmlFor="NgayHetHan" className="formadd-label">
                Ngày kết thúc
              </Form.Label>

              {isEditing ? (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="NgayHetHan"
                  aria-describedby="NgayHetHan"
                  value={editedDoanPhi.NgayHetHan}
                  onChange={handleChange}
                  placeholder="Ngày hết hạn phải có định dạng là DD/MM/YYYY"
                />
              ) : (
                <Form.Control
                  type="text"
                  id="NgayHetHan"
                  aria-describedby="NgayHetHan"
                  value={HoatDong.NgayHetHan}
                  onChange={handleChange}
                  disabled
                />
              )}
              <div className="error-message">{errors.NgayHetHan}</div>
            </div>
          </div>
          <div className="formadd">
            <Form.Label htmlFor="ChiTietHD" className="formadd-label">
              Chi tiết
            </Form.Label>

            {isEditing ? (
              <Form.Control
                className="form-control"
                type="text"
                id="ChiTietHD"
                aria-describedby="ChiTietHD"
                as="textarea"
                rows={5}
                value={editedDoanPhi.ChiTietHD}
                onChange={handleChange}
              />
            ) : (
              <Form.Control
                type="text"
                id="ChiTietHD"
                as="textarea"
                rows={5}
                aria-describedby="ChiTietHD"
                value={HoatDong.ChiTietHD}
                onChange={handleChange}
                disabled
              />
            )}
            <div className="error-message">{errors.ChiTietHD}</div>
          </div>{" "}
          <br />
          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink to="/BCH-DoanTruong/HoatDong" className="navlink">
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

      <NavLink to={`/BCH-DoanTruong/HoatDong`} className="navlink">
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
