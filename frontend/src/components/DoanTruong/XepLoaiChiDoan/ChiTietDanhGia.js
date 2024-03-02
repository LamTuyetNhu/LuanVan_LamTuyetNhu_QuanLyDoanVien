import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "../../Modal/Modal";

import axios from "axios";
import {
  faEye,
  faPlus,
  faCloudArrowUp,
  faCloudArrowDown,
  faMagnifyingGlass,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  searchDGDoanVien,
  searchManyDoanVien,
  chucvu,
  DSDanhGiaDoanVienCuaLop,
} from "../../../services/apiService";

const DanhSachDoanVien = (props) => {
  const IDLop = localStorage.getItem("IDLop");
  const IDNamHoc = localStorage.getItem("IDNamHoc");

  const navigate = useNavigate();

  const [DSDoanVien, setListDoanVien] = useState([]);
  const [DSPhanLoai, setDSPhanLoai] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchData, setSearchData] = useState({
    IDLop: IDLop,
    MSSV: "",
    HoTen: "",
    IDNamHoc: IDNamHoc,
    PhanLoai: "",
  });

  const [searchMany, setsearchMany] = useState({
    info: "",
    IDLop: IDLop,
    IDNamHoc: IDNamHoc,
  });

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
    fetchDSDoanVien();
    fetchAllData();
  }, [IDLop, currentPage, totalPages]);

  const fetchDSDoanVien = async () => {
    try {
      let res = await DSDanhGiaDoanVienCuaLop(IDLop, currentPage, IDNamHoc);

      if (res.status === 200) {
        setListDoanVien(res.data.dataDG);
        setTotalPages(res.data.totalPages);
        setDSPhanLoai(res.data.phanLoaiCounts);
      } else {
        alert("Chưa có đoàn viên thuộc cho đoàn này!")
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const trimmedMSSV = searchData.MSSV.trim().toLowerCase();
      const trimmedHoTen = searchData.HoTen.trim().toLowerCase();

      let res = await searchDGDoanVien({
        ...searchData,
        MSSV: trimmedMSSV,
        HoTen: trimmedHoTen,
        IDNamHoc: IDNamHoc,
      });

      console.log(res);
      if (res.status === 200) {
        setListDoanVien(res.data.dataCD);
      } else {
        console.error("Lỗi khi tìm kiếm:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error.message);
    }
  };

  const handleManySearch = async () => {
    try {
      const trimmedInfo = searchMany.info.trim().toLowerCase();
      let res = await searchManyDoanVien({
        IDLop: IDLop,
        trimmedInfo,
        IDNamHoc: IDNamHoc,
      }); // Assuming you have implemented the search API
      console.log(res);
      if (res.status === 200) {
        setListDoanVien(res.data.dataCD);
      } else {
        console.error("Lỗi khi tìm kiếm:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error.message);
    }
  };

  const changePage = (newPage) => {
    setCurrentPage(newPage);
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

  const [allData, setAllData] = useState([]);

  const fetchAllData = async () => {
    try {
      let allDataArray = [];

      // Lặp qua tất cả các trang
      for (let page = 1; page <= totalPages; page++) {
        let res = await DSDanhGiaDoanVienCuaLop(IDLop, page, IDNamHoc);

        if (res.status === 200) {
          // Tích hợp dữ liệu từ trang hiện tại vào mảng
          allDataArray = [...allDataArray, ...res.data.dataDG];
        } else {
          // Xử lý trường hợp lỗi
          console.error("Lỗi khi gọi API:", res.statusText);
        }
      }

      // Cập nhật mảng dữ liệu chung
      setAllData(allDataArray);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const exportToExcel = async () => {
    // Tạo một mảng chứa dữ liệu bạn muốn xuất
    try {
      await fetchAllData();

      const dataToExport = allData.map((item) => {
        return {
          MSSV: item.MSSV,
          "Họ tên": item.HoTen,
          "Điểm hk1": item.hk1?.toFixed(2),
          "Điểm hk1": item.hk2?.toFixed(2),
          "Điểm rl hk1": item.rl1,
          "Điểm rl hk2": item.rl2,
          "Phân loại":
            item.PhanLoai === 1
              ? "Xuất sắc"
              : item.PhanLoai === 2
              ? "Khá"
              : item.PhanLoai === 3
              ? "Trung bình"
              : item.PhanLoai === 4
              ? "Yếu kém"
              : "Chưa phân loại",
        };
      });

      // Tạo một đối tượng Workbook từ mảng dữ liệu
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "CD-DanhGiaDoanVien");

      // Xuất file Excel
      XLSX.writeFile(wb, `${allData[0].MaLop} - ${allData[0].TenNamHoc}.xlsx`);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error.message);
      // Xử lý lỗi nếu có
    }
  };

  /* Tải file */
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

      setExcelData(displayedData);
      setShowExcelModal(true);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Lỗi khi đọc file Excel:", error.message);
      setErrorMessage("Lỗi khi đọc file Excel!");
      setShowModalUpdate(true);
    }
  };

  const calculateIndex = (pageIndex, pageSize, itemIndex) => {
    return (pageIndex - 1) * pageSize + itemIndex + 1;
  };


  const handleViewButtonClick = (itemID, idnamhoc) => {
    localStorage.setItem("IDDoanVien", itemID);
    localStorage.setItem("IDNamHoc", idnamhoc);
    navigate(`/BCH-DoanTruong/DanhGiaChiDoan/ChiTietDanhGia/DoanVien`);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Đánh Giá Đoàn Viên</h2>
       
        </div>
        <div className="search">
          <div className="searchDV laptop">
            <div className="">
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Mã đoàn viên"
                  value={searchData.MSSV}
                  onChange={(e) => {
                    setSearchData({ ...searchData, MSSV: e.target.value });
                  }}
                />
              </div>
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Tên đoàn viên"
                  value={searchData.HoTen}
                  onChange={(e) => {
                    setSearchData({ ...searchData, HoTen: e.target.value });
                  }}
                />
              </div>
              <div className="searchDV-input">
                <select
                  type="text"
                  className="search_name"
                  value={searchData.PhanLoai}
                  onChange={(e) => {
                    setSearchData({ ...searchData, PhanLoai: e.target.value });
                  }}
                >
                  <option value="" disabled selected>
                    Chọn phân loại
                  </option>
                  <option value="1">Xuất sắc</option>
                  <option value="2">Khá</option>
                  <option value="3">Trung bình</option>
                  <option value="4">Yếu kém</option>
                  <option value="0">Chưa phân loại</option>
                </select>
              </div>

              <button className="formatButton" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
            <div className="buttonSearch">
              <div>
                <button className="formatButton" onClick={exportToExcel}>
                  <FontAwesomeIcon icon={faCloudArrowDown} />
                </button>
              </div>
            </div>
          </div>

          <div className="searchDV tablet-mobile">
          <div className="searchDV-Right">
              <div>
                <button className="formatButton" onClick={exportToExcel}>
                  <FontAwesomeIcon icon={faCloudArrowDown} />
                </button>
              </div>
            </div>

            <div className="">
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Tìm mã, tên đoàn viên"
                  value={searchMany.info}
                  onChange={(e) => {
                    setsearchMany({ info: e.target.value });
                  }}
                />
              </div>

              <button className="formatButton" onClick={handleManySearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>

          </div>
        </div>
      </div>

        <div className="table-container">
          <table className="table table-striped mb-table">
            <thead>
              <tr>
                <th className="">STT</th>
                <th className="mb-tableItem">Mã Đoàn Viên</th>
                <th>Tên Đoàn Viên</th>
                <th>Điểm học kỳ 1</th>
                <th>Điểm học kỳ 2</th>
                <th>Điểm rèn luyện học kỳ 1</th>
                <th>Điểm rèn luyện học kỳ 2</th>
                <th className="">Đánh giá đoàn viên</th>
              </tr>
            </thead>
            <tbody id="myTable">
              {DSDoanVien &&
                DSDoanVien.length > 0 &&
                DSDoanVien.map((item, index) => {
                  const stt = calculateIndex(currentPage, pageSize, index);
                  return (
                    <tr key={`table-doanvien-${index}`} className="tableRow">
                      <td className=" col-center">{stt}</td>
                      <td className="mb-tableItem mb-tableItem1">
                        {item.MSSV}
                      </td>
                      <td className="">{item.HoTen}</td>
                      <td className="col-center">{item.hk1.toFixed(2)}</td>
                      <td className="col-center">{item.hk2.toFixed(2)}</td>
                      <td className="col-center">{item.rl1}</td>
                      <td className="col-center">{item.rl2}</td>
                      <td className="">
                        {item.PhanLoai === 1
                          ? "Xuất sắc"
                          : item.PhanLoai === 2
                          ? "Khá"
                          : item.PhanLoai === 3
                          ? "Trung bình"
                          : item.PhanLoai === 4
                          ? "Yếu kém"
                          : "Chưa đánh giá"}
                      </td>
                    </tr>
                  );
                })}
              {DSDoanVien && DSDoanVien.length === 0 && (
                <tr className="tablenone">
                  <td className="tablenone">Không có đoàn viên nào!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
        <div className="searchDV-Right">
          Xuất sắc: {DSPhanLoai[1] || 0} | Khá: {DSPhanLoai[2] || 0} | Trung bình: {DSPhanLoai[3] || 0} | Yếu kém: {DSPhanLoai[4] || 0} | Chưa phân loại: {DSPhanLoai[0] || 0}
        </div>
      </div>

      {DSDoanVien && DSDoanVien.length > 0 && (
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

      {DSDoanVien && DSDoanVien.length <= 5 && (
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

    </>
  );
};

export default DanhSachDoanVien;
