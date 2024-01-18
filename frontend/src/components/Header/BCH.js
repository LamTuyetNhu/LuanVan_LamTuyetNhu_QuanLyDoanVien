import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import huyhieu from "../../assets/huyhieu.png";
import logo from "../../assets/logo.jpg";

function Header() {
  return (
    <header>
      <div className="header">
        <div className="logo">
          <NavLink to="/BCH-DoanTruong">
            <img className="logo-img" src={huyhieu} alt="Huy hieu" />
          </NavLink>
          <NavLink to="/BCH-DoanTruong" className="logo-content">
            Đoàn Thanh Niên Trường CNTT&TT
          </NavLink>
        </div>

        <div className="flex">
          <img className="logo-img1" src={logo} alt="logo-dtn" />

          <div className="username">
            Ban Chấp Hành
            <div className="header__cart-list">
              <ul className="header__cart-list-item">
                <li className="header__cart-item">
                  <a className="header__cart-item-info">Đăng xuất</a>
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
                <NavLink to="/BCH-DoanTruong">Danh sách đoàn viên</NavLink>
              </li>
              <li>
                <NavLink to="/BCH-DoanTruong/DanhSachBCH">
                  Danh sách BCH
                </NavLink>
              </li>
              <li>
              <NavLink to="/BCH-DoanTruong/SinhVienNamTot">Sinh viên 5 tốt</NavLink>
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
                <a>Đánh giá và xếp loại đoàn viên</a>
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
