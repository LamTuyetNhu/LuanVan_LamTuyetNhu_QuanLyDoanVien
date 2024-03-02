import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { laytenlop, CapNhatThongTinLop } from "../../../services/apiService";
import ModalSuccess from "../../Modal/ModalSuccess";
import { useParams } from "react-router-dom";

import { faBackward, faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChiTietHoatDong = (props) => {
  const navigate = useNavigate();
  const IDLop = localStorage.getItem("IDLop");
  const [ThongTin, setThongTin] = useState([]);

  const [editedThongTin, seteditedThongTin] = useState({});
  const [isEditing, setIsEditing] = useState(false);

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
  }, [IDLop]);

  const ThongTinCaNhan = async () => {
    try {
      let res = await laytenlop(IDLop);

      if (res.status === 200) {
        setThongTin(res.data.dataCD);
        seteditedThongTin(res.data.dataCD);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [errors, setErrors] = useState({
    EmailLop: "",
    TenLop: "",
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
      TenLop: !editedThongTin.TenLop ? "Vui lòng nhập tên lớp" : "",
      EmailLop: !editedThongTin.EmailLop
        ? "Vui lòng nhập Email"
        : !validateEmail(editedThongTin.EmailLop)
        ? "Email không hợp lệ!"
        : "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

  if (!hasErrors) {

    try {
      await CapNhatThongTinLop(editedThongTin);
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
            <Form.Label htmlFor="TenLop" className="formadd-label">
              Tên lớp
            </Form.Label>

            {isEditing ? (
              <Form.Control
                className="form-control"
                type="text"
                id="TenLop"
                aria-describedby="TenLop"
                value={editedThongTin.TenLop}
                onChange={handleChange}
              />
            ) : (
              <Form.Control
                type="text"
                id="TenLop"
                className="form-control"
                aria-describedby="TenLop"
                value={ThongTin.TenLop}
                onChange={handleChange}
                disabled
              />
            )}
            <div className="error-message">{errors.TenLop}</div>
          </div>

          <div className="formadd">
            <Form.Label htmlFor="TenHoatDong" className="formadd-label">
              Email lớp
            </Form.Label>

            {isEditing ? (
              <Form.Control
                className="form-control"
                type="text"
                id="EmailLop"
                aria-describedby="EmailLop"
                value={editedThongTin.EmailLop}
                onChange={handleChange}
              />
            ) : (
              <Form.Control
                type="text"
                id="EmailLop"
                className="form-control"
                aria-describedby="EmailLop"
                value={ThongTin.EmailLop}
                onChange={handleChange}
                disabled
              />
            )}
            <div className="error-message">{errors.EmailLop}</div>
          </div>

          <br />
          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink to="/ChiDoan" className="navlink">
                <FontAwesomeIcon icon={faBackward} />
              </NavLink>
            </button>

            {isEditing ? (
              <>
                <button className="allcus-button" onClick={handleSaveChanges} >
                  <FontAwesomeIcon icon={faSave} /> Lưu
                </button>
              </>
            ) : (
              <button className="allcus-button bgcapnhat" onClick={handleToggleEdit}>
                <FontAwesomeIcon icon={faEdit} /> Cập nhật
              </button>
            )}
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
