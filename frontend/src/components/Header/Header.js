import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBars } from "@fortawesome/free-solid-svg-icons";

import huyhieu from "../../assets/huyhieu.png";
import logo from "../../assets/logo.jpg";

import { useState, useEffect } from "react";

function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    // Thêm sự kiện click cho document khi component mount
    document.addEventListener("click", closeMenu);

    // Cleanup sự kiện khi component unmount
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []); // [] đảm bảo useEffect chỉ chạy một lần khi component mount

  const handleHeaderClick = (e) => {
    // Ngăn chặn sự kiện click từ việc lan truyền đến document
    e.stopPropagation();
  };

  return (
    <header >
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
            Đoàn trường CNTT&TT
            <div className="header__cart-list">
              <ul className="header__cart-list-item">
                <li className="header__cart-item">
                  <a href="/" className="header__cart-item-info">
                    Đăng xuất
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={`contentHeader contentHeaderMb ${isMenuOpen ? "menu-open" : ""}`} onClick={handleHeaderClick}>
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
                <NavLink to="/BCH-DoanTruong">Danh sách chi đoàn</NavLink>
              </li>
              <li>
                <NavLink to="/BCH-DoanTruong/DanhSachBCH">
                  Danh sách BCH
                </NavLink>
              </li>
              <li>
                <NavLink to="/BCH-DoanTruong/SinhVienNamTot">
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
                <NavLink to="/BCH-DoanTruong/DoanPhi">Đoàn phí</NavLink>
              </li>
              {/* <li>
                <a>Khai trừ chi đoàn</a>
              </li> */}
              <li>
                <a>Đánh giá và xếp loại chi đoàn</a>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <NavLink to="/BCH-DoanTruong/HoatDong">HOẠT ĐỘNG</NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
