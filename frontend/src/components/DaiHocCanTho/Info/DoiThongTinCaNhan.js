import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { laytentruongdh, CapNhatThongTinDHCT } from "../../../services/apiService";
import ModalSuccess from "../../Modal/ModalSuccess";
import { useParams } from "react-router-dom";

import { faBackward, faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChiTietHoatDong = (props) => {
  const navigate = useNavigate();
  const IDDHCT = localStorage.getItem("IDDHCT");
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
  }, [IDDHCT]);

  const ThongTinCaNhan = async () => {
    try {
      let res = await laytentruongdh(IDDHCT);

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
    EmailDH: "",
    TenTruongDH: "",
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
      TenTruongDH: !editedThongTin.TenTruongDH
        ? "Vui lòng nhập tên trường"
        : "",
      EmailDH: !editedThongTin.EmailDH
        ? "Vui lòng nhập Email"
        : !validateEmail(editedThongTin.EmailDH)
        ? "Email không hợp lệ!"
        : "",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      try {
        await CapNhatThongTinDHCT(editedThongTin);
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

        <form id="customerForm" className="formAdd">
          <div>
            <div className="form-group form-groupMK">
              <Form.Label htmlFor="TenTruongDH" className="formadd-label">
                Tên trường
              </Form.Label>

              {isEditing ? (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="TenTruongDH"
                  aria-describedby="TenTruongDH"
                  value={editedThongTin.TenTruongDH}
                  onChange={handleChange}
                />
              ) : (
                <Form.Control
                  type="text"
                  id="TenTruongDH"
                  className="form-control"
                  aria-describedby="TenTruongDH"
                  value={ThongTin.TenTruongDH}
                  onChange={handleChange}
                  disabled
                />
              )}
              <div className="error-message">{errors.TenTruongDH}</div>
            </div>
<br />
            <div className="form-group form-groupMK">
              <Form.Label htmlFor="TenHoatDong" className="formadd-label">
                Email trường
              </Form.Label>

              {isEditing ? (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="EmailDH"
                  aria-describedby="EmailDH"
                  value={editedThongTin.EmailDH}
                  onChange={handleChange}
                />
              ) : (
                <Form.Control
                  type="text"
                  id="EmailDH"
                  className="form-control"
                  aria-describedby="EmailDH"
                  value={ThongTin.EmailDH}
                  onChange={handleChange}
                  disabled
                />
              )}
              <div className="error-message">{errors.EmailDH}</div>
            </div>
          </div>

          <br />
          <div className="update row">

          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink to="/DaiHocCanTho" className="navlink">
                <FontAwesomeIcon icon={faBackward} />
              </NavLink>
            </button>

            {isEditing ? (
              <>
                <button className="allcus-button" onClick={handleSaveChanges}>
                  <FontAwesomeIcon icon={faSave} /> Lưu
                </button>
              </>
            ) : (
              <button className="allcus-button bgcapnhat" onClick={handleToggleEdit}>
                <FontAwesomeIcon icon={faEdit} /> Cập nhật
              </button>
            )}
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

export default ChiTietHoatDong;
