import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

import huyhieu from "../../assets/huyhieu.png";
import logo from "../../assets/logo.jpg";
import { laytentruongdh } from "../../services/apiService";
import { useState, useEffect } from "react";

function Truong() {
  const IDDHCT = localStorage.getItem("IDDHCT");
  const [TenTruong, setTenTruong] = useState([]);
  useEffect(() => {
    fetchTenTruong();
  }, [IDDHCT]);

  const fetchTenTruong = async () => {
    try {
      let res = await laytentruongdh(IDDHCT);
      console.log(res);

      if (res.status === 200) {
        setTenTruong(res.data.dataDT.TenTruongDH);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleHeaderClick = (e) => {
    e.stopPropagation();
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <header>
      <div className={`header ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="logo">
          <NavLink to="/DaiHocCanTho">
            <img className="logo-img" src={huyhieu} alt="Huy hieu" />
          </NavLink>
          <NavLink to="/DaiHocCanTho" className="logo-content" >
            Đoàn Thanh Niên
          </NavLink>
        </div>

        <div className="flex flex-mobile">
          <img className="logo-img1" src={logo} alt="logo-dtn" />

          <div className="username">
            Đoàn {TenTruong}
            <div className="header__cart-list">
              <ul className="header__cart-list-item">
                <li className="header__cart-item">
                  <NavLink
                    to="/DaiHocCanTho/ThongTinCaNhan"
                    className="header__cart-item-info"
                  >
                    Thông tin trường
                  </NavLink>
                </li>
                <li className="header__cart-item">
                  <NavLink
                    to="/DaiHocCanTho/DoiMatKhau"
                    className="header__cart-item-info"
                  >
                    Đổi mật khẩu
                  </NavLink>
                </li>
                <li className="header__cart-item"  onClick={handleLogout}>
                  <NavLink to="/" className="header__cart-item-info ">
                    Đăng xuất
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`contentHeader contentHeaderMb ${
          isMenuOpen ? "menu-open" : ""
        }`}
        onClick={handleHeaderClick}
      >
        <FontAwesomeIcon
          icon={faBars}
          className="menu-icon"
          onClick={toggleMenu}
        />

        <ul className="nav">
          <li className="nav-item">
            <a>
              THÔNG TIN CHUNG <FontAwesomeIcon icon={faChevronDown} />
            </a>
            <ul className="subnav">
              <li>
                <NavLink to="/DaiHocCanTho" onClick={closeMenu}>
                  Danh sách trường/ khoa
                </NavLink>
              </li>
              <li>
                <NavLink to="/DaiHocCanTho/DanhSachBCHTruong" onClick={closeMenu}>
                  Danh sách BCH trường
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/DaiHocCanTho/SinhVienNamTot"
                  onClick={closeMenu}
                >
                  Sinh viên năm tốt
                </NavLink>
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
                <NavLink to="/DaiHocCanTho/DoanPhi" onClick={closeMenu}>
                  Đoàn phí
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/DaiHocCanTho/DanhGiaTruong"
                  onClick={closeMenu}
                >
                  Đánh giá và xếp loại
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <NavLink to="/DaiHocCanTho/HoatDong" onClick={closeMenu}>
              HOẠT ĐỘNG
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Truong;
