import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { NavLink, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { faSave, faEdit, faBackward } from "@fortawesome/free-solid-svg-icons";
import { namhoc, LayDiemCuaMotDoanVien } from "../../../services/apiService";
import axios from "axios";
import ModalAddSuccess from "../../Modal/ModalSuccess";

const SinhVienNamTot = (props) => {
  const navigate = useNavigate();

  const IDDoanVien = localStorage.getItem("IDDoanVien");
  const idnamhoc = localStorage.getItem("IDNamHoc");

  const [DSKetQua, setDSKetQua] = useState([]);

  const [editedDoanVien, seteditedDoanVien] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [errors, setErrors] = useState({
    hk1: "",
    hk2: "",
    rl1: "",
    rl2: "",
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
    fetchDSKetQua();
  }, [IDDoanVien, idnamhoc]);

  const fetchDSKetQua = async () => {
    try {
      let res = await LayDiemCuaMotDoanVien(IDDoanVien, idnamhoc);
      if (res.status === 200) {
        const DanhGiadata = res.data.dataDG;

        setDSKetQua(DanhGiadata);
        seteditedDoanVien({
          hk1: DanhGiadata.hk1.toFixed(2),
          hk2: DanhGiadata.hk2.toFixed(2),
          rl1: DanhGiadata.rl1,
          rl2: DanhGiadata.rl2,
        });

      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const validateHK = (value) => {
    const floatValue = parseFloat(value);
    return !isNaN(floatValue) && floatValue >= 0 && floatValue <= 4;
  };

  // Hàm kiểm tra validateRL
  const validateRL = (value) => {
    const intValue = parseInt(value);
    return !isNaN(intValue) && intValue >= 0 && intValue <= 100;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    // setIsEditing(true);
    seteditedDoanVien((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    console.log("editedDoanVien:", editedDoanVien);

    const newErrors = {
      hk1: !editedDoanVien.hk1
        ? "Vui lòng nhập điểm học kỳ"
        : !validateHK(editedDoanVien.hk1)
        ? "Điểm không hợp lệ!"
        : "",
      hk2: !editedDoanVien.hk2
        ? "Vui lòng nhập điểm học kỳ"
        : !validateHK(editedDoanVien.hk2)
        ? "Điểm không hợp lệ!"
        : "",
      rl1: !editedDoanVien.rl1
        ? "Vui lòng nhập điểm rèn luyện"
        : !validateRL(editedDoanVien.rl1)
        ? "Điểm không hợp lệ!"
        : "",
      rl2: !editedDoanVien.rl2
        ? "Vui lòng nhập điểm rèn luyện"
        : !validateRL(editedDoanVien.rl2)
        ? "Điểm không hợp lệ!"
        : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const requestData = {
        hk1: editedDoanVien.hk1,
        hk2: editedDoanVien.hk2,
        rl1: editedDoanVien.rl1,
        rl2: editedDoanVien.rl2,
        idnamhoc,
        IDDoanVien,
      };

      await axios.post(
        `http://localhost:8080/api/DiemCuaMotDoanVien`,
        requestData
      );

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };

  // const handleNamHocChange = (e) => {
  //   const selectedidnamhoc = e.target.value;
  //   setNamHoc(selectedidnamhoc);
  // };

  const handleToggleEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center mg-bt">Cập Nhật Điểm Đoàn Viên</h2>

        <div id="customerForm" className="formHD">
          <div className="row formAdd margin-top">
            <div className="form-group col-12 col-md-12 col-lg-6">
              <Form.Label htmlFor="hk1">Điểm học kỳ 1</Form.Label>
              {isEditing ? (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="hk1"
                  aria-describedby="hk1"
                  value={editedDoanVien.hk1}
                  onChange={handleChange}
                />
              ) : (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="hk1"
                  aria-describedby="hk1"
                  value={
                    DSKetQua && DSKetQua.hk1 ? DSKetQua.hk1.toFixed(2) : ""
                  }
                  disabled
                />
              )}
              <div className="error-message">{errors.hk1}</div>
            </div>
            <div className="form-group col-12 col-md-12 col-lg-6">
              <Form.Label htmlFor="hk2">Điểm học kỳ 2</Form.Label>
              {isEditing ? (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="hk2"
                  aria-describedby="hk2"
                  value={editedDoanVien.hk2}
                  onChange={handleChange}
                />
              ) : (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="hk2"
                  aria-describedby="hk2"
                  value={
                    DSKetQua && DSKetQua.hk2 ? DSKetQua.hk2.toFixed(2) : ""
                  }
                  disabled
                />
              )}
              <div className="error-message">{errors.hk2}</div>
            </div>
            <div className="form-group col-12 col-md-12 col-lg-6">
              <Form.Label htmlFor="rl1">Điểm rèn luyện học kỳ 1</Form.Label>
              {isEditing ? (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="rl1"
                  aria-describedby="rl1"
                  value={editedDoanVien.rl1}
                  onChange={handleChange}
                />
              ) : (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="hrl"
                  aria-describedby="rl1"
                  value={DSKetQua.rl1}
                  disabled
                />
              )}
              <div className="error-message">{errors.rl1}</div>
            </div>
            <div className="form-group col-12 col-md-12 col-lg-6">
              <Form.Label htmlFor="rl2">Điểm rèn luyện học kỳ 2</Form.Label>
              {isEditing ? (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="rl2"
                  aria-describedby="rl2"
                  value={editedDoanVien.rl2}
                  onChange={handleChange}
                />
              ) : (
                <Form.Control
                  className="form-control"
                  type="text"
                  id="rl2"
                  aria-describedby="rl2"
                  value={DSKetQua.rl2}
                  disabled
                />
              )}
              <div className="error-message">{errors.rl2}</div>
            </div>
          </div>

          <div className="error-message">
            Kết quả đánh giá:{" "}
            {DSKetQua.PhanLoai === 1
              ? "Xuất sắc"
              : DSKetQua.PhanLoai === 2
              ? "Khá"
              : DSKetQua.PhanLoai === 3
              ? "Trung bình"
              : DSKetQua.PhanLoai === 4
              ? "Yếu kém"
              : "Chưa đánh giá"}
          </div>

          <div className="update row">
            <div className="btns">
              <button className="allcus-button" type="submit">
                <NavLink
                  to={`/BCH-DoanTruong/DanhGiaChiDoan/ChiTietDanhGia`}
                  className="navlink"
                >
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
            </div>
          </div>
        </div>
      </div>

      <ModalAddSuccess show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
};

export default SinhVienNamTot;
