import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "../../Modal/Modal";
import ModalAddSuccess from "../../Modal/ModalAddSuccess";

import { themChiDoan } from "../../../services/apiService";
import logo from "../../../assets/logo.jpg";

const DoanVien = (props) => {
  const navigate = useNavigate();
  const IDTruong = localStorage.getItem("IDTruong");
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
  }, [IDTruong]);

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

  const validateEmail = (Email) => {
    return String(Email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      MaLop: !themchidoan.MaLop ? "Vui lòng nhập mã lớp" : "",
      TenLop: !themchidoan.TenLop ? "Vui lòng nhập tên lớp" : "",
      Khoa: !themchidoan.Khoa ? "Vui lòng nhập khóa" : "",
      Email: !themchidoan.Email ? "Vui lòng nhập Email" : !validateEmail(themchidoan.Email) ? "Email không hợp lệ!" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error(
        "Vui lòng nhập đầy đủ thông tin và kiểm tra định dạng ngày!"
      );
      return;
    }

    try {
      let res = await themChiDoan(IDTruong, themchidoan);
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
            <div className="col col-lg-2 col-md-2 col-none">
              <div className="avatar">
                <img className="avatar_img" src={logo} alt="" />
              </div>
            </div>
            <div className="col col-lg-10 col-md-10 ">
              <div className="row">
                <div className="form-group col-lg-6 col-md-6 col-sm-12 mb-4 mx-auto">
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
                <div className="form-group col-lg-6 col-md-6 col-sm-12 mb-4 mx-auto">
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
                <div className="form-group col-lg-6 col-md-6 col-sm-12 mb-4 mx-auto">
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
                <div className="form-group col-lg-6 col-md-6 col-sm-12 mb-4 mx-auto">
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
          <div className="update row">
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
</div>
        </form>
        <div className="margin-bottom"></div>

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
