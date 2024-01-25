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
  const { IDLop } = useParams();
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
          <NavLink to={`/ChiDoan/${IDLop}`}>
            <img className="logo-img" src={huyhieu} alt="Huy hieu" />
          </NavLink>
          <NavLink to={`/ChiDoan/${IDLop}`} className="logo-content">
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
                <NavLink to={`/ChiDoan/${IDLop}`}>Danh sách đoàn viên</NavLink>
              </li>
              <li>
                <NavLink to={`/ChiDoan/${IDLop}/DanhSachBCH`}>
                  Danh sách BCH
                </NavLink>
              </li>
              <li>
              <NavLink to={`/ChiDoan/${IDLop}/DanhSachSVNamTot`}>Sinh viên 5 tốt</NavLink>
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
              <NavLink to={`/ChiDoan/${IDLop}/DoanPhi`}>Đoàn phí</NavLink>
              </li>
              <li>
                <a>Đánh giá và xếp loại đoàn viên</a>
              </li>
            </ul>
          </li>
          <li className="nav-item">

            <NavLink to={`/ChiDoan/${IDLop}/HoatDong`}>HOẠT ĐỘNG</NavLink>

          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
