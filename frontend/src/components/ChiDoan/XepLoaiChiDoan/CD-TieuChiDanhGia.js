import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  layTieuChiChiDoan,
  layTieuChiDoanVien,
  mauUngTuyen,
} from "../../../services/apiService";
import axios from "axios";

const SinhVienNamTot = (props) => {
  const navigate = useNavigate();
  const [DSTieuChi, setDSTieuChi] = useState([]);
  const [DSTieuChiDV, setDSTieuChiDV] = useState([]);
  const [MauUngTuyen, setMauUngTuyen] = useState([]);

  const lineRef = useRef(null);

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    // Thêm logic kiểm tra hạn của token nếu cần
    return true;
  };

  useEffect(() => {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const tabs = $$(".tab-item");
    const panes = $$(".tab-pane");

    const tabActive = $(".tab-item.active");
    const line = lineRef.current; // Use the ref to get the line element

    if (line && tabActive) {
      line.style.left = tabActive.offsetLeft + "px";
      line.style.width = tabActive.offsetWidth + "px";
    }

    tabs.forEach((tab, index) => {
      var pane = panes[index];

      tab.onclick = function () {
        const activeTab = $(".tab-item.active");
        const activePane = $(".tab-pane.active");

        if (activeTab) {
          activeTab.classList.remove("active");
        }

        if (activePane) {
          activePane.classList.remove("active");
        }

        if (line && this) {
          line.style.left = this.offsetLeft + "px";
          line.style.width = this.offsetWidth + "px";
        }

        this.classList.add("active");
        pane.classList.add("active");
      };
    });

    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }
    DanhSachTieuChi();
    DanhSachTieuChiDV();
    fetchMauUngTuyen();
  }, []);

  const DanhSachTieuChi = async () => {
    try {
      let res = await layTieuChiChiDoan();
      console.log(res);

      if (res.status === 200) {
        console.log("Data from API:", res.data.dataTC);
        setDSTieuChi(res.data.dataTC[0]);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const DanhSachTieuChiDV = async () => {
    try {
      let res = await layTieuChiDoanVien();
      console.log(res);

      if (res.status === 200) {
        console.log("Data from API:", res.data.dataTC);
        setDSTieuChiDV(res.data.dataTC[0]);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const fetchMauUngTuyen = async () => {
    try {
      let res = await mauUngTuyen();
      console.log(res);
      if (res.status === 200) {
        const MauUngTuyenData = res.data.dataUT;
        const url = MauUngTuyenData[0].TenFile;

        setMauUngTuyen(url);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const handleDownloadMauUngTuyen = async () => {
    try {
      // Gửi yêu cầu HTTP để lấy thông tin mẫu ứng tuyển
      let res = await axios.get(`http://localhost:8080/files/${MauUngTuyen}`, {
        responseType: "blob", // Để xác định dữ liệu nhận được là dạng binary
      });

      console.log(res);
      // Tạo một đường link ảo để tải file
      const url = window.URL.createObjectURL(new Blob([res.data]));

      // Tạo một thẻ 'a' để kích hoạt tải về
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", MauUngTuyen); // Đặt tên file

      // Bắt đầu tải file
      document.body.appendChild(link);
      link.click();

      // Gỡ bỏ đối tượng đã tạo
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi khi tải mẫu ứng tuyển:", error.message);
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <>
      <div className="container app__content">
        <div className="namhoc-center">
          <h2 className="text-center mg-bt">
            Tiêu Chuẩn Đánh Giá
          </h2>
        </div>
        <div className="tabs">
          <div className="tab-item active">
            <i className="tab-icon fas fa-code"></i>
            Tiêu chí đánh giá chi đoàn
          </div>{" "}
          <div className="tab-item">
            <i className="tab-icon fas fa-code"></i>
            Tiêu chí đánh giá đoàn viên
          </div>
          <div className="tab-item">
            <i className="tab-icon fas fa-code"></i>
            Mẫu đánh giá
          </div>
          <div className="line" ref={lineRef}></div>
        </div>

        <div className="tab-content">
          <div className="tab-pane active">
            <form id="customerForm" className="formHD">
              <div
                dangerouslySetInnerHTML={{
                  __html: DSTieuChi.NoiDungChiDoan,
                }}
              ></div>
            </form>
          </div>

          <div className="tab-pane">
            <form id="customerForm" className="formHD">
              <div
                dangerouslySetInnerHTML={{
                  __html: DSTieuChiDV.NoiDungTC,
                }}
              ></div>
            </form>
          </div>

          <div className="tab-pane">
            <form id="customerForm" className="formHD">
              <div className="gachchan" onClick={handleDownloadMauUngTuyen}>
                Xem mẫu ứng tuyển
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinhVienNamTot;
