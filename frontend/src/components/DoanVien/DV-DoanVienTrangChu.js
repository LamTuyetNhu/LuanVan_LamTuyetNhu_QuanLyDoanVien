import React from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {} from "@fortawesome/free-solid-svg-icons";
import {} from "../../services/apiService";
import nam from "../../assets/nam.png";
import nu from "../../assets/Nu.png";
import hoatdong from "../../assets/hoatdong.png";
import svnamtot from "../../assets/sv5tot.jpg";
import diem from "../../assets/diem.jpg";
import tienquy from "../../assets/tienquy.png";
import matkhau from "../../assets/matkhau.png";

import { laytendoanvien } from "../../services/apiService";

const DoanVienTrangChu = (props) => {
  const navigate = useNavigate();
  const IDDoanVien = localStorage.getItem("IDDoanVien");
  const [GioiTinh, setGioiTinh] = useState([]);

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
    fetchDoanVien();
  }, [IDDoanVien]);

  const fetchDoanVien = async () => {
    try {
      let res = await laytendoanvien(IDDoanVien);
      console.log(res);

      if (res.status === 200) {
        setGioiTinh(res.data.dataDV.GioiTinh);
        console.log(res.data.dataDV.GioiTinh);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center">
        <div className="row">
          {/* Cột 1: Thông tin cá nhân */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mx-auto">
            <NavLink to={`/DoanVien/ThongTinCaNhan`} className="NavLink-item">
              <div className="card card-opacity1">
                <div className="card-body">
                  <h5 className="card-title card-title1">Thông Tin Cá Nhân</h5>

                  {GioiTinh === 0 ? (
                    <img src={nu} alt="Nữ" className="img-fluid" />
                  ) : (
                    <img src={nam} alt="Nam" className="img-fluid" />
                  )}
                </div>
              </div>
            </NavLink>
          </div>

          {/* Cột 2: Hoạt động */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mx-auto">
            <NavLink to={`/DoanVien/HoatDong`} className="NavLink-item">
              <div className="card card-opacity2">
                <div className="card-body">
                  <h5 className="card-title card-title2">Hoạt Động</h5>
                  <img src={hoatdong} className="img-fluid" />
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mx-auto">
            <NavLink to={`/DoanVien/DoanPhi`} className="NavLink-item">
              <div className="card card-opacity6">
                <div className="card-body">
                  <h5 className="card-title card-title6">Đoàn Phí</h5>
                  <img src={tienquy} className="img-fluid" />
                </div>
              </div>
            </NavLink>
          </div>
          
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mx-auto">
            <NavLink to={`/DoanVien/SinhVienNamTot`} className="NavLink-item">
              <div className="card card-opacity3">
                <div className="card-body">
                  <h5 className="card-title card-title3">Sinh Viên Năm Tốt</h5>
                  <img src={svnamtot} className="img-fluid" />
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mx-auto">
            <NavLink to={`/DoanVien/DanhGiaDoanVien`} className="NavLink-item">
              <div className="card card-opacity4">
                <div className="card-body">
                  <h5 className="card-title card-title4">Đánh Giá Đoàn Viên</h5>
                  <img src={diem} className="img-fluid img-heigh" />
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mx-auto">
            <NavLink to={`/DoanVien/DoiMatKhau`} className="NavLink-item">
              <div className="card card-opacity5">
                <div className="card-body">
                  <h5 className="card-title card-title5">Đổi Mật Khẩu</h5>
                  <img src={matkhau} className="img-fluid" />
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoanVienTrangChu;
