import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "../../Modal/Modal";
import ModalAddSuccess from "../../Modal/ModalAddSuccess";

import { themtruong } from "../../../services/apiService";
import logo from "../../../assets/logo.jpg";

const DoanVien = (props) => {
  const navigate = useNavigate();

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
  }, []);

  const [themchidoan, setthemchidoan] = useState({
    TenTruong: "",
    EmailTruong: "",
  });

  const [errors, setErrors] = useState({
    TenTruong: "",
    EmailTruong: "",
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
      TenTruong: !themchidoan.TenTruong ? "Vui lòng nhập tên lớp" : "",
      EmailTruong: !themchidoan.EmailTruong
        ? "Vui lòng nhập Email"
        : !validateEmail(themchidoan.EmailTruong)
        ? "Email không hợp lệ!"
        : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error(
        "Vui lòng nhập đầy đủ thông tin và kiểm tra định dạng ngày!"
      );
      return;
    }

    try {
      let res = await themtruong(themchidoan);
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
      <div className="container app__content">
        <h2 className="text-center">Thêm Trường/Khoa</h2>
        <form onSubmit={handleSubmit}>
          <div className="row formAdd">
            <div className="col col-lg-2 col-md-2 col-none">
              <div className="avatar">
                <img className="avatar_img" src={logo} alt="" />
              </div>
            </div>
            <div className="col col-lg-10 col-md-10 ">
              <div className="row">
                <div className="form-group col-lg-12 col-md-12 col-sm-12 mb-4 mx-auto">
                  <Form.Label htmlFor="TenTruong">Tên trường/khoa</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenTruong"
                    aria-describedby="TenTruong"
                    value={themchidoan.TenTruong}
                    onChange={handleChange}
                  />
                  <div className="error-message">{errors.TenTruong}</div>
                </div>
                <div className="form-group col-lg-12 col-md-12 col-sm-12 mb-4 mx-auto">
                  <Form.Label htmlFor="EmailTruong">Email</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="EmailTruong"
                    aria-describedby="EmailTruong"
                    value={themchidoan.EmailTruong}
                    onChange={handleChange}
                  />
                  <div className="error-message">{errors.EmailTruong}</div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="update row">
            <div className="btns">
              <button className="allcus-button button-error" type="submit">
                <NavLink to="/DaiHocCanTho" className="navlink">
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
      <NavLink to={`/DaiHocCanTho`} className="navlink">
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
