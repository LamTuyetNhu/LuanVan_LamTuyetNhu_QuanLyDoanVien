import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import ModalSuccess from "../../Modal/ModalSuccess";

import {
  faPlus,
  faBackward,
  faTrash,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { laymotchidoan, CapNhatChiDoan } from "../../../services/apiService";
import logo from "../../../assets/logo.jpg";

const ChiTietChiDoan = (props) => {
  const { IDLop } = useParams();
  const [ChiDoan, setChiDoan] = useState([]);

  const [editedChiDoan, setEditedChiDoan] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    LayMotChiDoan();
  }, [IDLop]);

  const LayMotChiDoan = async () => {
    try {
      let res = await laymotchidoan(IDLop);

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
    MaLop: "",
    TenLop: "",
    Khoa: "",
    EmailLop: "",
    ttLop: "",
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
      MaLop: !editedChiDoan.MaLop.trim() ? "Vui lòng nhập mã lớp" : "",

      TenLop: !editedChiDoan.TenLop.trim() ? "Vui lòng nhập tên lớp" : "",
      Khoa: !editedChiDoan.Khoa.trim() ? "Vui lòng nhập khóa" : "",
      EmailLop: !editedChiDoan.EmailLop.trim() ? "Vui lòng nhập Email" : !validateEmail(editedChiDoan.EmailLop) ? "Email không hợp lệ" : "",
      ttLop: !editedChiDoan.ttLop ? "Vui lòng chọn trạng thái" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      // Gọi API hoặc hàm cập nhật dữ liệu ở đây
      await CapNhatChiDoan(editedChiDoan);
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
        <h2 className="text-center">{ChiDoan.TenLop}</h2>
        <form>
          <div className="row formAdd">
            <div className="col col-2">
              <div className="avatar">
                <img className="avatar_img" src={logo} alt="" />
              </div>
            </div>
            <div className="col col-10">
              <div className="row">
                <div className="form-group col col-6">
                  <Form.Label htmlFor="MaLop">Mã chi đoàn</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="MaLop"
                      aria-describedby="MaLop"
                      value={editedChiDoan.MaLop}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="MaLop"
                      aria-describedby="MaLop"
                      value={ChiDoan.MaLop}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.MaLop}</div>
                </div>
                <div className="form-group col col-6">
                  <Form.Label htmlFor="TenLop">Tên chi đoàn</Form.Label>

                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="TenLop"
                      aria-describedby="TenLop"
                      value={editedChiDoan.TenLop}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="TenLop"
                      aria-describedby="TenLop"
                      value={ChiDoan.TenLop}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.TenLop}</div>
                </div>
                <div className="form-group col col-6">
                  <Form.Label htmlFor="EmailLop">Email</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="EmailLop"
                      aria-describedby="EmailLop"
                      value={editedChiDoan.EmailLop}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="EmailLop"
                      aria-describedby="EmailLop"
                      value={ChiDoan.EmailLop}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.EmailLop}</div>
                </div>
                <div className="form-group col col-6">
                  <div className="flex row">
                    <div className="col col-6">
                      <Form.Label htmlFor="Khoa">Khóa</Form.Label>

                      {isEditing ? (
                        <Form.Control
                          className="form-control"
                          type="text"
                          id="Khoa"
                          aria-describedby="Khoa"
                          value={editedChiDoan.Khoa}
                          onChange={handleChange}
                        />
                      ) : (
                        <Form.Control
                          className="form-control"
                          type="text"
                          id="Khoa"
                          aria-describedby="Khoa"
                          value={ChiDoan.Khoa}
                          disabled
                        />
                      )}
                      <div className="error-message">{errors.Khoa}</div>
                    </div>
                    <div className="col col-6">
                      <Form.Label htmlFor="ttLop">Trạng thái</Form.Label>

                      {isEditing ? (
                        <Form.Select
                          className="form-select"
                          type="text"
                          id="ttLop"
                          aria-describedby="ttLop"
                          value={editedChiDoan.ttLop}
                          onChange={handleChange}
                        >
                          <option value={1}>Đang hoạt động</option>
                          <option value={0}>Ngừng hoạt động</option>
                        </Form.Select>
                      ) : (
                        <Form.Control
                          className="form-control"
                          type="text"
                          id="ttLop"
                          aria-describedby="ttLop"
                          value={
                            ChiDoan.ttLop === 1
                              ? "Đang hoạt động"
                              : "Ngừng hoạt động"
                          }
                          disabled
                        />
                      )}
                      <div className="error-message">{errors.ttChiDoan}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        </form>
      </div>

      <ModalSuccess show={showModal} onHide={() => setShowModal(false)} />
 
    </>
  );
};

export default ChiTietChiDoan;
