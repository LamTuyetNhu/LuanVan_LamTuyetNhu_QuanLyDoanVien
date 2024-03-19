import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { useNavigate, NavLink } from "react-router-dom";
import Modal from "../../Modal/Modal";
import ExcelDataModal from "../../Modal/ExcelDataModal";

import {
  faCloudArrowUp,
  faCloudArrowDown,
  faMagnifyingGlass,
  faChevronRight,
  faChevronLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  laytatcatruong,
  laydsBCHTruong,
  chucvu,
  searchBCHTruong,
  namhoc,
  searchManyBCH,
} from "../../../services/apiService";
import axios from "axios";

const DanhSachBCH = (props) => {
  const navigate = useNavigate();
  const IDBCH = localStorage.getItem("IDBCH");

  const [DoanVien, setDoanVien] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [DSKhoa, setKhoa] = useState([]);
  const [DSChucVu, setListChucVu] = useState([]);
  const [IDTruong, setTruong] = useState(4);
  const [DSTruong, setDSTruong] = useState([]);
  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);

  const [searchMany, setsearchMany] = useState({
    info: "",
  });
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

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
    fetchDoanVien();
    fetchDSChucVu();
    fetchDSNamHoc();
    fetchAllData();
    fetchDSTruong();
    setSearchData((prevSearchData) => ({
      ...prevSearchData,
      IDNamHoc: idnamhoc,
    }));
  }, [currentPage, idnamhoc, IDTruong]);

  const fetchDoanVien = async () => {
    try {
      let res = await laydsBCHTruong(currentPage, idnamhoc, IDTruong);
      console.log(res);
      if (res.status === 200) {
        setDoanVien(res.data.dataCD);
        setTotalPages(res.data.totalPages);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const fetchDSChucVu = async () => {
    try {
      let res = await chucvu();
      if (res.status === 200) {
        const khoaData = res.data.dataCV;

        if (Array.isArray(khoaData)) {
          setListChucVu(khoaData);
        } else {
          console.error("Dữ liệu khóa không hợp lệ:", khoaData);
        }
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const fetchDSTruong = async () => {
    try {
      let res = await laytatcatruong();

      if (res.status === 200) {
        setDSTruong(res.data.dataCD);
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleManySearchBCH = async () => {
    try {
      const trimmedInfo = searchMany.info.trim().toLowerCase();
      let res = await searchManyBCH({
        trimmedInfo,
        IDNamHoc: idnamhoc,
        IDTruong: IDTruong,
      }); // Assuming you have implemented the search API
      console.log(res);
      if (res.status === 200) {
        setDoanVien(res.data.dataCD);
      } else {
        console.error("Lỗi khi tìm kiếm:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error.message);
    }
  };

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setNamHoc(selectedIDNamHoc);
  };

  const [searchData, setSearchData] = useState({
    IDNamHoc: idnamhoc,
    MaBCH: "",
    TenBCH: "",
    IDChucVu: "",
  });

  const handleSearch = async () => {
    try {
      const trimmedMSSV = searchData.MaBCH.trim().toLowerCase();
      const trimmedHoTen = searchData.TenBCH.trim().toLowerCase();

      let res = await searchBCHTruong({
        ...searchData,
        MaBCH: trimmedMSSV,
        TenBCH: trimmedHoTen,
        IDTruong: IDTruong,
      }); // Assuming you have implemented the search API

      console.log(res);
      if (res.status === 200) {
        setDoanVien(res.data.dataCD);
      } else {
        console.error("Lỗi khi tìm kiếm:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error.message);
    }
  };

  const [allData, setAllData] = useState([]);

  const fetchAllData = async () => {
    try {
      let allDataArray = [];

      for (let page = 1; page <= totalPages; page++) {
        let res = await laydsBCHTruong(page, idnamhoc, IDTruong);

        if (res.status === 200) {
          allDataArray = [...allDataArray, ...res.data.dataCD];
        } else {
          console.error("Lỗi khi gọi API:", res.statusText);
        }
      }

      setAllData(allDataArray);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const exportToExcel = async () => {
    await fetchAllData();

    const dataToExport = allData.map((item) => {
      return {
        "Tên Trường": item.TenTruong,
        "Mã cán bộ": item.MaBCH,
        "Họ tên": item.TenBCH,
        Email: item.EmailBCH,
        "Số điện thoại": item.SoDTBCH,
        "Giới tính":
          item.GioiTinhBCH === 0
            ? "Nữ"
            : item.GioiTinhBCH === 1
            ? "Nam"
            : "Khác",
        "Quê quán": item.QueQuanBCH,
        "Dân tộc": item.TenDanToc,
        "Tôn giáo": item.TenTonGiao,
        "Ngày sinh": format(new Date(item.NgaySinhBCH), "dd/MM/yyyy"),
        "Ngày vào đoàn": format(new Date(item.NgayVaoDoanBCH), "dd/MM/yyyy"),
        "Chức vụ": item.TenCV
      };
    });

    // Tạo một đối tượng Workbook từ mảng dữ liệu
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachBCH");

    // Xuất file Excel
    XLSX.writeFile(wb, "DanhSachBCH.xlsx");
  };

  const handleViewButtonClick = (itemID) => {
    localStorage.setItem("IDBCH", itemID);
    navigate(`/BCH-DoanTruong/DanhSachBCHTruong/BCHTruong`);
  };

  const handleTruongChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setTruong(selectedIDNamHoc);
  };

  const handleAddButtonClick = (itemID) => {
    localStorage.setItem("IDTruong", IDTruong);
    navigate(`/BCH-DoanTruong/ThemBCH`);
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    try {
      const selectedFile = event.target.files[0];

      // Sử dụng thư viện XLSX để đọc dữ liệu từ file Excel
      const workbook = XLSX.read(await selectedFile.arrayBuffer(), {
        type: "array",
      });
      const sheetName = workbook.SheetNames[0];
      const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      setSelectedFile(selectedFile);
      const displayedData = excelData.slice(0, 10);

      // Lưu trữ dữ liệu Excel để thực hiện thêm vào cơ sở dữ liệu
      setExcelData(displayedData);
      setShowExcelModal(true);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Lỗi khi đọc file Excel:", error.message);
      setErrorMessage("Lỗi khi đọc file Excel!");
      setShowModalUpdate(true);
    }
  };

  const handleConfirmExcelData = async (idnamhoc) => {
    console.log("Updated Excel Data:", excelData);
    console.log("Selected Nam Hoc:", idnamhoc);

    // Gọi API hoặc thực hiện các bước cần thiết
    try {
      const formData = new FormData();
      formData.append("IDTruong", IDTruong);
      formData.append("idnamhoc", idnamhoc);

      formData.append("file", selectedFile);

      let res = await axios.post(
        "http://localhost:8080/api/ThemBCHExcel",
        formData
      );

      if (res.status === 200) {
        // Thêm thành công
        setSuccessMessage("Thêm thành công!");
        setShowModalUpdate(true);
        fetchDoanVien();
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
    }
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Ban Chấp Hành</h2>
          <div className="searchDV-input">
            Năm học:
            <select
              type="text"
              className="search_name"
              value={idnamhoc}
              onChange={handleNamHocChange}
            >
              {DSNamHoc.map((item, index) => {
                return (
                  <option key={index} value={item.IDNamHoc}>
                    {item.TenNamHoc}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="search">
          <div className="searchDV laptop">
            <div className="">
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Mã BCH"
                  value={searchData.MaBCH}
                  onChange={(e) => {
                    setSearchData({ ...searchData, MaBCH: e.target.value });
                  }}
                />
              </div>
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Tên BCH"
                  value={searchData.TenBCH}
                  onChange={(e) => {
                    setSearchData({ ...searchData, TenBCH: e.target.value });
                  }}
                />
              </div>
              <div className="searchDV-input">
                <select
                  type="text"
                  className="search_name"
                  value={searchData.IDChucVu}
                  onChange={(e) => {
                    setSearchData({ ...searchData, IDChucVu: e.target.value });
                  }}
                >
                  <option value="" disabled selected>
                    Chọn chức vụ
                  </option>
                  {DSChucVu.map((item, index) => {
                    return (
                      <option key={index} value={item.IDChucVu}>
                        {item.TenCV}
                      </option>
                    );
                  })}
                </select>
              </div>
              <button className="formatButton" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
            <div className="buttonSearch">
              <div>

              <button
                className="formatButton"
                onClick={() => handleAddButtonClick(IDTruong)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button className="formatButton" onClick={handleButtonClick}>
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                </button>
              </div>

              <div>
                
              <button className="formatButton" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faCloudArrowDown} />
              </button>
                </div>
            </div>
          </div>

          <div className="searchDV tablet-mobile">
            <div className="searchDV-Right">
              <button
                className="formatButton"
                onClick={() => handleAddButtonClick(IDTruong)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button className="formatButton" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faCloudArrowDown} />
              </button>
            </div>

            <div className="">
              <div className="searchDV-input ">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Tìm theo mã, tên, chức vụ"
                  value={searchData.info}
                  onChange={(e) => {
                    setsearchMany({ info: e.target.value });
                  }}
                />
              </div>

              <button className="formatButton" onClick={handleManySearchBCH}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </div>
        </div>

        <div className="listDV">
          <div className="table-container">
            <div className="giang-vien-container">
              <div className="container">
                <div className="row giang-vien-items">
                  {DoanVien &&
                    DoanVien.length > 0 &&
                    DoanVien.map((item, index) => {
                      return (
                        <div className="col-lg-3 col-md-6 col-sm-6 giang-vien-col lazy">
                          {/* <NavLink
                            to={`/BCH-DoanTruong/DanhSachBCH/${idnamhoc}/${item.IDDoanVien}`}
                            className="NavLink-item"
                          > */}
                          <div
                            className="giang-vien-item"
                            onClick={() => handleViewButtonClick(item.IDBCH)}
                          >
                            <div className="gv-image img-hover-zoom gv1">
                              <a>
                                <img
                                  src={`http://localhost:8080/images/${item.TenAnhBCH}`}
                                />
                              </a>
                            </div>
                            <div className="gv-body">
                              <div className="giang-vien-subtitle">
                                {item.MaBCH}
                              </div>
                              <div className="giang-vien-title">
                                <a>{item.TenBCH}</a>
                              </div>
                              <p>{item.TenCV}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {DoanVien && DoanVien.length === 0 && (
                    <tr className="tablenone">
                      <td className="tablenone">Không có ban chấp hành nào!</td>
                    </tr>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {DoanVien && DoanVien.length > 0 && (
        <div className="pagination pagination1">
          <button
            className="btn-footer"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {totalPages > 4 && currentPage > 3 && (
            <div className="footer">
              <span className="ellipsis"></span>
            </div>
          )}

          {Array.from(
            { length: totalPages > 4 ? 3 : totalPages },
            (_, index) => {
              let pageToShow;
              if (totalPages <= 4) {
                pageToShow = index + 1;
              } else if (currentPage <= 3) {
                pageToShow = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 2 + index;
              } else {
                pageToShow = currentPage - 1 + index;
              }

              return (
                <div className="footer" key={index}>
                  <button
                    className={`btn-footer ${
                      currentPage === pageToShow ? "active" : ""
                    }`}
                    onClick={() => changePage(pageToShow)}
                    disabled={currentPage === pageToShow}
                  >
                    {pageToShow}
                  </button>
                </div>
              );
            }
          )}

          {totalPages > 4 && currentPage < totalPages - 2 && (
            <div className="footer">
              <span className="ellipsis"></span>
            </div>
          )}

          <button
            className="btn-footer"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}

      {DoanVien && DoanVien.length <= 5 && (
        <div className="pagination pagination1">
          {/* You can add some message or content indicating that pagination is not shown */}
        </div>
      )}

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
        <ExcelDataModal
          excelData={excelData}
          onClose={() => setShowExcelModal(false)}
          onConfirm={handleConfirmExcelData}
          selectedFile={selectedFile}
        />
      )}

    </>
  );
};

export default DanhSachBCH;
