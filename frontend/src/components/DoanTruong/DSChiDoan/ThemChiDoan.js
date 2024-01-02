import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import { faPlus, faBackward, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  themChiDoan,
  LayMotDoanVien,
  XoaDoanVien,
} from "../../../services/apiService";
import logo from "../../../assets/logo.jpg";

const DoanVien = (props) => {
  const [themchidoan, setthemchidoan] = useState({
    MaLop: "",
    TenLop: "",
    Khoa: "",
    Email: "",
  });

  const [errors, setErrors] = useState({
    MaLop: "",
    TenLop: "",
    Khoa: "",
    Email: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setthemchidoan((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      MaLop: !themchidoan.MaLop ? "Vui lòng nhập mã lớp" : "",

      TenLop: !themchidoan.TenLop ? "Vui lòng nhập tên lớp" : "",
      Khoa: !themchidoan.Khoa ? "Vui lòng nhập khóa" : "",
      Email: !themchidoan.Email ? "Vui lòng nhập Email" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error(
        "Vui lòng nhập đầy đủ thông tin và kiểm tra định dạng ngày!"
      );
      return;
    }

    try {
      await themChiDoan(themchidoan);
      // Xử lý sau khi thêm thành công (chuyển hướng hoặc hiển thị thông báo)
      setShowModal(true);
      console.log("Chi đoàn đã được thêm mới thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm mới hoạt động:", error);
    }
  };

  return (
    <>
      <div className="container-fluid app__content">
        <h2 className="text-center">Thêm Chi Đoàn</h2>
        <form onSubmit={handleSubmit}>
          <div className="row formAdd">
            <div className="col col-2">
              <div className="avatar">
                <img className="avatar_img" src={logo} alt="" />
              </div>
            </div>
            <div className="col col-10">
              <div className="row">
                <div className="form-group col col-6">
                  <Form.Label htmlFor="MaLop">Mã chi đoàn</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="MaLop"
                    aria-describedby="MaLop"
                    value={themchidoan.MaLop}
                    onChange={handleChange}
                  />
                  <div className="error-message">{errors.MaLop}</div>
                </div>
                <div className="form-group col col-6">
                  <Form.Label htmlFor="TenLop">Tên chi đoàn</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenLop"
                    aria-describedby="TenLop"
                    value={themchidoan.TenLop}
                    onChange={handleChange}
                  />
                  <div className="error-message">{errors.TenLop}</div>
                </div>
                <div className="form-group col col-6">
                  <Form.Label htmlFor="Khoa">Khóa</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="Khoa"
                    aria-describedby="Khoa"
                    value={themchidoan.Khoa}
                    onChange={handleChange}
                  />
                  <div className="error-message">{errors.Khoa}</div>
                </div>
                <div className="form-group col col-6">
                  <Form.Label htmlFor="Email">Email</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="Email"
                    aria-describedby="Email"
                    value={themchidoan.Email}
                    onChange={handleChange}
                  />
                  <div className="error-message">{errors.Email}</div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="btns">
            <button className="allcus-button button-error" type="submit">
              <NavLink to="/BCH-DoanTruong" className="navlink">
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
          <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
          Thêm thành công!
        </Modal.Body>
        <Modal.Footer className="border-none">
          <NavLink to={`/BCH-DoanTruong`} className="navlink">
            <button
              className="allcus-button"
              onClick={() => setShowModal(false)}
            >
              Đóng
            </button>
          </NavLink>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DoanVien;
