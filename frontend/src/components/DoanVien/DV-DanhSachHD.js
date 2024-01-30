import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Form from "react-bootstrap/Form";
import {faBell,
  faEye,
  faEdit,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import {
  namhoc,
  laydshoatdongcuadoanvien,
  searchHoatDong,
} from "../../services/apiService";

const DanhSachHoatDong = (props) => {
  const IDDoanVien = localStorage.getItem("IDDoanVien");

  const [DSHoatDong, setDSHoatDong] = useState([]);

  const [idnamhoc, setIDNamHoc] = useState(1);
  const [NamHoc, setNamHoc] = useState([]);

  useEffect(() => {
    fetchDSHoatDong();
    fetchDSNamHoc();
  }, [IDDoanVien, idnamhoc]);

  const fetchDSHoatDong = async () => {
    try {
      let res = await laydshoatdongcuadoanvien(IDDoanVien, idnamhoc);

      if (res.status === 200) {
        setDSHoatDong(res.data.dataHD);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const fetchDSNamHoc = async () => {
    try {
      let res = await namhoc();
      if (res.status === 200) {
        // setListKhoa(res.data.dataNH); // Cập nhật state với danh sách khóa học
        const NamHocdata = res.data.dataNH;

        // Kiểm tra nếu khoaData là mảng trước khi cập nhật state
        if (Array.isArray(NamHocdata)) {
          setNamHoc(NamHocdata);
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

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setIDNamHoc(selectedIDNamHoc);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Hoạt Động</h2>

          <div className="searchDV-input"> Năm học:
            <select
              type="text"
              className="search_name"
              value={idnamhoc}
              onChange={handleNamHocChange}
            >  
              {NamHoc.map((item, index) => {
                return (
                  <option key={index} value={item.IDNamHoc}>
                    {item.TenNamHoc}
                  </option>
                );
              })}
            </select>
          </div>
        </div>


        <div className="row margin-top1">
        {DSHoatDong.length === 0 ? (
            <div className=" ">
              <p className="tablenone1">Không có hoạt động nào.</p>
            </div>
          ) : (
          DSHoatDong.map((hoatDong, index) => (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mx-auto">
              <div className="card card-opacity1">
                <div className="card-body">
                  <h5 className="card-title card-title1">
                    {hoatDong.TenHoatDong}
                  </h5>
                  <form id="customerForm" className="formHD">
                  <div style={{ whiteSpace: 'pre-line' }}>{hoatDong.ChiTietHD}</div>
                  </form>
                    <div className="inline">

                    <p
                        style={{
                          color: hoatDong.DaDiemDanh === 0 ? "red" : "green",
                          textAlign: "right",
                          marginRight: "10px",
                          
                        }}
                      >
                        {hoatDong.DaDiemDanh === 0 ? "Bạn chưa được điểm danh" : "Bạn đã được điểm danh"} 
                      </p> 
                      <p>

                      <FontAwesomeIcon icon={faBell} />
                      </p>
                    </div>
                </div>
              </div>
            </div>
          )))}
          
        </div>
      </div>
    </>
  );
};

export default DanhSachHoatDong;
