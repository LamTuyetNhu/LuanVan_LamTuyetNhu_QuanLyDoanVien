import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useRef } from "react";
import { faEdit, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import {
  layTieuChiChiDoan,
  layTieuChiDoanVien,
  mauUngTuyen,
} from "../../../services/apiService";
import axios from "axios";
import Modal from "../../Modal/Modal";
import ModalUT from "../../Modal/ModalUT";

import { useNavigate } from "react-router-dom";

const SinhVienNamTot = (props) => {
  const [DSTieuChi, setDSTieuChi] = useState([]);
  const [DSTieuChiDV, setDSTieuChiDV] = useState([]);
  const [MauUngTuyen, setMauUngTuyen] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelData, setExcelData] = useState([]);
  // Add this state at the beginning of your component
  const [fileSelected, setFileSelected] = useState(false);

  const lineRef = useRef(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const navigate = useNavigate();

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

  const handleCapNhatChiDoanClick = (IDDGCD) => {
    localStorage.setItem("IDDGCD", IDDGCD);
    navigate(`/BCH-DoanTruong/CapNhatTieuChiDanhGiaChiDoan`);
  };

  const handleCapNhatDoanVienClick = (IDTieuChiDV) => {
    localStorage.setItem("IDTieuChiDV", IDTieuChiDV);
    navigate(`/BCH-DoanTruong/CapNhatTieuChiDanhGiaDoanVien`);
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

  const handleConfirmExcelData = async () => {
    try {
      setShowExcelModal(false);
      
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      let res = await axios.post(
        "http://localhost:8080/api/CapNhatMauUngTuyen",
        formData
      );


      if (res.status === 200) {
        // Thêm thành công
        setSuccessMessage("Cập nhật thành công!");
        setShowModalUpdate(true);
      } else {
        // Xử lý trường hợp lỗi
        setErrorMessage("Cập nhật thất bại!");
        setShowModalUpdate(true);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Lỗi khi tải file:", error.message);
      // setErrorMessage("Lỗi khi tải file!");
      setErrorMessage();

      setShowModalUpdate(true);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (
      file &&
      (file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setSelectedFile(file);
      setFileSelected(true); // Set the state to true when a file is selected
    } else {
      setErrorMessage("Vui lòng chọn file Word (DOC hoặc DOCX)!");
      setShowModalUpdate(true);
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

              <div>
                <div className="searchDV-Right">
                  <button
                    className="formatButton bgcapnhat"
                    onClick={() => handleCapNhatChiDoanClick(DSTieuChi.IDDGCD)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Cập nhật
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="tab-pane">
            <form id="customerForm" className="formHD">
              <div
                dangerouslySetInnerHTML={{
                  __html: DSTieuChiDV.NoiDungTC,
                }}
              ></div>

              <div>
                <div className="searchDV-Right">
                  <button
                    className="formatButton bgcapnhat"
                    onClick={() =>
                      handleCapNhatDoanVienClick(DSTieuChiDV.IDTieuChiDV)
                    }
                  >
                    <FontAwesomeIcon icon={faEdit} /> Cập nhật
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="tab-pane">
            <form id="customerForm" className="formHD">
              <div className="gachchan icon-nonePd" onClick={handleDownloadMauUngTuyen}>
              <FontAwesomeIcon icon={faCaretRight} className=""/>   Xem mẫu ứng tuyển
              </div>
              <div className="margin-top"></div>
              <div><FontAwesomeIcon icon={faEdit} className="clcapnhat"/><b className="pd-left">Đổi mẫu ứng tuyển</b></div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </form>
          </div>
        </div>
      </div>

      <div>
        {/* Display success message */}
        {successMessage && (
          <Modal
            show={showModalUpdate}
            onHide={() => {
              setShowExcelModal(false)
              setShowModalUpdate(false);
              setSuccessMessage("");
            }}
            message={successMessage}
          />
        )}

        {/* Display error message */}
        {errorMessage && (
          <Modal
            show={showModalUpdate}
            onHide={() => {
              setShowExcelModal(false)
              setShowModalUpdate(false);
              setErrorMessage("");
            }}
            message={errorMessage}
            isError={true}
          />
        )}
      </div>

      {fileSelected && (
        <ModalUT
          showModal={showExcelModal}
          onClose={() => setShowExcelModal(false)}
          excelData={excelData}
          handleConfirmExcelData={handleConfirmExcelData}
        />
      )}
    </>
  );
};

export default SinhVienNamTot;
