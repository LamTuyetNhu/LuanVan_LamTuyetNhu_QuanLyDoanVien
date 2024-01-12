import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { NavLink } from "react-router-dom";
import { themHoatDong } from "../../../services/apiService";
import { format, parseISO } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";

const ThemMoiHoatDong = (props) => {

  const [themhoatdong, setThemhoatdong] = useState({
    TenHoatDong: "",
    NgayBatDau: "",
    NgayHetHan: "",
    ChiTietHoatDong: "",
  });

  const [errors, setErrors] = useState({
    TenHoatDong: "",
    NgayBatDau: "",
    NgayHetHan: "",
    ChiTietHoatDong: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setThemhoatdong((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const isValidDate = (dateString) => {
    try {
      const parsedDate = parseISO(dateString);
      if (isNaN(parsedDate.getTime())) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  // Hàm định dạng ngày thành "DD/MM/YYYY"
  const formatDate = (dateString) => {
    try {
      const parsedDate = parseISO(dateString);
      if (isNaN(parsedDate.getTime())) {
        return "";
      }
      return format(parsedDate, "dd/MM/yyyy");
    } catch (error) {
      return "";
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      TenHoatDong: !themhoatdong.TenHoatDong
        ? "Vui lòng nhập tên hoạt động"
        : "",
      NgayBatDau: !isValidDate(themhoatdong.NgayBatDau)
        ? "Ngày bắt đầu không hợp lệ"
        : "",
      NgayHetHan: !isValidDate(themhoatdong.NgayHetHan)
        ? "Ngày kết thúc không hợp lệ"
        : "",
      ChiTietHoatDong: !themhoatdong.ChiTietHoatDong
        ? "Vui lòng nhập chi tiết hoạt động"
        : "",
    };

    if (
      new Date(themhoatdong.NgayHetHan) <= new Date(themhoatdong.NgayBatDau)
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
      await themHoatDong(themhoatdong);
      // Xử lý sau khi thêm thành công (chuyển hướng hoặc hiển thị thông báo)
      setShowModal(true);
      console.log("Hoạt động đã được thêm mới thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm mới hoạt động:", error);
    }
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center">Thêm Hoạt Động</h2>

        <form id="customerForm" className="update" onSubmit={handleSubmit}>
          <div className="formadd">
            <Form.Label htmlFor="TenHoatDong" className="formadd-label">
              Tên hoạt động
            </Form.Label>
            <Form.Control
              type="text"
              id="TenHoatDong"
              aria-describedby="TenHoatDong"
              value={themhoatdong.TenHoatDong}
              onChange={handleChange}
            />
            <div className="error-message">{errors.TenHoatDong}</div>
          </div>
          <div className="row flex">
            <div className="col formadd">
              <Form.Label htmlFor="NgayBatDau" className="formadd-label">
                Ngày bắt đầu
              </Form.Label>
              <Form.Control
                type="date"
                id="NgayBatDau"
                value={themhoatdong.NgayBatDau}
                onChange={handleChange}
                aria-describedby="NgayBatDau"
              />
              <div className="error-message">{errors.NgayBatDau}</div>
            </div>
            <div className="col formadd">
              <Form.Label htmlFor="NgayHetHan" className="formadd-label">
                Ngày kết thúc
              </Form.Label>
              <Form.Control
                type="date"
                id="NgayHetHan"
                aria-describedby="NgayHetHan"
                value={themhoatdong.NgayHetHan}
                onChange={handleChange}
              />
              <div className="error-message">{errors.NgayHetHan}</div>
            </div>
          </div>
          <div className="formadd">
            <Form.Label htmlFor="ChiTietHoatDong" className="formadd-label">
              Chi tiết
            </Form.Label>
            <Form.Control
              type="text"
              id="ChiTietHoatDong"
              as="textarea"
              rows={5}
              aria-describedby="ChiTietHoatDong"
              value={themhoatdong.ChiTietHoatDong}
              onChange={handleChange}
            />
            <div className="error-message">{errors.ChiTietHoatDong}</div>
          </div>{" "}
          <br />
          <div className="btns">
            <button className="allcus-button button-error" type="submit">
              <NavLink to="/BCH-DoanTruong/HoatDong" className="navlink">
                Hủy
              </NavLink>
            </button>

            <button className="allcus-button" type="submit">
              Thêm mới
            </button>
          </div>
        </form>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton className="border-none">
          <Modal.Title className="custom-modal-title">Thành công</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
          Hoạt động đã được thêm mới!
        </Modal.Body>
        <Modal.Footer className="border-none">
          {/* <Button variant="primary" onClick={() => setShowModal(false)}>
            Đóng
          </Button> */}
          <button className="allcus-button button-error" type="submit">
            <NavLink to="/BCH-DoanTruong/HoatDong" className="navlink">
              Đóng
            </NavLink>
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ThemMoiHoatDong;
