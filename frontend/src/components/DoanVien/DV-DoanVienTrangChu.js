import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {} from "@fortawesome/free-solid-svg-icons";
import {} from "../../services/apiService";
import nam from "../../assets/nam.png";
import nu from "../../assets/Nu.png";
import hoatdong from "../../assets/hoatdong.png";
import svnamtot from "../../assets/sv5tot.jpg";
import { laytendoanvien } from "../../services/apiService";

const DoanVienTrangChu = (props) => {
  const IDDoanVien = localStorage.getItem("IDDoanVien");
  const [GioiTinh, setGioiTinh] = useState([]);

  useEffect(() => {
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
                  <h5 className="card-title card-title1">Thông tin cá nhân</h5>

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
                  <h5 className="card-title card-title2">Hoạt động</h5>
                  <img src={hoatdong} className="img-fluid" />
                </div>
              </div>
            </NavLink>
          </div>

          {/* Cột 3: Sinh viên 5 tốt */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mx-auto">
            <NavLink to={`/DoanVien/SinhVienNamTot`} className="NavLink-item">
              <div className="card card-opacity3">
                <div className="card-body">
                  <h5 className="card-title card-title3">Sinh viên năm tốt</h5>
                  <img src={svnamtot} className="img-fluid" />
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
