import { NavLink, useParams  } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBars } from "@fortawesome/free-solid-svg-icons";

import huyhieu from "../../assets/huyhieu.png";
import logo from "../../assets/logo.jpg";

import {
  laytenlop
} from "../../services/apiService"
import { useState, useEffect } from "react";

function Header() {
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
        setTenLop(res.data.dataCD.TenLop)

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
          <NavLink to={`/ChiDoan`}>
            <img className="logo-img" src={huyhieu} alt="Huy hieu" />
          </NavLink>
          <NavLink to={`/ChiDoan`} className="logo-content">
            Đoàn Thanh Niên
          </NavLink>
        </div>

        <div className="flex flex-mobile">
          <img className="logo-img1" src={logo} alt="logo-dtn" />

          <div className="username">
            {TenLop}
            <div className="header__cart-list">
              <ul className="header__cart-list-item">
                <li className="header__cart-item">
                  <NavLink
                    to="/ChiDoan/ThongTinCaNhan"
                    className="header__cart-item-info"
                  >
                    Trang cá nhân
                  </NavLink>
                </li>
                <li className="header__cart-item">
                  <NavLink
                    to="/ChiDoan/DoiMatKhau"
                    className="header__cart-item-info"
                  >
                    Đổi mật khẩu
                  </NavLink>
                </li>
                <li className="header__cart-item">
                  <NavLink to="/" className="header__cart-item-info "  onClick={handleLogout}>
                    Đăng xuất 
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={`contentHeader contentHeaderMb ${
          isMenuOpen ? "menu-open" : ""
        }`}
        onClick={handleHeaderClick}>
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
                <NavLink to={`/ChiDoan`} onClick={closeMenu}>Danh sách đoàn viên</NavLink>
              </li>
              <li>
                <NavLink to={`/ChiDoan/DanhSachBCH`} onClick={closeMenu}>
                  Danh sách BCH
                </NavLink>
              </li>
              <li>
              <NavLink to={`/ChiDoan/DanhSachSinhVienNamTot`} onClick={closeMenu}>Sinh viên năm tốt</NavLink>
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
              <NavLink to={`/ChiDoan/DoanPhi`} onClick={closeMenu}>Đoàn phí</NavLink>
              </li>
              <li>
              <NavLink to={`/ChiDoan/DanhGiaDoanVien`} onClick={closeMenu}>Đánh giá và xếp loại đoàn viên</NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item">

            <NavLink to={`/ChiDoan/HoatDong`} onClick={closeMenu}>HOẠT ĐỘNG</NavLink>

          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
