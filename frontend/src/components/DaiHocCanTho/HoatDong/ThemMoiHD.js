import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { themHoatDongdhct } from "../../../services/apiService";
import { format, parseISO } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import ModalAddSuccess from "../../Modal/ModalAddSuccess";

import { namhoc } from "../../../services/apiService";

const ThemMoiHoatDong = (props) => {
  const IDTruong = localStorage.getItem("IDTruong");
  const navigate = useNavigate();

  const [NamHoc, setNamHoc] = useState([]);
  const [IDNamHoc, setIDNamHoc] = useState("");

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

    fetchDSNamHoc();
  }, [IDTruong]);

  const [themhoatdong, setThemhoatdong] = useState({
    TenHoatDong: "",
    NgayBatDau: "",
    NgayHetHan: "",
    ChiTietHoatDong: "",
    IDNamHoc: "",
    IDTruong: IDTruong,
  });

  const [errors, setErrors] = useState({
    TenHoatDong: "",
    NgayBatDau: "",
    NgayHetHan: "",
    ChiTietHoatDong: "",
    IDNamHoc: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setThemhoatdong((prevData) => ({
      ...prevData,
      IDNamHoc: IDNamHoc,
      [id]: value,
    }));
  };

  const isValidDate = (dateString) => {
    try {
      const parsedDate = parseISO(dateString);
      if (isNaN(parsedDate.getTime())) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const fetchDSNamHoc = async () => {
    try {
      let res = await namhoc();
      if (res.status === 200) {
        // setListKhoa(res.data.dataNH); // Cập nhật state với danh sách khóa học
        const NamHocdata = res.data.dataNH;

        // Kiểm tra nếu khoaData là mảng trước khi cập nhật state
        if (Array.isArray(NamHocdata)) {
          setNamHoc(NamHocdata);
        } else {
          console.error("Dữ liệu khóa không hợp lệ:", NamHocdata);
        }
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  // Hàm định dạng ngày thành "DD/MM/YYYY"
  const formatDate = (dateString) => {
    try {
      const parsedDate = parseISO(dateString);
      if (isNaN(parsedDate.getTime())) {
        return "";
      }
      return format(parsedDate, "dd/MM/yyyy");
    } catch (error) {
      return "";
    }
  };

  const validateNgay = (Ngay) => {
    return String(Ngay).match(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    );
  };

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      TenHoatDong: !themhoatdong.TenHoatDong
        ? "Vui lòng nhập tên hoạt động"
        : "",
      NgayBatDau: !isValidDate(themhoatdong.NgayBatDau)
        ? "Ngày bắt đầu không hợp lệ"
        : "",
      NgayHetHan: !isValidDate(themhoatdong.NgayHetHan)
        ? "Ngày kết thúc không hợp lệ"
        : "",
      ChiTietHoatDong: !themhoatdong.ChiTietHoatDong
        ? "Vui lòng nhập chi tiết hoạt động"
        : "",
      IDNamHoc: !themhoatdong.IDNamHoc ? "Vui lòng chọn năm học" : "",
    };

    if (new Date(themhoatdong.NgayHetHan) < new Date(themhoatdong.NgayBatDau)) {
      newErrors.NgayHetHan = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error(
        "Vui lòng nhập đầy đủ thông tin và kiểm tra định dạng ngày!"
      );
      return;
    }

    try {
      await themHoatDongdhct(themhoatdong);
      // Xử lý sau khi thêm thành công (chuyển hướng hoặc hiển thị thông báo)
      setShowModal(true);
      console.log("Hoạt động đã được thêm mới thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm mới hoạt động:", error);
    }
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center">Thêm Hoạt Động</h2>

        <form id="customerForm" className="update" onSubmit={handleSubmit}>
          <div className="row flex">
            <div className="col formadd">
              <Form.Label htmlFor="TenHoatDong" className="formadd-label">
                Tên hoạt động
              </Form.Label>
              <Form.Control
                type="text"
                id="TenHoatDong"
                aria-describedby="TenHoatDong"
                value={themhoatdong.TenHoatDong}
                onChange={handleChange}
              />
              <div className="error-message">{errors.TenHoatDong}</div>
            </div>
            <div className="col formadd">
              <Form.Label htmlFor="TenNamHoc">Năm học</Form.Label>
              <Form.Select
                className="form-control"
                type="text"
                id="IDNamHoc"
                aria-describedby="IDNamHoc"
                value={IDNamHoc}
                onChange={(e) => setIDNamHoc(e.target.value)}
              >
                <option value="" disabled selected>
                  Chọn năm học
                </option>
                {NamHoc.map((namhoc, index) => {
                  return (
                    <option key={index} value={namhoc.IDNamHoc}>
                      {namhoc.TenNamHoc}
                    </option>
                  );
                })}
              </Form.Select>
              <div className="error-message">{errors.IDNamHoc}</div>
            </div>
          </div>
          <div className="row flex">
            <div className="col formadd">
              <Form.Label htmlFor="NgayBatDau" className="formadd-label">
                Ngày bắt đầu
              </Form.Label>
              <Form.Control
                type="date"
                id="NgayBatDau"
                value={themhoatdong.NgayBatDau}
                onChange={handleChange}
                aria-describedby="NgayBatDau"
              />
              <div className="error-message">{errors.NgayBatDau}</div>
            </div>
            <div className="col formadd">
              <Form.Label htmlFor="NgayHetHan" className="formadd-label">
                Ngày kết thúc
              </Form.Label>
              <Form.Control
                type="date"
                id="NgayHetHan"
                aria-describedby="NgayHetHan"
                value={themhoatdong.NgayHetHan}
                onChange={handleChange}
              />
              <div className="error-message">{errors.NgayHetHan}</div>
            </div>
          </div>
          <div className="formadd">
            <Form.Label htmlFor="ChiTietHoatDong" className="formadd-label">
              Chi tiết
            </Form.Label>
            <Form.Control
              type="text"
              id="ChiTietHoatDong"
              as="textarea"
              rows={5}
              aria-describedby="ChiTietHoatDong"
              value={themhoatdong.ChiTietHoatDong}
              onChange={handleChange}
            />
            <div className="error-message">{errors.ChiTietHoatDong}</div>
          </div>{" "}
          <br />
          <div className="btns">
            <button className="allcus-button button-error" type="submit">
              <NavLink to="/DaiHocCanTho/HoatDong" className="navlink">
                Hủy
              </NavLink>
            </button>

            <button className="allcus-button" type="submit">
              Thêm mới
            </button>
          </div>
        </form>
      </div>

      <NavLink to="/DaiHocCanTho/HoatDong" className="navlink">
        <ModalAddSuccess show={showModal} onHide={() => setShowModal(false)} />
      </NavLink>
    </>
  );
};

export default ThemMoiHoatDong;
