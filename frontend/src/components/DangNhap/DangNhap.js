import React, { useState } from "react";
import huyhieu from "../../assets/huyhieu.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const DangNhap = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Xử lý đăng nhập ở đây, có thể sử dụng email và password
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
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
              </div>
              <div className="input-box">
                <span className="icon">
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
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
  );
};

export default DangNhap;
