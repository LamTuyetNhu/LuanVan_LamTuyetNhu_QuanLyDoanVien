import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { themDoanPhi } from "../../../services/apiService";
import "react-toastify/dist/ReactToastify.css";
import ModalAddSuccess from "../../Modal/ModalAddSuccess";
import { namhoc } from "../../../services/apiService";
const ThemDoanPhi = (props) => {
  const navigate = useNavigate();
  const IDTruong = localStorage.getItem("IDTruong");

  const [NamHoc, setNamHoc] = useState([]);

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

  const fetchDSNamHoc = async () => {
    try {
      let res = await namhoc();
      if (res.status === 200) {
        const NamHocdata = res.data.dataNH;

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

  const [themdoanphi, setthemdoanphi] = useState({
    TenDoanPhi: "",
    SoTien: "",
    TenNamHoc: "",
  });

  const [errors, setErrors] = useState({
    TenDoanPhi: "",
    SoTien: "",
    TenNamHoc: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'SoTien') {
      // Kiểm tra xem value có phải là số không
      if (isNaN(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          SoTien: 'Vui lòng nhập số cho trường này',
        }));
      } else {
        // Định dạng giá trị số tiền theo Việt Nam đồng
        setthemdoanphi((prevData) => ({
          ...prevData,
          [id]: new Intl.NumberFormat('vi-VN').format(value),
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          SoTien: '',
        }));
      }
    } else if (id === 'TenNamHoc') {
      // Kiểm tra xem đã chọn năm học hay chưa
      setthemdoanphi((prevData) => ({
        ...prevData,
        [id]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        TenNamHoc: value ? '' : 'Vui lòng chọn năm học',
      }));
    } else {
      setthemdoanphi((prevData) => ({
        ...prevData,
        [id]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: value ? '' : `Vui lòng nhập ${id === 'TenDoanPhi' ? 'tên đoàn phí' : 'chi tiết số tiền'}`,
      }));
    }
    setthemdoanphi((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      TenDoanPhi: !themdoanphi.TenDoanPhi.trim() ? "Vui lòng nhập tên đoàn phí" : "",
      SoTien: !themdoanphi.SoTien ? "Vui lòng nhập số tiền" : "",
      TenNamHoc: !themdoanphi.TenNamHoc ? "Vui lòng chọn năm học" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await themDoanPhi(IDTruong, themdoanphi);
      // Xử lý sau khi thêm thành công (chuyển hướng hoặc hiển thị thông báo)
      setShowModal(true);
      console.log("Đoàn phí đã được thêm mới thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm mới đoàn phí:", error);
    }
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center">Thêm Đoàn Phí</h2>

        <form id="customerForm" className="update" onSubmit={handleSubmit}>
          <div className="formadd">
            <Form.Label htmlFor="TenDoanPhi" className="formadd-label">
              Tên đoàn phí
            </Form.Label>
            <Form.Control
              type="text"
              id="TenDoanPhi"
              aria-describedby="TenDoanPhi"
              value={themdoanphi.TenDoanPhi}
              onChange={handleChange}
              placeholder="Nhập tên đoàn phí"
            />
            <div className="error-message">{errors.TenDoanPhi}</div>
          </div>
          <div className="row flex">
            <div className="col formadd">
              <Form.Label htmlFor="SoTien" className="formadd-label">
                Số tiền
              </Form.Label>
              <Form.Control
                type="number"
                id="SoTien"
                placeholder="Nhập số tiền ..."
                aria-describedby="SoTien"
                value={themdoanphi.SoTien}
                onChange={handleChange}
              />
              <div className="error-message">{errors.SoTien}</div>
            </div>
            <div className="col searchDV-input">
              <br />
              <select id="TenNamHoc" className="search_name" value={themdoanphi.TenNamHoc}  onChange={handleChange}>
                <option value="" disabled>
                  Chọn năm học
                </option>
                {NamHoc.map((namhoc, index) => {
                  return (
                    <option key={index} value={namhoc.TenNamHoc}>
                      {namhoc.TenNamHoc}
                    </option>
                  );
                })}
              </select>
              <div className="error-message">{errors.TenNamHoc}</div>
            </div>
          </div>
          <br />
          <div className="btns">
            <button className="allcus-button button-error" type="submit">
              <NavLink to="/BCH-DoanTruong/DoanPhi" className="navlink">
                Hủy
              </NavLink>
            </button>

            <button className="allcus-button" type="submit">
              Thêm mới
            </button>
          </div>
        </form>
      </div>

      <NavLink to={`/BCH-DoanTruong/DoanPhi`} className="navlink">
        <ModalAddSuccess show={showModal} onHide={() => setShowModal(false)} />
      </NavLink>

    </>
  );
};

export default ThemDoanPhi;
