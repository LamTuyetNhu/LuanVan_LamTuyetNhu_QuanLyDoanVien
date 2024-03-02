import React from "react";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Modal1 from "../Modal/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ModalUpdateStatus = ({ onHide }) => {
  const [email, setEmail] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsError, setModalIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  useEffect(() => {}, []);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[a-zA-Z0-9._%+&-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  };

  const [errors, setErrors] = useState({
    email: "",
  });

  const LayLaiMatKhau = async () => {
    const newErrors = {
      email: !email
        ? "Vui lòng nhập Email"
        : !validateEmail(email)
        ? "Email không hợp lệ!"
        : "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    axios
      .post("http://localhost:8080/api/guiMaXacNhan", { email })
      .then((response) => {
        if (response.status === 200) {
          setModalMessage("Gửi mật khẩu mới thành công!");
          setModalIsError(false);
          setShowModal(true);
        } else {
          alert("Gửi mật khẩu mới thất bại");
        }
      })
      .catch((error) => {
        setModalMessage("Kiểm tra lại Email!");
        setModalIsError(true);
        setShowModal(true);
        console.error("Đã xảy ra lỗi:", error);
      });
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <Modal show={true} onHide={onHide} className="custom-modal" >
        <Modal.Header closeButton className="border-none">
          <Modal.Title className="custom-modal-title">
            Bạn quên mật khẩu?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row formAdd">
            <div className="form-group">
              <Form.Label htmlFor="Email">Email</Form.Label>
              <Form.Control
                className="form-control"
                type="text"
                placeholder="Nhập Email của bạn"
                id="Email"
                aria-describedby="Email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="error-message error-message1">{errors.email}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="allcus-button" onClick={LayLaiMatKhau}>
            Gửi
          </button>
          <button className="allcus-button button-error" onClick={onHide}>
            Đóng
          </button>
        </Modal.Footer>
      </Modal>

      {showModal && (
        <Modal1
          show={showModal}
          onHide={() => setShowModal(false)}
          message={modalMessage}
          isError={modalIsError}
        />
      )}
    </>
  );
};

export default ModalUpdateStatus;
