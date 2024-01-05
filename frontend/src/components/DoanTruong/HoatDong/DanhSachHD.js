import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

import {
  faPlus,
  faEye,
  faPenToSquare,
  faCloudArrowDown,
  faDownload,
  faMagnifyingGlass,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { laydshoatdong, searchHoatDong } from "../../../services/apiService";

const DanhSachHoatDong = (props) => {
  const [DSHoatDong, setDSHoatDong] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDSHoatDong();
    fetchAllData();
  }, [currentPage]);

  const fetchDSHoatDong = async () => {
    try {
      let res = await laydshoatdong(currentPage);

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

  const handleSearch = async () => {
    try {
      const trimmedTenHoatDong = searchData.TenHoatDong.trim();

      let res = await searchHoatDong({
        ...searchData,
        TenHoatDong: trimmedTenHoatDong,
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
        let res = await laydshoatdong(page);

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

  return (
    <>
      <div className="container-fluid app__content">
        <h2 className="text-center">Danh Sách Hoạt Động</h2>
        <div className="search">
          <div className="searchDV">
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
                <FontAwesomeIcon icon={faMagnifyingGlass} /> Tìm
              </button>
            </div>
            <div className="buttonSearch">
              {" "}
              <NavLink to="/BCH-DoanTruong/ThemMoi">
                <button className="formatButton">
                  {" "}
                  <FontAwesomeIcon icon={faPlus} /> Thêm
                </button>
              </NavLink>
              <button className="formatButton" onClick={exportToExcel}>
                {" "}
                <FontAwesomeIcon icon={faCloudArrowDown} /> Tải
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
                  <th className="table-item">Tên Hoạt Động</th>
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
                    return (
                      <tr key={`table-hoatdong-${index}`} className="tableRow">
                        <td className="col-center">{index + 1}</td>
                        <td className="">{item.TenHoatDong}</td>
                        <td className="col-center">
                          {format(new Date(item.NgayTao), "dd/MM/yyyy")}
                        </td>
                        <td className="col-center">
                          {format(new Date(item.NgayBanHanh), "dd/MM/yyyy")}
                        </td>
                        <td className="col-center">
                          {format(new Date(item.NgayHetHan), "dd/MM/yyyy")}
                        </td>

                        <td className={` ${
                          item.ttHD === 0
                          ? ""
                          : item.ttHD === 1
                          ? "daTotNghiep"
                          : item.ttHD === 2
                          ? "chuaTotNghiep"
                          : "hoanthanh"
                        }`}>
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
                          to={`/BCH-DoanTruong/ChiTietChiDoan`}
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
                            <button className="btnOnTable">
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

        <div className="pagination">
          <button className="btn-footer" onClick={handlePrevPage}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <div className="footer" key={index}>
              <button
                className={`btn-footer ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </button>
            </div>
          ))}

          <button className="btn-footer" onClick={handleNextPage}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </>
  );
};

export default DanhSachHoatDong;
