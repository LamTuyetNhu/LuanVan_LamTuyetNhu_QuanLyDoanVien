import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

import {
  faEye,
  faCloudArrowDown,
  faMagnifyingGlass,
  faPlus,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  searchChiDoanXepLoai,
  searchManyDoanVien,
  getKhoa,
  namhoccuaxeploai,
  DanhGiaChiDoan,
} from "../../../services/apiService";

const DanhSachChiDoan = (props) => {
  const IDTruong = localStorage.getItem("IDTruong");

  const [DSChiDoan, setListChiDoan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [DSPhanLoai, setDSPhanLoai] = useState([]);

  const token = localStorage.getItem("token");
  const [pageSize, setPageSize] = useState(5);

  const [idnamhoc, setNamHoc] = useState(1);

  const [DSNamHoc, setDSNamHoc] = useState([]);
  const [DSKhoa, setListKhoa] = useState([]);
  const [khoa, setChoiceKhoa] = useState(46);

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

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
    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }
    fetchDSKhoa();
    fetchAllData();
    fetchDSNamHoc();
    fetchPhanLoai();
  }, [currentPage, totalPages, idnamhoc, khoa, IDTruong]);

  const fetchPhanLoai = async () => {
    try {
      let res = await DanhGiaChiDoan(idnamhoc, khoa, IDTruong);

      if (res.status === 200) {
        setDSPhanLoai(res.data.classResults);
        setFilteredDSPhanLoai(res.data.classResults);

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
      let res = await namhoccuaxeploai();
      if (res.status === 200) {
        const NamHocdata = res.data.dataNH;

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

  const fetchDSKhoa = async () => {
    try {
      let res = await getKhoa();
      if (res.status === 200) {
        // setListKhoa(res.data.DSKhoa); // Cập nhật state với danh sách khóa học
        const khoaData = res.data.dataCD;

        // Kiểm tra nếu khoaData là mảng trước khi cập nhật state
        if (Array.isArray(khoaData)) {
          setListKhoa(khoaData);
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      // Chỉ tăng currentPage nếu không phải là trang cuối cùng
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // Chỉ giảm currentPage nếu không phải là trang đầu tiên
      setCurrentPage(currentPage - 1);
    }
  };

  const [allData, setAllData] = useState([]);

  const fetchAllData = async () => {
    try {
      let allDataArray = [];

      // Lặp qua tất cả các trang
      // for (let page = 1; page <= totalPages; page++) {
        let res = await DanhGiaChiDoan(idnamhoc, khoa, IDTruong);

        if (res.status === 200) {
          // Tích hợp dữ liệu từ trang hiện tại vào mảng
          allDataArray = [...allDataArray, ...res.data.classResults];
        } else {
          // Xử lý trường hợp lỗi
          console.error("Lỗi khi gọi API:", res.statusText);
        }
      // }

      // Cập nhật mảng dữ liệu chung
      setAllData(allDataArray);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const exportToExcel = () => {
    // Tạo một mảng chứa dữ liệu bạn muốn xuất
    const dataToExport = allData.map((item) => {
      return {
        "Mã Chi Đoàn": item.dataCD?.MaLop,
        "Tên Chi Đoàn": item.dataCD?.TenLop,
        Khóa: item.dataCD?.Khoa,
        "Trạng thái": item.PLChiDoan === 1 ? "Chi đoàn vững mạnh" : item.PLChiDoan === 2 ? "Chi đoàn khá" : item.PLChiDoan === 3 ? "Chi đoàn trung bình" : item.PLChiDoan === 4 ? "Chi đoàn yếu kém" : "Chưa xếp loại",
      };
    });

    // Tạo một đối tượng Workbook từ mảng dữ liệu
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachChiDoan");

    // Xuất file Excel
    XLSX.writeFile(wb, "DanhSachChiDoan.xlsx");
  };

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const calculateIndex = (pageIndex, pageSize, itemIndex) => {
    return (pageIndex - 1) * pageSize + itemIndex + 1;
  };

  const handleViewButtonClick = (itemID, idnamhoc) => {
    localStorage.setItem("IDLop", itemID);
    localStorage.setItem("IDNamHoc", idnamhoc);

    navigate(`/BCH-DoanTruong/DanhGiaChiDoan/ChiTietDanhGia`);
  };

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setNamHoc(selectedIDNamHoc);
  };

  const handleKhoaChange = (e) => {
    const selectedKhoa = e.target.value;
    setChoiceKhoa(selectedKhoa);
  };

  const [filteredDSPhanLoai, setFilteredDSPhanLoai] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filteredResults = DSPhanLoai.filter((item) => {
      const maLopMatched =
        item.dataCD?.MaLop.toLowerCase().includes(trimmedQuery);
      const tenLopMatched =
        item.dataCD?.TenLop.toLowerCase().includes(trimmedQuery);
      return maLopMatched || tenLopMatched;
    });

    setFilteredDSPhanLoai(filteredResults);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h5 className="text-center">Danh Sách Chi Đoàn</h5>

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

          <div className="searchDV-input">
            Khóa:
            <select
              type="text"
              className="search_name"
              value={khoa}
              onChange={handleKhoaChange}
            >
              {DSKhoa.map((khoa, index) => {
                return (
                  <option key={index} value={khoa.khoa}>
                    {khoa.khoa}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="searchDV laptop">
          <div className="">
            <div className="searchDV-input">
              <input
                type="text"
                className="search_name"
                placeholder="Mã hoặc tên chi đoàn"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="formatButton" onClick={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <div className="buttonSearch">
          <div>
                <NavLink to="/BCH-DoanTruong/TieuChiDanhGiaChiDoan" className="navlink">
                  <button className="formatButton">Tiêu chí</button>
                </NavLink>
              </div>
          <div>
              <button className="formatButton" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faCloudArrowDown} />
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
            <div>
                <NavLink to="/BCH-DoanTruong/TieuChiDanhGiaChiDoan" className="navlink">
                  <button className="formatButton">Tiêu chí</button>
                </NavLink>
              </div>
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
                placeholder="Tìm theo mã, tên lớp"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="formatButton" onClick={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>

        <div className="listDV">
          <div className="table-container">
            <table className="table table-striped mb-table">
              <thead>
                <tr>
                  <th className="table-item1">STT</th>
                  <th className="mb-tableItem">Mã chi đoàn</th>
                  <th>Tên chi đoàn</th>
                  <th className="table-item">Khóa</th>
                  <th>Đánh giá</th>
                  <th className="table-item2">Xem</th>
                </tr>
              </thead>
              <tbody id="myTable">
                {filteredDSPhanLoai &&
                  filteredDSPhanLoai.length > 0 &&
                  filteredDSPhanLoai.map((item, index) => {
                    const stt = calculateIndex(currentPage, pageSize, index);
                    return (
                      <tr key={`table-chidoan-${index}`} className="tableRow">
                        <td className=" col-center">{stt}</td>
                        <td className="mb-tableItem mb-tableItem1">
                          {item.dataCD.MaLop}
                        </td>
                        <td className="">{item.dataCD.TenLop}</td>

                        <td className="col-center">{item.dataCD.Khoa}</td>
                        <td>
                          {item.PLChiDoan === 1
                            ? "Chi đoàn vững mạnh"
                            : item.PLChiDoan === 2
                            ? "Chi đoàn khá"
                            : item.PLChiDoan === 3
                            ? "Chi đoàn trung bình"
                            : item.PLChiDoan === 4
                            ? "Chi đoàn yếu"
                            : "Chưa phân loại"}
                        </td>
                        <td className="btnOnTable1">
                          <button
                            className="btnOnTable"
                            onClick={() => handleViewButtonClick(item.dataCD.IDLop, idnamhoc)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                {filteredDSPhanLoai && filteredDSPhanLoai.length === 0 && (
                  <tr className="tablenone">
                    <td className="tablenone">Không có chi đoàn nào!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredDSPhanLoai && filteredDSPhanLoai.length > 0 && (
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

      {filteredDSPhanLoai && filteredDSPhanLoai.length <= 5 && (
        <div className="pagination pagination">
          {/* You can add some message or content indicating that pagination is not shown */}
        </div>
      )}
    </>
  );
};

export default DanhSachChiDoan;
