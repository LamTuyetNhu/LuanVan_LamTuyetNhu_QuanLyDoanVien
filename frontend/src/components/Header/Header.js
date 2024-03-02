import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faBars,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import huyhieu from "../../assets/huyhieu.png";
import logo from "../../assets/logo.jpg";
import { laytentruong } from "../../services/apiService";
import { useState, useEffect } from "react";

function Header() {
  const IDTruong = localStorage.getItem("IDTruong");
  const [TenTruong, setTenTruong] = useState([]);
  useEffect(() => {
    fetchTenTruong();
  }, [IDTruong]);

  const fetchTenTruong = async () => {
    try {
      let res = await laytentruong(IDTruong);
      console.log(res);

      if (res.status === 200) {
        setTenTruong(res.data.dataDT.TenTruong);
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
    // Xóa toàn bộ localStorage
    localStorage.clear();
    // Hoặc xóa chỉ các key cụ thể nếu cần
    // localStorage.removeItem("key1");
    // localStorage.removeItem("key2");
    // window.location.href = "/"; 
  };

  return (
    <header>
      <div className={`header ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="logo">
          <NavLink to="/BCH-DoanTruong">
            <img className="logo-img" src={huyhieu} alt="Huy hieu" />
          </NavLink>
          <NavLink to="/BCH-DoanTruong" className="logo-content">
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
                    to="/BCH-DoanTruong/ThongTinCaNhan"
                    className="header__cart-item-info"
                  >
                    Trang cá nhân
                  </NavLink>
                </li>
                <li className="header__cart-item">
                  <NavLink
                    to="/BCH-DoanTruong/DoiMatKhau"
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
                <NavLink to="/BCH-DoanTruong" onClick={closeMenu}>
                  Danh sách chi đoàn
                </NavLink>
              </li>
              <li>
                <NavLink to="/BCH-DoanTruong/DanhSachBCH" onClick={closeMenu}>
                  Danh sách BCH
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/BCH-DoanTruong/SinhVienNamTot"
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
                <NavLink to="/BCH-DoanTruong/DoanPhi" onClick={closeMenu}>
                  Đoàn phí
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/BCH-DoanTruong/DanhGiaChiDoan"
                  onClick={closeMenu}
                >
                  Đánh giá và xếp loại chi đoàn
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <NavLink to="/BCH-DoanTruong/HoatDong" onClick={closeMenu}>
              HOẠT ĐỘNG
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
