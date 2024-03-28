import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { NavLink, useNavigate  } from "react-router-dom";
import Form from "react-bootstrap/Form";
import {
  faCloudArrowUp,
  faCloudArrowDown,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { namhoc, mauUngTuyen, layTieuChi } from "../../services/apiService";
import Modal from "../Modal/Modal";
import ModalPDF from "../Modal/PDF";
import ResultSVNT from "../Modal/ResultSVNT";
import axios from "axios";
import { pdfjs } from "react-pdf";

const SinhVienNamTot = (props) => {
  const IDDoanVien = localStorage.getItem("IDDoanVien");
  const navigate = useNavigate();

  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [MauUngTuyen, setMauUngTuyen] = useState([]);
  const [DSTieuChi, setDSTieuChi] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    // Thêm logic kiểm tra hạn của token nếu cần
    return true;
  };

  useEffect(() => {
    // const $ = document.querySelector.bind(document);
    // const $$ = document.querySelectorAll.bind(document);

    // const tabs = $$(".tab-item");
    // const panes = $$(".tab-pane");

    // const tabActive = $(".tab-item.active");
    // const line = $(".tabs .line");

    // line.style.left = tabActive.offsetLeft + "px";
    // line.style.width = tabActive.offsetWidth + "px";

    // tabs.forEach((tab, index) => {
    //   var pane = panes[index];

    //   tab.onclick = function () {
    //     $(".tab-item.active").classList.remove("active");
    //     $(".tab-pane.active").classList.remove("active");

    //     line.style.left = this.offsetLeft + "px";
    //     line.style.width = this.offsetWidth + "px";

    //     this.classList.add("active");
    //     pane.classList.add("active");
    //   };
    // });
    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }
    DanhSachTieuChi();
    fetchDSNamHoc();
    fetchMauUngTuyen();
  }, [IDDoanVien, idnamhoc]);

  const DanhSachTieuChi = async () => {
    try {
      let res = await layTieuChi();
      console.log(res);

      if (res.status === 200) {
        console.log("Data from API:", res.data.dataTC);
        setDSTieuChi(res.data.dataTC);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };

  const fetchDSNamHoc = async () => {
    try {
      let res = await namhoc();
      if (res.status === 200) {
        // setListKhoa(res.data.dataNH); // Cập nhật state với danh sách khóa học
        const NamHocdata = res.data.dataNH;

        // Kiểm tra nếu khoaData là mảng trước khi cập nhật state
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

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setShowExcelModal(true); // Show the modal for preview and selection
    } else {
      setErrorMessage("Vui lòng chọn file PDF!");
      setShowModalUpdate(true);
    }
  };

  const handleConfirmExcelData = async (idnamhoc) => {
    try {
      const formData = new FormData();
      formData.append("IDDoanVien", IDDoanVien);
      formData.append("idnamhoc", idnamhoc);
      formData.append("file", selectedFile);

      let res = await axios.post(
        "http://localhost:8080/api/UngTuyen",
        formData
      );

      if (res.status === 200) {
        // Thêm thành công
        setSuccessMessage("Thêm thành công!");
        setShowModalUpdate(true);
      } else {
        // Xử lý trường hợp lỗi
        setErrorMessage("Thêm không thành công!");
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

  const handleViewResultClick = () => {
    setShowResult(true);
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
            Tiêu chuẩn xét chọn sinh viên năm tốt
          </h2>
        </div>
        <div className="tabs">
          {DSTieuChi.map((tieuChi, index) => (
            <div
              key={index}
              className={`tab-item ${index === activeTabIndex ? "active" : ""}`}
              onClick={() => handleTabClick(index)}
            >
              <i className="tab-icon fas fa-code"></i>
              <div
                dangerouslySetInnerHTML={{ __html: tieuChi.TenTieuChi }}
              ></div>
            </div>
          ))}

          <div className="line"></div>
        </div>

        <div className="tab-content">
          {DSTieuChi.map((tieuChi, index) => (
            <div
              key={index}
              className={`tab-pane ${index === activeTabIndex ? "active" : ""}`}
            >
              <h5 dangerouslySetInnerHTML={{ __html: tieuChi.TenTieuChi }}></h5>

              <form id="customerForm" className="formHD">
                <div
                  dangerouslySetInnerHTML={{
                    __html: tieuChi.NoiDungTieuChi,
                  }}
                ></div>
              </form>

              <div className="tab-item active">
            <i className="tab-icon fas fa-pen-nib"></i>
            Ứng tuyển
          </div>
          <div className="tab-pane active">
            {/* <h2>Ứng tuyển</h2> */}
            <div className="margin-top">
              <div className="table-container">
                <table className="table table-striped table-svnt">
                  <tbody id="myTable">
                    <tr className="tableRow">
                      <td>Tải mẫu ứng tuyển</td>
                      <td className="col-center">
                        <FontAwesomeIcon
                          className="icon-nonePd"
                          icon={faCloudArrowDown}
                          onClick={handleDownloadMauUngTuyen}
                        />
                      </td>
                    </tr>
                    <tr className="tableRow">
                      <td>Xem kết quả ứng tuyển</td>
                      <td className="col-center">
                        <FontAwesomeIcon
                          className="icon-nonePd"
                          icon={faEye}
                          onClick={handleViewResultClick}
                        />
                      </td>
                    </tr>
                    <tr className="tableRow">
                      <td>Nộp file ứng tuyển</td>
                      <td className="col-center">
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <FontAwesomeIcon
                            className="icon-nonePd"
                            icon={faCloudArrowUp}
                            onClick={handleButtonClick}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
            </div>

            
          ))}
        </div>

      </div>

      <div>
        {/* Display success message */}
        {successMessage && (
          <Modal
            show={showModalUpdate}
            onHide={() => {
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
              setShowModalUpdate(false);
              setErrorMessage("");
            }}
            message={errorMessage}
            isError={true}
          />
        )}
      </div>

      {showExcelModal && (
        <ModalPDF
          showModal={showExcelModal}
          onClose={() => setShowExcelModal(false)}
          onConfirm={handleConfirmExcelData}
          excelData={excelData}
        />
      )}

      {showResult && (
        <ResultSVNT
          showModal={showResult}
          onClose={() => setShowResult(false)}
        />
      )}
    </>
  );
};

export default SinhVienNamTot;
