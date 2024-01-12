import { useState } from "react";
import Form from "react-bootstrap/Form";
import { NavLink } from "react-router-dom";
import Modal from "../../Modal/Modal";
import ModalAddSuccess from "../../Modal/ModalAddSuccess";

import { themChiDoan } from "../../../services/apiService";
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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      let res = await themChiDoan(themchidoan);
      // Xử lý sau khi thêm thành công (chuyển hướng hoặc hiển thị thông báo)
      if (res.status === 200) {
        setSuccessMessage("Thêm thành công!");
        setShowModal(true);
      } else {
        setErrorMessage("Thêm không thành công!");
        setShowModal(true);
      }
    } catch (error) {
      setErrorMessage("Lỗi khi thêm mới!");
      setShowModal(true);
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
      <NavLink to={`/BCH-DoanTruong`} className="navlink">
        <div>
          {/* Display success message */}
          {successMessage && (
            <Modal
              show={showModal}
              onHide={() => {
                setShowModal(false);
                setSuccessMessage("");
              }}
              message={successMessage}
            />
          )}

          {/* Display error message */}
          {errorMessage && (
            <Modal
              show={showModal}
              onHide={() => {
                setShowModal(false);
                setErrorMessage("");
              }}
              message={errorMessage}
              isError={true}
            />
          )}
        </div>
        {/* <ModalAddSuccess show={showModal} onHide={() => setShowModal(false)} /> */}
      </NavLink>
    </>
  );
};

export default DoanVien;
