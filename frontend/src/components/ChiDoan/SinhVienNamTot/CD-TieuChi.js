import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { layTieuChi } from "../../../services/apiService";
import { useNavigate } from "react-router-dom";

const SinhVienNamTot = (props) => {
  const [DSTieuChi, setDSTieuChi] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const navigate = useNavigate();

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
    DanhSachTieuChi();
  }, []);

  const DanhSachTieuChi = async () => {
    try {
      let res = await layTieuChi();
      console.log(res);

      if (res.status === 200) {
        console.log("Data from API:", res.data.dataTC);
        setDSTieuChi(res.data.dataTC);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };

  const handleCapNhatClick = (IDTieuChi) => {
    localStorage.setItem("IDTieuChi", IDTieuChi);
    navigate(`/BCH-DoanTruong/CapNhatTieuChi`);
  };

  return (
    <>
      <div className="container app__content">
        <div className="namhoc-center">
          <h2 className="text-center mg-bt">
            Tiêu chuẩn xét chọn sinh viên năm tốt
          </h2>
        </div>
        <div className="tabs">
          {DSTieuChi.map((tieuChi, index) => (
            <div
              key={index}
              className={`tab-item ${index === activeTabIndex ? "active" : ""}`}
              onClick={() => handleTabClick(index)}
            >
              <i className="tab-icon fas fa-code"></i>
              <div
                dangerouslySetInnerHTML={{ __html: tieuChi.TenTieuChi }}
              ></div>
            </div>
          ))}
          <div className="line"></div>
        </div>

        <div className="tab-content">
          {DSTieuChi.map((tieuChi, index) => (
            <div key={index} className={`tab-pane ${index === activeTabIndex ? "active" : ""}`}>
              <h5
                dangerouslySetInnerHTML={{ __html: tieuChi.TenTieuChi }}
              ></h5>

              <form id="customerForm" className="formHD">
                <div
                  dangerouslySetInnerHTML={{
                    __html: tieuChi.NoiDungTieuChi,
                  }}
                ></div>
              </form>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SinhVienNamTot;
