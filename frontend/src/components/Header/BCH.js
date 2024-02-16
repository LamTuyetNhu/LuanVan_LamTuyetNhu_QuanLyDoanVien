import { NavLink, useParams  } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import huyhieu from "../../assets/huyhieu.png";
import logo from "../../assets/logo.jpg";

import {
  laytenlop
} from "../../services/apiService"
import { useState, useEffect } from "react";

function Header() {
  // const { IDLop } = useParams();
  const IDLop = localStorage.getItem("IDLop");
  const [TenLop, setTenLop] = useState([])
  useEffect(() => {
    fetchTenLop()
  }, [IDLop])

  const fetchTenLop = async () => {
    try {
      let res = await laytenlop(IDLop);
      console.log(res);

      if (res.status === 200) {
        setTenLop(res.data.dataCD.MaLop)

      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  return (
    <header>
      <div className="header">
        <div className="logo">
          <NavLink to={`/ChiDoan`}>
            <img className="logo-img" src={huyhieu} alt="Huy hieu" />
          </NavLink>
          <NavLink to={`/ChiDoan`} className="logo-content">
            Đoàn Thanh Niên
          </NavLink>
        </div>

        <div className="flex">
          <img className="logo-img1" src={logo} alt="logo-dtn" />

          <div className="username">
            {TenLop}
            <div className="header__cart-list">
              <ul className="header__cart-list-item">
                <li className="header__cart-item">
                  <a href="/" className="header__cart-item-info">Đăng xuất</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="contentHeader">
        <ul className="nav">
          <li className="nav-item">
            <a>
              THÔNG TIN CHUNG <FontAwesomeIcon icon={faChevronDown} />
            </a>
            <ul className="subnav">
              <li>
                <NavLink to={`/ChiDoan`}>Danh sách đoàn viên</NavLink>
              </li>
              <li>
                <NavLink to={`/ChiDoan/DanhSachBCH`}>
                  Danh sách BCH
                </NavLink>
              </li>
              <li>
              <NavLink to={`/ChiDoan/DanhSachSinhVienNamTot`}>Sinh viên năm tốt</NavLink>
              </li>
            </ul>
          </li>
          <li>
            <a>
              NGHIỆP VỤ QUẢN LÝ ĐOÀN VIÊN{" "}
              <FontAwesomeIcon icon={faChevronDown} />
            </a>
            <ul className="subnav">
              <li>
              <NavLink to={`/ChiDoan/DoanPhi`}>Đoàn phí</NavLink>
              </li>
              <li>
              <NavLink to={`/ChiDoan/DanhGiaDoanVien`}>Đánh giá và xếp loại đoàn viên</NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item">

            <NavLink to={`/ChiDoan/HoatDong`}>HOẠT ĐỘNG</NavLink>

          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
