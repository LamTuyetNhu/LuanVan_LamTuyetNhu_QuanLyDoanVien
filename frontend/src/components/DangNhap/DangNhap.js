import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import huyhieu from "../../assets/huyhieu.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Modal1 from "../Modal/Modal";
import { jwtDecode } from "jwt-decode";

const DangNhap = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsError, setModalIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (Email) => {
    return String(Email)
      .toLowerCase()
      .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  };

  const validatePassWord = (Email) => {
    return String(Email)
      .toLowerCase()
      .match(/^.{6,}$/);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: !email
        ? "Vui lòng nhập Email"
        : !validateEmail(email)
        ? "Email không hợp lệ!"
        : "",
      password: !password
        ? "Vui lòng nhập mật khẩu"
        : !validatePassWord(password)
        ? "Mật khẩu phải có ít nhất 6 ký tự!"
        : "",
    };

    setErrors(newErrors);

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        const decodedToken = jwtDecode(response.data.token);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", decodedToken.role);
        localStorage.setItem("IDLop", response.data.IDLop);
        localStorage.setItem("IDDoanVien", response.data.IDDoanVien);

        setModalMessage("Đăng nhập thành công!");
        setModalIsError(false);
        setShowModal(true);
        console.log("Đăng nhập thành công!");

        setTimeout(() => {
          if (decodedToken.role === "Admin") {
            navigate("/BCH-DoanTruong");
          } else if (decodedToken.role === "BCHChiDoan") {
            navigate(`/ChiDoan/${response.data.IDLop}`);
          } else if (decodedToken.role === "DoanVien") {
            navigate("/DoanVien");
          }
        }, 1000);
      } else {
        setTimeout(() => {}, 2000);
        setModalMessage("Đăng nhập thất bại!");
        setModalIsError(true);
        setShowModal(true);
        console.log("Đăng nhập thất bại!");
      }
    } catch (error) {
      setModalMessage("Đăng nhập thất bại!");
      setModalIsError(true);
      setShowModal(true);
      console.log("Đăng nhập thất bại!");

      setTimeout(() => {}, 2000);
      console.error("Lỗi đăng nhập:", error);
      setErrorMessage("Sai tên đăng nhập hoặc mật khẩu");
    }
  };
  return (
    <>
      <div className="app-background">
        <div className="">
          <div className="login">
            <div>
              <img className="login-img2" src={huyhieu} alt="Huy hieu" />
              <h3>
                HỆ THỐNG NGHIỆP VỤ CÔNG TÁC <br /> ĐOÀN TNCS HỒ CHÍ MINH
              </h3>
            </div>

            <div className="login-container">
              <form action="#" method="get" className="login-form">
                <h5 className="form-heading login-heading">
                  Thông tin đăng nhập
                </h5>

                <div className="input-box">
                  <span className="icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    className="login-sodt"
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label>Email</label>
                  <div className="error-message error-message1">
                    {errors.email}
                  </div>
                </div>
                <div className="input-box input-boxPW">
                  <span className="icon">
                    <FontAwesomeIcon
                      icon={showPassword ? faEye : faEyeSlash}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </span>
                  <input
                    className="login-pass"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label>Password</label>
                  <div className="error-message error-message1">
                    {errors.password}
                  </div>
                </div>

                <a className="login-qmk">Quên mật khẩu?</a>
                <button
                  type="submit"
                  className="btn-submit-login"
                  onClick={handleLogin}
                >
                  Đăng nhập
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
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

export default DangNhap;
