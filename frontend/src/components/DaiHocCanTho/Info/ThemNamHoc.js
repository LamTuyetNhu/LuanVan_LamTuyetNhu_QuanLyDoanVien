import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemNamHoc, namhoc, XoaNamHoc } from "../../../services/apiService";
import ModalSuccess from "../../Modal/ModalSuccess";
import DeleteSuccess from "../../Modal/DeleteSuccess";
import { useParams } from "react-router-dom";

import { faBackward, faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChiTietHoatDong = (props) => {
  const navigate = useNavigate();
  const IDDHCT = localStorage.getItem("IDDHCT");
  const [DSNamHoc, setDSNamHoc] = useState([]);
  const [editedThongTin, seteditedThongTin] = useState({});
  const [showModal2, setShowModal2] = useState(false);

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
    fetchDSNamHoc();
  }, [IDDHCT]);

  const fetchDSNamHoc = async () => {
    try {
      let res = await namhoc();
      if (res.status === 200) {
        const NamHocdata = res.data.dataNH;
        console.log(NamHocdata);
        if (Array.isArray(NamHocdata)) {
          setDSNamHoc(NamHocdata);
        } else {
          console.error("Dữ liệu khóa không hợp lệ:", NamHocdata);
        }
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [errors, setErrors] = useState({
    TenNamHoc: "",
  });

  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const kiemTraChuoi = (chuoi) => {
    return String(chuoi)
      .toLowerCase()
      .match(/^\d{4}-\d{4}$/);
  };

  const soSanhHaiSo = (chuoi) => {
    // Tách chuỗi thành hai phần: bốn số đầu và bốn số cuối
    const [soDau, soCuoi] = chuoi.split("-");

    // Chuyển đổi chuỗi số thành số nguyên
    const soDauInt = parseInt(soDau, 10);
    const soCuoiInt = parseInt(soCuoi, 10);

    // Kiểm tra xem số đầu có bằng số cuối cộng một không
    if (soDauInt + 1 === soCuoiInt) {
      return 1;
    } else {
      return 0;
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const newErrors = {
      TenNamHoc: !editedThongTin.TenNamHoc
        ? "Vui lòng nhập tên năm học!"
        : !kiemTraChuoi(editedThongTin.TenNamHoc)
        ? "Tên năm học có định dạng là: yyyy-yyyy"
        : soSanhHaiSo(editedThongTin.TenNamHoc) !== 1
        ? "Năm đầu phải nhỏ hơn năm cuối 1 đơn vị"
        : "",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      try {
        const res = await ThemNamHoc(editedThongTin);
        navigate("/DaiHocCanTho/ThemMoiNamHoc");
        setShowModalUpdate(true);
      } catch (error) {
        console.error("Lỗi khi thực hiện yêu cầu:", error);
        alert("Năm học đã tồn tại!");
      }
    }
  };

  const handleDisplayButtonClick = async (itemID) => {
    try {
      await XoaNamHoc(itemID);
      // navigate("/DaiHocCanTho/ThemMoiNamHoc");
      fetchDSNamHoc()
      setShowModal2(true);
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  return (
    <>
      <div className="container app__content">
        <div className="row">
          <div className="col-md-4">
            <nav class="category">
              <h2 className="category__heading">Năm Học</h2>

              <ul class="category-list">
                {DSNamHoc.map((namHoc) => (
                  <li
                    key={namHoc.IDNamHoc}
                    class="category-item category-item--active"
                  >
                    {namHoc.TenNamHoc}
                    <button
                      className="category-item-delete"
                      onClick={() => handleDisplayButtonClick(namHoc.IDNamHoc)}
                    >
                      <FontAwesomeIcon icon={faX} />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-md-8">
            <h2 className="text-center text-center-mb">Thêm Mới Năm Học</h2>
            <form onSubmit={handleSaveChanges}>
              <div className="form-group">
                <label htmlFor="TenNamHoc">Tên năm học</label>
                <input
                  type="text"
                  className="form-control"
                  id="TenNamHoc"
                  value={editedThongTin.TenNamHoc || ""}
                  onChange={(e) =>
                    seteditedThongTin({
                      ...editedThongTin,
                      TenNamHoc: e.target.value,
                    })
                  }
                />
                <div className="error-message">{errors.TenNamHoc}</div>
                <div id="errorMessage"></div>
              </div>
              <div className="update row">
                <div className="btns">
                  <button className="allcus-button">
                    <NavLink to="/DaiHocCanTho" className="navlink">
                      <FontAwesomeIcon icon={faBackward} />
                    </NavLink>
                  </button>
                  <button className="allcus-button" type="submit">
                    <FontAwesomeIcon icon={faSave} /> Lưu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ModalSuccess
          show={showModalUpdate}
          onHide={() => setShowModalUpdate(false)}
        />

        <DeleteSuccess show={showModal2} onHide={() => setShowModal2(false)} />
      </div>
    </>
  );
};

export default ChiTietHoatDong;
