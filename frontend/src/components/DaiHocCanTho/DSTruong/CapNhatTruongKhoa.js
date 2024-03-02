import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import { NavLink, useNavigate  } from "react-router-dom";
import ModalSuccess from "../../Modal/ModalSuccess";

import {
  faBackward,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { laymottruong, CapNhatTruong } from "../../../services/apiService";
import logo from "../../../assets/logo.jpg";

const ChiTietChiDoan = (props) => {
  const navigate = useNavigate();
  const IDTruong = localStorage.getItem("IDTruong");
  const [ChiDoan, setChiDoan] = useState([]);

  const [editedChiDoan, setEditedChiDoan] = useState({});
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
    LayMotChiDoan();
  }, [IDTruong]);

  const LayMotChiDoan = async () => {
    try {
      let res = await laymottruong(IDTruong);

      if (res.status === 200) {
        console.log(res.data.dataCD);
        setChiDoan(res.data.dataCD);
        setEditedChiDoan(res.data.dataCD);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [errors, setErrors] = useState({
    TenTruong: "",
    EmailTruong: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditedChiDoan((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const [showModal, setShowModal] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const validateEmail = (Email) => {
    return String(Email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const newErrors = {
      TenTruong: !editedChiDoan.TenTruong.trim() ? "Vui lòng nhập tên lớp" : "",
      EmailTruong: !editedChiDoan.EmailTruong.trim() ? "Vui lòng nhập Email" : !validateEmail(editedChiDoan.EmailTruong) ? "Email không hợp lệ" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      // Gọi API hoặc hàm cập nhật dữ liệu ở đây
      await CapNhatTruong(IDTruong, editedChiDoan);
      LayMotChiDoan();

      // Sau khi cập nhật thành công, cập nhật lại trạng thái ChiDoan và kết thúc chế độ chỉnh sửa
      setChiDoan(editedChiDoan);
      setShowModal(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };

  return (
    <>
      <div className="container-fluid app__content">
        <h2 className="text-center">{ChiDoan.TenTruong}</h2>
        <form>
          <div className="row formAdd">
            <div className="col col-lg-2 col-md-2 col-none">
              <div className="avatar">
                <img className="avatar_img" src={logo} alt="" />
              </div>
            </div>
            <div className="col col-lg-10 col-md-10">
              <div className="row">
                <div className="form-group col-lg-12 col-md-12 col-sm-12 mb-4 mx-auto">
                  <Form.Label htmlFor="TenTruong">Tên trường/khoa</Form.Label>

                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="TenTruong"
                      aria-describedby="TenTruong"
                      value={editedChiDoan.TenTruong}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="TenTruong"
                      aria-describedby="TenTruong"
                      value={ChiDoan.TenTruong}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.TenTruong}</div>
                </div>
                <div className="form-group col-lg-12 col-md-12 col-sm-12 mb-4 mx-auto">
                  <Form.Label htmlFor="EmailTruong">Email trường/khoa</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="EmailTruong"
                      aria-describedby="EmailTruong"
                      value={editedChiDoan.EmailTruong}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="EmailTruong"
                      aria-describedby="EmailTruong"
                      value={ChiDoan.EmailTruong}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.EmailTruong}</div>
                </div>
              </div>
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
                <button className="allcus-button bgcapnhat" onClick={handleSaveChanges}>
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

        <div className="margin-bottom"></div>
      </div>

      <ModalSuccess show={showModal} onHide={() => setShowModal(false)} />
 
    </>
  );
};

export default ChiTietChiDoan;
