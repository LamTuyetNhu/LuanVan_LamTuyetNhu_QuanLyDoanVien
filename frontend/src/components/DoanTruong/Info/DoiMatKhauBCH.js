import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import ModalSuccess from "../../Modal/ModalSuccess";

import axios from "axios";
const PasswordStrengthMeter = () => {
  const navigate = useNavigate();

  const IDBCH = localStorage.getItem("IDBCH");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    apiError: "", // Thêm một trường để lưu trữ lỗi từ API
  });

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
  }, [IDBCH]);

  const toggleShowPassword = (type) => {
    switch (type) {
      case "old":
        setShowOldPassword(!showOldPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleChangeOldPassword = (e) => {
    const value = e.target.value;
    setOldPassword(value);
  };

  const validatePassword = async (e) => {
    e.preventDefault();

    const newPassword = password; // Đổi thành biến lấy từ state hoặc tham chiếu trực tiếp tới state
    const confirmPassword = document.getElementById("confirmPassword").value; // Lấy giá trị từ input

    const newPasswordStrength = zxcvbn(newPassword).score;

    let newErrors = { oldPassword: "", newPassword: "", confirmPassword: "" };

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword =
        "Mật khẩu mới và xác nhận mật khẩu không khớp.";
        setErrors(newErrors);
        return;
    }

    if (!newPassword && !oldPassword && !confirmPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu.";
      newErrors.oldPassword = "Vui lòng nhập mật khẩu.";
      newErrors.confirmPassword = "Vui lòng nhập mật khẩu.";
      setErrors(newErrors);
    } else if (newPassword && !oldPassword && !confirmPassword) {
      newErrors.oldPassword ="Vui lòng nhập mật khẩu.";
      newErrors.confirmPassword = "Vui lòng nhập mật khẩu.";
      setErrors(newErrors);
    } else if (!newPassword && oldPassword && !confirmPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu.";
      newErrors.confirmPassword = "Vui lòng nhập mật khẩu.";
      setErrors(newErrors);
    } else if (!newPassword && !oldPassword && confirmPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu.";
      newErrors.oldPassword = "Vui lòng nhập mật khẩu.";
      setErrors(newErrors);
    } else if (newPassword && !oldPassword && confirmPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu.";
      setErrors(newErrors);
    } else if (!newPassword && oldPassword && confirmPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu.";
      setErrors(newErrors);
    } else if (newPassword && oldPassword && !confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập mật khẩu.";
      setErrors(newErrors);
    } else {
      if (newPasswordStrength < 2) {
        newErrors.newPassword = "Mật khẩu mới quá yếu.";
        setErrors(newErrors);
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:8080/api/doimatkhaubchtruong/${IDBCH}`,
          {
            oldPassword: oldPassword,
            newPassword: newPassword,
          }
        );

        // Xử lý kết quả từ API
        if (response.data.success) {
          setShowModalUpdate(true);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          // Thực hiện các thao tác cần thiết khi đổi mật khẩu thành công
        } else {
          const newErrors = {
            oldPassword: response.data.error,
            newPassword: "",
            confirmPassword: "",
            apiError: "", // Có thể giữ nguyên hoặc cập nhật theo yêu cầu của bạn
          };
          setErrors(newErrors);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error.message);
        const newErrors = {
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
          apiError: "Mật khẩu hiện tại không đúng", // Có thể giữ nguyên hoặc cập nhật theo yêu cầu của bạn
        };
        setErrors(newErrors);
      }
    }
  };

  const handleChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const getPasswordStrength = () => {
    const result = zxcvbn(password);
    return result.score;
  };

  const renderPasswordStrengthBar = () => {
    const strength = getPasswordStrength();
    const bars = [];
    for (let i = 0; i < 4; i++) {
      bars.push(
        <div className="strength" key={i}>
          <div className={`strength-bar ${i < strength ? "active" : ""}`}></div>
        </div>
      );
    }
    return <div className="strength-meter">{bars}</div>;
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center">Đổi mật khẩu</h2>

        <form id="customerForm" className="formAdd">
          <div className="">
            <div className="form-group form-groupMK">
              <Form.Label htmlFor="oldPassword">Mật khẩu hiện tại</Form.Label>
              <div className="password-input-container">
                <Form.Control
                  className="form-control"
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  aria-describedby="oldPassword"
                  onChange={handleChangeOldPassword}
                />
                <FontAwesomeIcon
                  icon={showOldPassword ? faEyeSlash : faEye}
                  className={`fa-eye${showOldPassword ? "-slash" : ""}`}
                  onClick={() => toggleShowPassword("old")}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                />
              </div>
              <div className="error-message">{errors.apiError}</div>
              <div className="error-message">{errors.oldPassword}</div>
            </div>
            <div className="form-group form-groupMK">
              <Form.Label htmlFor="newPassword">
                Mật khẩu mới
              </Form.Label>
              <div className="password-input-container">
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  onChange={(e) => handleChange(e)}
                  aria-describedby="newPassword"
                />
                <FontAwesomeIcon
                  icon={showNewPassword ? faEyeSlash : faEye}
                  onClick={() => toggleShowPassword("new")}
                  className={`fa-eye${showNewPassword ? "-slash" : ""}`}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                />
              </div>
              {renderPasswordStrengthBar()}
              <div className="error-message">{errors.newPassword}</div>
            </div>
            <div className="form-group form-groupMK">
              <Form.Label htmlFor="confirmPassword">
                Nhập lại mật khẩu
              </Form.Label>
              <div className="password-input-container">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  aria-describedby="confirmPassword"
                />
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  onClick={() => toggleShowPassword("confirm")}
                  className={`fa-eye${showConfirmPassword ? "-slash" : ""}`}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                />
              </div>
              <div className="error-message">{errors.confirmPassword}</div>
            </div>
          </div>
          <div className="update row">
            <div className="btns">
              <button className="allcus-button button-error" type="submit">
                <NavLink to="/BCH-DoanTruong" className="navlink">
                  Hủy
                </NavLink>
              </button>

              <button
                className="allcus-button bgcapnhat"
                type="submit"
                onClick={validatePassword}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </form>
      </div>
      <ModalSuccess
        show={showModalUpdate}
        onHide={() => setShowModalUpdate(false)}
      />
    </>
  );
};

export default PasswordStrengthMeter;
