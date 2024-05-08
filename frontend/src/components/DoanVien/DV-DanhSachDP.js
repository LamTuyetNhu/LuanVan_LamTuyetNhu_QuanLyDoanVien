import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { NavLink, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import {
  faBell,
  faEye,
  faEdit,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { namhoc, laydsdoanphicuadoanvien } from "../../services/apiService";

const DanhSachDoanPhi = (props) => {
  const IDDoanVien = localStorage.getItem("IDDoanVien");
  const navigate = useNavigate();

  const [DSDoanPhi, setDSDoanPhi] = useState([]);

  const [idnamhoc, setIDNamHoc] = useState(1);
  const [NamHoc, setNamHoc] = useState([]);

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    // Thêm logic kiểm tra hạn của token nếu cần
    return true;
  };

  useEffect(() => {
    fetchDSDoanPhi();
    fetchDSNamHoc();
    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }
  }, [IDDoanVien, idnamhoc]);

  const fetchDSDoanPhi = async () => {
    try {
      let res = await laydsdoanphicuadoanvien(IDDoanVien, idnamhoc);

      if (res.status === 200) {
        setDSDoanPhi(res.data.dataHD);
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

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Đoàn Phí</h2>

          <div className="searchDV-input">
            {" "}
            Năm học:
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
          {DSDoanPhi.length === 0 ? (
            <div className=" ">
              <p className="tablenone1">Không có đoàn phí nào.</p>
            </div>
          ) : (
            DSDoanPhi.map((doanphi, index) => (
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4 mx-auto">
                <div className="card card-opacity1">
                  <div className="card-body">
                    <h5 className="card-title card-title1">
                      {doanphi.TenDoanPhi}
                    </h5>
                    <form id="customerForm" className="">
                      <div style={{ whiteSpace: "pre-line" }}>
                        Số tiền cần đóng:{" "}
                        <b>{formatCurrency(doanphi.SoTien)}</b>
                      </div>
                      <div>
                        
                      </div>
                      <img src={require(`../../assets/${doanphi.DaDong === 0 ? "ChuaDong1" : "DaDong1"}.jpg`)} className="img-fluid img-mandel1" />
                    </form>
                    <div className="inline">
                      <p
                        style={{
                          color: doanphi.DaDong === 0 ? "red" : "green",
                          textAlign: "right",
                          marginRight: "10px",
                        }}
                      >
                        {doanphi.DaDong === 0
                          ? "Bạn chưa đóng đoàn phí"
                          : "Bạn đã đóng đoàn phí"}
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faBell} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DanhSachDoanPhi;
