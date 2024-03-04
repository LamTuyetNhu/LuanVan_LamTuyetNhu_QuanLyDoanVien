import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { laytentruong, CapNhatThongTin } from "../../../services/apiService";
import ModalSuccess from "../../Modal/ModalSuccess";
import { useParams } from "react-router-dom";

import { faBackward, faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChiTietHoatDong = (props) => {
  const IDTruong = localStorage.getItem("IDTruong");
  const [ThongTin, setThongTin] = useState([]);

  const [editedThongTin, seteditedThongTin] = useState({});
  const [isEditing, setIsEditing] = useState(false);
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
    ThongTinCaNhan();
  }, [IDTruong]);

  const ThongTinCaNhan = async () => {
    try {
      let res = await laytentruong(IDTruong);

      if (res.status === 200) {
        setThongTin(res.data.dataDT);
        seteditedThongTin(res.data.dataDT);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [errors, setErrors] = useState({
    EmailTruong: "",
    TenTruong: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log("Input changed:", e.target.value);
    seteditedThongTin((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[a-zA-Z0-9._%+&-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const newErrors = {
      TenTruong: !editedThongTin.TenTruong ? "Vui lòng nhập tên trường" : "",
      EmailTruong: !editedThongTin.EmailTruong
        ? "Vui lòng nhập Email"
        : !validateEmail(editedThongTin.EmailTruong)
        ? "Email không hợp lệ!"
        : "",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      try {
        await CapNhatThongTin(editedThongTin);
        ThongTinCaNhan();

        setThongTin(editedThongTin);
        setShowModalUpdate(true);
        setIsEditing(false);
      } catch (error) {
        console.error("Lỗi khi thêm mới hoạt động:", error);
      }
    } else {
      return;
    }
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center">Cập Nhật Thông Tin</h2>

        <form id="customerForm" className="update">
          <div className="formadd">
            <Form.Label htmlFor="TenTruong" className="formadd-label">
              Tên trường
            </Form.Label>

            {isEditing ? (
              <Form.Control
                className="form-control"
                type="text"
                id="TenTruong"
                aria-describedby="TenTruong"
                value={editedThongTin.TenTruong}
                onChange={handleChange}
              />
            ) : (
              <Form.Control
                type="text"
                id="TenTruong"
                className="form-control"
                aria-describedby="TenTruong"
                value={ThongTin.TenTruong}
                onChange={handleChange}
                disabled
              />
            )}
            <div className="error-message">{errors.TenTruong}</div>
          </div>

          <div className="formadd">
            <Form.Label htmlFor="TenHoatDong" className="formadd-label">
              Email trường
            </Form.Label>

            {isEditing ? (
              <Form.Control
                className="form-control"
                type="text"
                id="EmailTruong"
                aria-describedby="EmailTruong"
                value={editedThongTin.EmailTruong}
                onChange={handleChange}
              />
            ) : (
              <Form.Control
                type="text"
                id="EmailTruong"
                className="form-control"
                aria-describedby="EmailTruong"
                value={ThongTin.EmailTruong}
                onChange={handleChange}
                disabled
              />
            )}
            <div className="error-message">{errors.EmailTruong}</div>
          </div>

          <br />
          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink to="/BCH-DoanTruong" className="navlink">
                <FontAwesomeIcon icon={faBackward} />
              </NavLink>
            </button>

            {isEditing ? (
              <>
                <button
                  className="allcus-button bgcapnhat"
                  onClick={handleSaveChanges}
                >
                  <FontAwesomeIcon icon={faSave} /> Lưu
                </button>
              </>
            ) : (
              <button
                className="allcus-button bgcapnhat"
                onClick={handleToggleEdit}
              >
                <FontAwesomeIcon icon={faEdit} /> Cập nhật
              </button>
            )}
            {/* <button className="allcus-button button-error" type="submit">
              <NavLink
                to={`/BCH-DoanTruong/DoiMatKhau`}
                className="navlink"
              >
                Đổi mật khẩu
              </NavLink>
            </button> */}
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

export default ChiTietHoatDong;
