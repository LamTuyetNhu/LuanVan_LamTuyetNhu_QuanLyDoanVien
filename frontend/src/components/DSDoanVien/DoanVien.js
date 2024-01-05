import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { faBackward, faTrash, faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  LayMotDoanVien,
  XoaDoanVien,
  CapNhatDoanVien,
} from "../../services/apiService";
import logo from "../../assets/logo.jpg";

const DoanVien = (props) => {
  const { IDLop, IDDoanVien } = useParams();
  const [DoanVien, setDoanVien] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const [editedDoanVien, seteditedDoanVien] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    try {
      await XoaDoanVien(IDDoanVien);
      setShowModal(false);
      setShowModal1(true);

      console.log("Hoạt động đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  useEffect(() => {
    layMotDoanVien();
  }, [IDLop, IDDoanVien]);

  const layMotDoanVien = async () => {
    try {
      let res = await LayMotDoanVien(IDLop, IDDoanVien);

      if (res.status === 200) {
        setDoanVien(res.data.dataDV);
        console.log(res.data.dataDV);
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
    HoTen: "",
    MSSV: "",
    Khoa: "",
    Email: "",
    SoDT: "",
    QueQuan: "",
    GioiTinh: "",
    NgaySinh: "",
    NgayVaoDoan: "",
    MaLop: "",
    TenDanToc: "",
    TenTonGiao: "",
    TenCV: "",
  });

  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    seteditedDoanVien((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleToggleEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const newErrors = {
      MaLop: !editedDoanVien.MaLop.trim() ? "Vui lòng nhập mã lớp" : "",

      TenLop: !editedDoanVien.TenLop.trim() ? "Vui lòng nhập tên lớp" : "",
      Khoa: !editedDoanVien.Khoa.trim() ? "Vui lòng nhập khóa" : "",
      Email: !editedDoanVien.Email.trim() ? "Vui lòng nhập Email" : "",
      Email: !editedDoanVien.ttLop ? "Vui lòng chọn trạng thái" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      // Gọi API hoặc hàm cập nhật dữ liệu ở đây
      await CapNhatDoanVien(editedDoanVien);
      LayMotDoanVien();

      // Sau khi cập nhật thành công, cập nhật lại trạng thái ChiDoan và kết thúc chế độ chỉnh sửa
      setDoanVien(editedDoanVien);
      setShowModalUpdate(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };
  return (
    <>
      <div className="container-fluid app__content">
      <h2 className="text-center">Đoàn Viên</h2>
      <div className="margin-top">

        <div className="row formAdd">
          <div className="col col-2">
            <div className="avatar">
              <img className="avatar_img" src={logo} alt="" />
            </div>
          </div>
          <div className="col col-10">
            <div className="row">
              <div className="form-group col col-4">
                <Form.Label htmlFor="MaLop">Mã chi đoàn</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="MaLop"
                    aria-describedby="MaLop"
                    value={editedDoanVien.MaLop}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="MaLop"
                    aria-describedby="MaLop"
                    value={DoanVien.MaLop}
                    disabled
                  />
                )}
                <div className="error-message">{errors.MaLop}</div>
              </div>
              <div className="form-group col col-4">
                <Form.Label htmlFor="TenLop">Tên chi đoàn</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenLop"
                    aria-describedby="TenLop"
                    value={editedDoanVien.TenLop}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenLop"
                    aria-describedby="TenLop"
                    value={DoanVien.TenLop}
                    disabled
                  />
                )}
                <div className="error-message">{errors.TenLop}</div>
              </div>
              <div className="form-group col col-4">
                <Form.Label htmlFor="HoTen">Họ tên đoàn viên</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="HoTen"
                    aria-describedby="HoTen"
                    value={editedDoanVien.HoTen}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="HoTen"
                    aria-describedby="HoTen"
                    value={DoanVien.HoTen}
                    disabled
                  />
                )}
                <div className="error-message">{errors.HoTen}</div>
              </div>
              <div className="form-group col col-4">
                <Form.Label htmlFor="MSSV">Mã số sinh viên</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="MSSV"
                    aria-describedby="MSSV"
                    value={editedDoanVien.MSSV}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="MSSV"
                    aria-describedby="MSSV"
                    value={DoanVien.MSSV}
                    disabled
                  />
                )}
                <div className="error-message">{errors.MSSV}</div>
              </div>

              <div className="form-group col col-4">
                <Form.Label htmlFor="Khoa">Khóa</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="Khoa"
                    aria-describedby="Khoa"
                    value={editedDoanVien.Khoa}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="Khoa"
                    aria-describedby="Khoa"
                    value={DoanVien.Khoa}
                    disabled
                  />
                )}
                <div className="error-message">{errors.Khoa}</div>
              </div>
              <div className="form-group col col-4">
                <Form.Label htmlFor="Email">Email</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="Email"
                    aria-describedby="Email"
                    value={editedDoanVien.Email}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="Email"
                    aria-describedby="Email"
                    value={DoanVien.Email}
                    disabled
                  />
                )}
                <div className="error-message">{errors.Email}</div>
              </div>
              <div className="form-group col col-4">
                <Form.Label htmlFor="SoDT">Số điện thoại</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="SoDT"
                    aria-describedby="SoDT"
                    value={editedDoanVien.SoDT}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="SoDT"
                    aria-describedby="SoDT"
                    value={DoanVien.SoDT}
                    disabled
                  />
                )}
                <div className="error-message">{errors.SoDT}</div>
              </div>
              <div className="form-group col col-8">
                <Form.Label htmlFor="QueQuan">Quê Quán</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="QueQuan"
                    aria-describedby="QueQuan"
                    value={editedDoanVien.QueQuan}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="QueQuan"
                    aria-describedby="QueQuan"
                    value={DoanVien.QueQuan}
                    disabled
                  />
                )}
                <div className="error-message">{errors.QueQuan}</div>
              </div>
              <div className="form-group col col-4">
                <Form.Label htmlFor="GioiTinh">Giới tính</Form.Label>

                {isEditing ? (
                  <Form.Select
                    className="form-select"
                    type="text"
                    id="GioiTinh"
                    aria-describedby="GioiTinh"
                    value={editedDoanVien.GioiTinh}
                    onChange={handleChange}
                  >
                    <option value={1}>Nam</option>
                    <option value={0}>Nữ</option>
                    <option value={2}>Khác</option>

                  </Form.Select>
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="ttLop"
                    aria-describedby="ttLop"
                    value={
                      DoanVien.GioiTinh === 0
                        ? "Nữ"
                        : DoanVien.GioiTinh === 1
                        ? "Nam"
                        : "Khác"
                    }
                    disabled
                  />
                )}
                <div className="error-message">{errors.GioiTinh}</div>
          
              </div>
              <div className="form-group col col-4">
            
                <Form.Label htmlFor="NgaySinh">Ngày sinh</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="NgaySinh"
                    aria-describedby="NgaySinh"
                    value={editedDoanVien.NgaySinh}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="NgaySinh"
                    aria-describedby="NgaySinh"
                    value={
                      DoanVien && DoanVien.NgaySinh
                        ? format(new Date(DoanVien.NgaySinh), "dd/MM/yyyy")
                        : ""
                    }
                    disabled
                  />
                )}
                <div className="error-message">{errors.NgaySinh}</div>
              </div>
              <div className="form-group col col-4">
            
                <Form.Label htmlFor="NgayVaoDoan">Ngày vào đoàn</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="NgayVaoDoan"
                    aria-describedby="NgayVaoDoan"
                    value={editedDoanVien.NgayVaoDoan}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="NgayVaoDoan"
                    aria-describedby="NgayVaoDoan"
                    value={
                      DoanVien && DoanVien.NgayVaoDoan
                        ? format(new Date(DoanVien.NgayVaoDoan), "dd/MM/yyyy")
                        : ""
                    }
                    disabled
                  />
                )}
                <div className="error-message">{errors.NgayVaoDoan}</div>
              </div>
              <div className="form-group col col-4">
                <Form.Label htmlFor="TenDanToc">Dân Tộc</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenDanToc"
                    aria-describedby="TenDanToc"
                    value={editedDoanVien.TenDanToc}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenDanToc"
                    aria-describedby="TenDanToc"
                    value={DoanVien.TenDanToc}
                    disabled
                  />
                )}
                <div className="error-message">{errors.TenDanToc}</div>
              </div>
              <div className="form-group col col-4">
                <Form.Label htmlFor="TenTonGiao">Tôn giáo</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenTonGiao"
                    aria-describedby="TenTonGiao"
                    value={editedDoanVien.TenTonGiao}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenTonGiao"
                    aria-describedby="TenTonGiao"
                    value={DoanVien.TenTonGiao}
                    disabled
                  />
                )}
                <div className="error-message">{errors.TenTonGiao}</div>
              </div>
              <div className="form-group col col-4">
              <Form.Label htmlFor="TenCV">Chức vụ</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenCV"
                    aria-describedby="TenCV"
                    value={editedDoanVien.TenCV}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenCV"
                    aria-describedby="TenCV"
                    value={DoanVien.TenCV}
                    disabled
                  />
                )}
                <div className="error-message">{errors.TenCV}</div>
              </div>
  
            </div>
          </div>
        </div>
        <div className="update row">
          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink
                to={`/BCH-DoanTruong/ChiTietChiDoan/${DoanVien.IDLop}`}
                className="navlink"
              >
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
              <button className="allcus-button" onClick={handleToggleEdit}>
                <FontAwesomeIcon icon={faEdit} /> Cập nhật
              </button>
            )}

            <button
              className="allcus-button button-error"
              type="button"
              onClick={() => setShowModal(true)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton className="border-none">
          <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
          Bạn chắc chắn xóa?
        </Modal.Body>
        <Modal.Footer className="border-none">
          <button
            className="allcus-button button-error"
            onClick={() => handleDelete()}
          >
            Xóa
          </button>
          <button className="allcus-button" onClick={() => setShowModal(false)}>
            Đóng
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal1}
        onHide={() => setShowModal1(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton className="border-none">
          <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
          Xóa thành công!
        </Modal.Body>
        <Modal.Footer className="border-none">
          <NavLink
            to={`/BCH-DoanTruong/ChiTietChiDoan/${DoanVien.IDLop}`}
            className="navlink"
          >
            <button
              className="allcus-button"
              onClick={() => setShowModal1(false)}
            >
              Đóng
            </button>
          </NavLink>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DoanVien;
