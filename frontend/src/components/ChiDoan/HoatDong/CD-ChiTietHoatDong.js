import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import {
  LayMotHoatDong,
} from "../../../services/apiService";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useHistory } from "react-router-dom";

import {
  faBackward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChiTietHoatDong = (props) => {
  const navigate = useNavigate();

  const {  IDHoatDong } = useParams();
  const IDLop = localStorage.getItem("IDLop");

  const [HoatDong, setHoatDong] = useState([]);

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
    layMotHoatDong();
  }, [IDHoatDong]);

  const layMotHoatDong = async () => {
    try {
      let res = await LayMotHoatDong(IDHoatDong);

      if (res.status === 200) {
        setHoatDong(res.data.dataHD);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center">{HoatDong.TenHoatDong}</h2>

        <form id="customerForm" className="update">
          <div className="formadd">
            <Form.Label htmlFor="TenHoatDong" className="formadd-label">
              Tên hoạt động
            </Form.Label>

           
              <Form.Control
                type="text"
                id="TenHoatDong"
                aria-describedby="TenHoatDong"
                value={HoatDong.TenHoatDong}
                disabled
              />

          </div>
          <div className="row flex">
            <div className="col formadd">
              <Form.Label htmlFor="NgayBanHanh" className="formadd-label">
                Ngày bắt đầu
              </Form.Label>

         
                <Form.Control
                  type="text"
                  id="NgayBanHanh"
                  aria-describedby="NgayBanHanh"
                  value={HoatDong.NgayBanHanh}
                  disabled
                />
            </div>
            <div className="col formadd">
              <Form.Label htmlFor="NgayHetHan" className="formadd-label">
                Ngày kết thúc
              </Form.Label>

             
                <Form.Control
                  type="text"
                  id="NgayHetHan"
                  aria-describedby="NgayHetHan"
                  value={HoatDong.NgayHetHan}
                  disabled
                />
            </div>
          </div>
          <div className="formadd">
            <Form.Label htmlFor="ChiTietHD" className="formadd-label">
              Chi tiết
            </Form.Label>

           
              <Form.Control
                type="text"
                id="ChiTietHD"
                as="textarea"
                rows={5}
                aria-describedby="ChiTietHD"
                value={HoatDong.ChiTietHD}
                disabled
              />
          </div>
          <br />
          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink to={`/ChiDoan/HoatDong`} className="navlink">
                <FontAwesomeIcon icon={faBackward} />
              </NavLink>
            </button>
          </div>
        </form>
      </div>

   
    </>
  );
};

export default ChiTietHoatDong;
