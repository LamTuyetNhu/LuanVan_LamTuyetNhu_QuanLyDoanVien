import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { NavLink, useNavigate } from "react-router-dom";

import {
  faPlus,
  faEye,
  faPenToSquare,
  faCloudArrowDown,
  faMagnifyingGlass,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  namhoc,
  laydshoatdong,
  searchHoatDong,
  searchManyInfoHD,
} from "../../../services/apiService";

const DanhSachHoatDong = (props) => {
  const IDTruong = localStorage.getItem("IDTruong");
  const navigate = useNavigate();

  const [DSHoatDong, setDSHoatDong] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }
    fetchDSHoatDong();
    fetchAllData();
    fetchDSNamHoc();
  }, [currentPage, idnamhoc, IDTruong]);

  const fetchDSHoatDong = async () => {
    try {
      let res = await laydshoatdong(currentPage, idnamhoc, IDTruong);

      if (res.status === 200) {
        setDSHoatDong(res.data.dataHD);
        setTotalPages(res.data.totalPages);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [searchData, setSearchData] = useState({
    TenHoatDong: "",
    Thang: "",
    ttHD: "",
  });

  const [searchMany, setsearchMany] = useState({
    info: "",
  });

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

  const handleSearch = async () => {
    try {
      const trimmedTenHoatDong = searchData.TenHoatDong.trim();

      let res = await searchHoatDong({
        ...searchData,
        TenHoatDong: trimmedTenHoatDong,
        IDNamHoc: idnamhoc,
        IDTruong: IDTruong
      }); // Assuming you have implemented the search API

      console.log(res);
      if (res.status === 200) {
        setDSHoatDong(res.data.dataHD);
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
      let res = await searchManyInfoHD({ trimmedInfo, 
        IDNamHoc: idnamhoc, IDTruong: IDTruong }); // Assuming you have implemented the search API
      console.log(res);
      if (res.status === 200) {
        setDSHoatDong(res.data.dataHD);
      } else {
        console.error("Lỗi khi tìm kiếm:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error.message);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      // Chỉ tăng currentPage nếu không phải là trang cuối cùng
      setCurrentPage(currentPage + 1);
    }
  };

  // Hàm xử lý khi nhấn nút sang trái
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
      for (let page = 1; page <= totalPages; page++) {
        let res = await laydshoatdong(page, idnamhoc, IDTruong);

        if (res.status === 200) {
          // Tích hợp dữ liệu từ trang hiện tại vào mảng
          allDataArray = [...allDataArray, ...res.data.dataHD];
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

  const exportToExcel = () => {
    // Tạo một mảng chứa dữ liệu bạn muốn xuất
    const dataToExport = allData.map((item) => {
      return {
        TenHoatDong: item.TenHoatDong,
        NgayBanHanh: format(new Date(item.NgayTao), "dd/MM/yyyy"),

        NgayBatDau: format(new Date(item.NgayBanHanh), "dd/MM/yyyy"),
        NgayHetHan: format(new Date(item.NgayHetHan), "dd/MM/yyyy"),
        "Trạng thái":
          item.ttHD === 0
            ? "Chưa ban hành"
            : item.ttHD === 1
            ? "Đã ban hành"
            : item.ttHD === 2
            ? "Hoàn thành"
            : "Đã xóa",
      };
    });

    // Tạo một đối tượng Workbook từ mảng dữ liệu
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachHD");

    // Xuất file Excel
    XLSX.writeFile(wb, "DanhSachHoatDong.xlsx");
  };

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setIDNamHoc(selectedIDNamHoc);
  };

  const calculateIndex = (pageIndex, pageSize, itemIndex) => {
    return (pageIndex - 1) * pageSize + itemIndex + 1;
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Hoạt Động</h2>

          <div className="searchDV-input">Năm học:
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
        <div className="search">
          <div className="searchDV laptop">
            <div className="">
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Tên hoạt động"
                  value={searchData.TenHoatDong}
                  onChange={(e) => {
                    setSearchData({
                      ...searchData,
                      TenHoatDong: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="searchDV-input">
                <select
                  type="text"
                  className="search_name"
                  value={searchData.Thang}
                  onChange={(e) => {
                    setSearchData({ ...searchData, Thang: e.target.value });
                  }}
                >
                  <option value="" disabled selected>
                    Tháng bắt đầu
                  </option>
                  <option value="1">Tháng 1</option>
                  <option value="2">Tháng 2</option>
                  <option value="3">Tháng 3</option>
                  <option value="4">Tháng 4</option>
                  <option value="5">Tháng 5</option>
                  <option value="6">Tháng 6</option>
                  <option value="7">Tháng 7</option>
                  <option value="8">Tháng 8</option>
                  <option value="9">Tháng 9</option>
                  <option value="10">Tháng 10</option>
                  <option value="11">Tháng 11</option>
                  <option value="12">Tháng 12</option>
                </select>
              </div>
              <div className="searchDV-input">
                <select
                  type="text"
                  className="search_name"
                  value={searchData.ttHD}
                  onChange={(e) => {
                    setSearchData({ ...searchData, ttHD: e.target.value });
                  }}
                >
                  <option value="" disabled selected>
                    Trạng thái
                  </option>
                  <option value="0">Chưa ban hành</option>
                  <option value="1">Đã ban hành</option>
                  <option value="2">Hoàn thành</option>
                </select>
              </div>
              <button className="formatButton" onClick={handleSearch}>
                {" "}
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
            <div className="buttonSearch">
              {" "}
              <NavLink to="/BCH-DoanTruong/ThemMoi">
                <button className="formatButton">
                  {" "}
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </NavLink>
              <div>
                <button className="formatButton" onClick={exportToExcel}>
                  {" "}
                  <FontAwesomeIcon icon={faCloudArrowDown} />
                </button>
              </div>
            </div>
          </div>

          <div className="searchDV tablet-mobile">
          <div className="searchDV-Right">
              {" "}
              <NavLink to="/BCH-DoanTruong/ThemMoi">
                <button className="formatButton">
                  {" "}
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </NavLink>
              <div>
                <button className="formatButton" onClick={exportToExcel}>
                  {" "}
                  <FontAwesomeIcon icon={faCloudArrowDown} />
                </button>
              </div>
            </div>

            <div className="">
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Tìm tên hoạt động"
                  value={searchMany.info}
                onChange={(e) => {
                  setsearchMany({ info: e.target.value });
                }}
                />
              </div>
              <button className="formatButton" onClick={handleManySearch}>
                {" "}
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>

          </div>
        </div>

        <div className="listDV">
          <div className="table-container">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="table-item">STT</th>
                  <th className="table-item mb-tableItem">Tên hoạt động</th>
                  <th>Ngày ban hành</th>
                  <th>Ngày bắt đầu</th>

                  <th>Ngày hết hạn</th>
                  <th>Trạng thái</th>
                  <th className="table-item2">Điểm danh</th>
                  <th className="table-item2">Cập nhật</th>
                </tr>
              </thead>
              <tbody id="myTable">
                {DSHoatDong &&
                  DSHoatDong.length > 0 &&
                  DSHoatDong.map((item, index) => {
                    const stt = calculateIndex(currentPage, pageSize, index);

                    return (
                      <tr key={`table-hoatdong-${index}`} className="tableRow">
                        <td className="col-center">{stt}</td>
                        <td className="mb-tableItem mb-tableItem1">{item.TenHoatDong}</td>
                        <td className="col-center">
                          {format(new Date(item.NgayTao), "dd/MM/yyyy")}
                        </td>
                        <td className="col-center">
                          {format(new Date(item.NgayBanHanh), "dd/MM/yyyy")}
                        </td>
                        <td className="col-center">
                          {format(new Date(item.NgayHetHan), "dd/MM/yyyy")}
                        </td>

                        <td
                          className={` ${
                            item.ttHD === 0
                              ? ""
                              : item.ttHD === 1
                              ? "daTotNghiep"
                              : item.ttHD === 2
                              ? "chuaTotNghiep"
                              : "hoanthanh"
                          }`}
                        >
                          {item.ttHD === 0
                            ? "Chưa ban hành"
                            : item.ttHD === 1
                            ? "Đang diễn ra"
                            : item.ttHD === 2
                            ? "Hoàn thành"
                            : "Đã xóa"}
                        </td>

                        <td className="btnOnTable1">
                          <NavLink
                            to={`/BCH-DoanTruong/ChiTietHoatDong/DiemDanhChiDoan/${item.IDHoatDong}/${item.IDNamHoc}`}
                          >
                            <button className="btnOnTable ">
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          </NavLink>
                        </td>

                        <td className="btnOnTable1 thButton">
                          <NavLink
                            to={`/BCH-DoanTruong/ChiTietHoatDong/${item.IDHoatDong}`}
                          >
                            <button className="btnOnTable clcapnhat">
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                          </NavLink>
                        </td>
                      </tr>
                    );
                  })}
                {DSHoatDong && DSHoatDong.length === 0 && (
                  <tr className="tablenone">
                    <td className="tablenone">Không có hoạt động nào!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {DSHoatDong && DSHoatDong.length > 0 && (
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

      {DSHoatDong && DSHoatDong.length <= 5 && (
        <div className="pagination pagination1">
          {/* You can add some message or content indicating that pagination is not shown */}
        </div>
      )}

      </div>
    </>
  );
};

export default DanhSachHoatDong;
