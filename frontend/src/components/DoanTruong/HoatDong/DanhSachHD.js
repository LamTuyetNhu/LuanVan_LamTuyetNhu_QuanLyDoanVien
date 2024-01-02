import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

import {
  faPlus,
  faPenNib,
  faCloudArrowDown,
  faDownload,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { laydshoatdong, searchHoatDong } from "../../../services/apiService";

const DanhSachHoatDong = (props) => {
  const [DSHoatDong, setDSHoatDong] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDSHoatDong();
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

  const exportToExcel = () => {
    // Tạo một mảng chứa dữ liệu bạn muốn xuất
    const dataToExport = DSHoatDong.map((item) => {
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
                  <option value="3">Đã xóa</option>
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
                  <th>Xem chi tiết</th>
                </tr>
              </thead>
              <tbody id="myTable">
                {DSHoatDong &&
                  DSHoatDong.length > 0 &&
                  DSHoatDong.map((item, index) => {
                    return (
                      <tr key={`table-hoatdong-${index}`} className="tableRow">
                        <td className="table-item">{index + 1}</td>
                        <td className="table-item">{item.TenHoatDong}</td>
                        <td className="table-item">
                          {format(new Date(item.NgayTao), "dd/MM/yyyy")}
                        </td>
                        <td className="table-item">
                          {format(new Date(item.NgayBanHanh), "dd/MM/yyyy")}
                        </td>
                        <td className="table-item">
                          {format(new Date(item.NgayHetHan), "dd/MM/yyyy")}
                        </td>

                        <td className="table-item">
                          {item.ttHD === 0
                            ? "Chưa ban hành"
                            : item.ttHD === 1
                            ? "Đã ban hành"
                            : item.ttHD === 2
                            ? "Hoàn thành"
                            : "Đã xóa"}
                        </td>

                        <td className="thButton">
                          <NavLink
                            to={`/BCH-DoanTruong/ChiTietHoatDong/${item.IDHoatDong}`}
                          >
                            <button className="btnOnTable">
                              <FontAwesomeIcon icon={faPenNib} /> Chi tiết
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
          {Array.from({ length: totalPages }, (_, index) => (
            <div className="footer">
              <button
                key={index}
                className={`btn-footer ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DanhSachHoatDong;
