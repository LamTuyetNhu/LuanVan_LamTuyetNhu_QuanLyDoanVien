import { NavLink, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import huyhieu from "../../assets/huyhieu.png";
import logo from "../../assets/logo.jpg";

import { laytendoanvien } from "../../services/apiService";
import { useState, useEffect } from "react";

function Header() {
  const IDDoanVien = localStorage.getItem("IDDoanVien");
  const [HoTen, setHoTen] = useState([]);
  const [TenAnh, setTenAnh] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    fetchDoanVien();
  }, [IDDoanVien]);

  const fetchDoanVien = async () => {
    try {
      let res = await laytendoanvien(IDDoanVien);
      console.log(res);

      if (res.status === 200) {
        setHoTen(res.data.dataDV.HoTen);
        setTenAnh(res.data.dataDV.TenAnh);
        setLoadingImage(false);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
        setLoadingImage(false);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <header>
      <div className="header">
        <div className="logo">
          <NavLink to={`/DoanVien`}>
            <img className="logo-img" src={huyhieu} alt="Huy hieu" />
          </NavLink>
          <NavLink to={`/DoanVien`} className="logo-content">
              Đoàn Thanh Niên
          </NavLink>
        </div>

        <div className="flex flex-mobile">
          {loadingImage ? (
            <img className="logo-img1" src={logo} alt="logo-dtn" />
          ) : (
            <img
              className="logo-img1"
              src={`http://localhost:8080/images/${TenAnh}`}
              alt="logo-dtn"
            />
          )}
          <div className="username">
            {HoTen}

            <div className="header__cart-list">
              <ul className="header__cart-list-item">
              <li className="header__cart-item">
                  <NavLink to="/DoanVien/AnhDiemDanh" className="header__cart-item-info">
                    Ảnh điểm danh
                  </NavLink>
                </li>
                <li className="header__cart-item">
                <NavLink to="/" className="header__cart-item-info " onClick={handleLogout}>
                    Đăng xuất
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
