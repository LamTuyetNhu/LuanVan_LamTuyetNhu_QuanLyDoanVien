import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "../../Modal/Modal";
import ExcelDataModal from "../../Modal/ExcelDataModal1";

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
  searchDoanVien,
  searchManyDoanVien,
  laymotlop,
  namhoc,
  namhoccuachidoan,
  chucvu,
} from "../../../services/apiService";

const DanhSachDoanVien = (props) => {
  const IDLop = localStorage.getItem("IDLop");
  const navigate = useNavigate();

  const [DSDoanVien, setListDoanVien] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [idnamhoc, setNamHoc] = useState(1);

  const [DSNamHoc, setDSNamHoc] = useState([]);
  const [DSChucVu, setListChucVu] = useState([]);
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
    IDChucVu: "",
    GioiTinh: "",
  });

  const [searchMany, setsearchMany] = useState({
    info: "",
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
    fetchDSChucVu();
    fetchAllData();
    fetchDSNamHoc();
  }, [IDLop, currentPage, totalPages, idnamhoc]);

  const fetchDSDoanVien = async () => {
    try {
      let res = await laymotlop(IDLop, currentPage, idnamhoc);
      console.log(res);

      if (res.status === 200) {
        console.log("Data from API:", res.data.dataCD);
        console.log("Total Pages from API:", res.data.totalPages);

        setListDoanVien(res.data.dataCD);
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

  const handleSearch = async () => {
    try {
      const trimmedMSSV = searchData.MSSV.trim().toLowerCase();
      const trimmedHoTen = searchData.HoTen.trim().toLowerCase();

      let res = await searchDoanVien({
        ...searchData,
        MSSV: trimmedMSSV,
        HoTen: trimmedHoTen,
        IDNamHoc: idnamhoc,
        currentPage: currentPage,
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
        IDNamHoc: idnamhoc,
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
        let res = await laymotlop(IDLop, page, idnamhoc);

        if (res.status === 200) {
          // Tích hợp dữ liệu từ trang hiện tại vào mảng
          allDataArray = [...allDataArray, ...res.data.dataCD];
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
          "Mã Chi Đoàn": item.MaLop,
          "Tên Chi Đoàn": item.TenLop,
          Khóa: item.Khoa,
          MSSV: item.MSSV,
          "Họ tên": item.HoTen,
          Email: item.Email,
          "Số điện thoại": item.SoDT,
          "Giới tính":
            item.GioiTinh === 0 ? "Nữ" : item.GioiTinh === 1 ? "Nam" : "Khác",
          "Quê quán": item.QueQuan,
          "Dân tộc": item.TenDanToc,
          "Tôn giáo": item.TenTonGiao,
          "Ngày sinh": format(new Date(item.NgaySinh), "dd/MM/yyyy"),
          "Ngày vào đoàn": format(new Date(item.NgayVaoDoan), "dd/MM/yyyy"),
          "Chức vụ": item.TenCV,
        };
      });

      // Tạo một đối tượng Workbook từ mảng dữ liệu
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "DanhSachDoanVien");

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
      formData.append("IDLop", IDLop);
      formData.append("idnamhoc", idnamhoc);

      formData.append("file", selectedFile);

      let res = await axios.post(
        "http://localhost:8080/api/ThemDoanVienExcel",
        formData
      );

      if (res.status === 200) {
        // Thêm thành công
        setSuccessMessage("Thêm thành công!");
        setShowModalUpdate(true);
        fetchDSDoanVien();
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

  const calculateIndex = (pageIndex, pageSize, itemIndex) => {
    return (pageIndex - 1) * pageSize + itemIndex + 1;
  };

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setNamHoc(selectedIDNamHoc);
  };

  const handleViewButtonClick = (itemID) => {
    localStorage.setItem("IDDoanVien", itemID);
    navigate(`/BCH-DoanTruong/ChiTietChiDoan/DoanVien`);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Đoàn Viên</h2>
          <div className="searchDV-input">
            Năm học:{" "}
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
                  value={searchData.IDChucVu}
                  onChange={(e) => {
                    setSearchData({ ...searchData, IDChucVu: e.target.value });
                  }}
                >
                  <option value="Chức vụ">Chọn chức vụ</option>
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
            <NavLink to={`/BCH-DoanTruong/ThemMoiDoanVien/${IDLop}`}>
                <button className="formatButton">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </NavLink>
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
              <NavLink to={`/BCH-DoanTruong/ThemMoiDoanVien/${IDLop}`}>
                <button className="formatButton">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </NavLink>
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
            <div className="">
              <div className="searchDV-input ">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Tìm theo mã, tên đoàn viên"
                  value={searchData.info}
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

      <div className="listDV">
        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="">STT</th>
                <th className="mb-tableItem">Mã đoàn viên</th>
                <th>Tên đoàn viên</th>
                <th className="">Ngày sinh</th>
                <th className="">Giới tính</th>
                <th>Chức vụ</th>
                <th className="">Năm học</th>
                <th>Email</th>
                <th className="">Số điện thoại</th>
                <th className="">Chi tiết</th>
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
                      <td className="col-center">
                        {format(new Date(item.NgaySinh), "dd/MM/yyyy")}
                      </td>
                      <td className="table-item1">
                        {item.GioiTinh === 0
                          ? "Nữ"
                          : item.GioiTinh === 1
                          ? "Nam"
                          : "Khác"}
                      </td>
                      <td className="">{item.TenCV}</td>
                      <td className="col-center">{item.TenNamHoc}</td>

                      <td className="">{item.Email}</td>
                      <td className="">{item.SoDT}</td>

                      <td className="btnOnTable1">
                        <button
                          className="btnOnTable"
                          onClick={() => handleViewButtonClick(item.IDDoanVien)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
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

export default DanhSachDoanVien;
