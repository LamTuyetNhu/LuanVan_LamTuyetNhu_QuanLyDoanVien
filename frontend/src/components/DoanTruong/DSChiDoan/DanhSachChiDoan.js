import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  faEye,
  faCloudArrowDown,
  faMagnifyingGlass,
  faPenToSquare,
  faPlus,
  faTrash,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  getAllChiDoan,
  searchChiDoan,
  getKhoa,
} from "../../../services/apiService";
import { all } from "axios";

const DanhSachChiDoan = (props) => {
  const [DSChiDoan, setListChiDoan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [DSKhoa, setListKhoa] = useState([]);

  const [searchData, setSearchData] = useState({
    MaLop: "",
    TenLop: "",
    Khoa: "",
    ttLop: "",
  });

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchDSChiDoan();
    fetchDSKhoa();
    fetchAllData();
    // handleSearch();
  }, [currentPage, totalPages]);

  const fetchDSChiDoan = async () => {
    try {
      let res = await getAllChiDoan(currentPage);
      // console.log(res);

      if (res.status === 200) {
        setListChiDoan(res.data.dataCD);
        setTotalPages(res.data.totalPages);
      } else {
        // Xử lý trường hợp lỗi
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

  const handleSearch = async () => {
    try {
      const trimmedMaLop = searchData.MaLop.trim().toLowerCase();
      const trimmedTenLop = searchData.TenLop.trim().toLowerCase();
      let res = await searchChiDoan({
        ...searchData,
        MaLop: trimmedMaLop,
        TenLop: trimmedTenLop,
      }); // Assuming you have implemented the search API
      console.log(res);
      if (res.status === 200) {
        setListChiDoan(res.data.dataCD);
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
        let res = await getAllChiDoan(page);

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
        "Mã Chi Đoàn": item.MaLop,
        "Tên Chi Đoàn": item.TenLop,
        Khóa: item.Khoa,
        "Trạng thái": item.ttLop === 1 ? "Đang hoạt động" : "Đã tốt nghiệp",
      };
    });

    // Tạo một đối tượng Workbook từ mảng dữ liệu
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachChiDoan");

    // Xuất file Excel
    XLSX.writeFile(wb, "DanhSachChiDoan.xlsx");
  };

  return (
    <>
      <div className="container-fluid app__content">
        <h5 className="text-center">Danh Sách Chi Đoàn</h5>
        <div className="searchDV">
          <div className="">
            <div className="searchDV-input">
              <input
                type="text"
                className="search_name"
                placeholder="Mã chi đoàn"
                value={searchData.MaLop}
                onChange={(e) => {
                  setSearchData({ ...searchData, MaLop: e.target.value });
                }}
              />
            </div>
            <div className="searchDV-input">
              <input
                type="text"
                className="search_name"
                placeholder="Tên chi đoàn"
                value={searchData.TenLop}
                onChange={(e) => {
                  setSearchData({ ...searchData, TenLop: e.target.value });
                }}
              />
            </div>
            <div className="searchDV-input">
              <select
                className="search_name"
                value={searchData.Khoa}
                onChange={(e) =>
                  setSearchData({ ...searchData, Khoa: e.target.value })
                }
              >
                <option value="" disabled selected>
                  Chọn khóa
                </option>
                {DSKhoa.map((khoa, index) => {
                  return (
                    <option key={index} value={khoa.khoa}>
                      {khoa.khoa}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="searchDV-input">
              <select
                className="search_name"
                value={searchData.ttLop}
                onChange={(e) => {
                  setSearchData({ ...searchData, ttLop: e.target.value });
                }}
              >
                <option value="" disabled selected>
                  Trạng thái lớp
                </option>
                <option value="1">Chưa tốt nghiệp</option>
                <option value="0">Đã tốt nghiệp</option>
              </select>
            </div>
            <button className="formatButton" onClick={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} /> Tìm
            </button>
          </div>
          <div className="buttonSearch">
          <NavLink to="/BCH-DoanTruong/ThemMoi-ChiDoan">
                <button className="formatButton">
                  {" "}
                  <FontAwesomeIcon icon={faPlus} /> Thêm
                </button>
              </NavLink>
            <button className="formatButton" onClick={exportToExcel}>
              <FontAwesomeIcon icon={faCloudArrowDown} /> Tải
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-item1">STT</th>
                <th>Mã Chi Đoàn</th>
                <th>Tên Chi Đoàn</th>
                <th>Email</th>
                <th className="table-item">Khóa</th>
                <th>Trạng thái</th>
                <th className="table-item2">Xem</th>
                <th className="table-item2">Cập nhật</th>
                <th className="table-item2">Xóa</th>
              </tr>
            </thead>
            <tbody id="myTable">
              {DSChiDoan &&
                DSChiDoan.length > 0 &&
                DSChiDoan.map((item, index) => {
                  return (
                    <tr key={`table-chidoan-${index}`} className="tableRow">
                      <td className="table-item col-right">{index + 1}</td>
                      <td className="table-item">{item.MaLop}</td>
                      <td className="table-item">{item.TenLop}</td>
                      <td className="table-item">{item.Email}</td>

                      <td className="table-item col-right">{item.Khoa}</td>
                      <td
                        className={`table-item ${
                          item.ttLop === 0 ? "daTotNghiep" : "chuaTotNghiep"
                        }`}
                      >
                        {item.ttLop === 1 ? "Đang hoạt động" : "Đã tốt nghiệp"}
                      </td>
                      <td className="btnOnTable1">
                        <NavLink
                          to={`/BCH-DoanTruong/ChiTietChiDoan/${item.IDLop}`}
                        >
                          <button className="btnOnTable ">
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </NavLink>
                      </td>
                      <td className="btnOnTable1">

                      <button className="btnOnTable ">
                        <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                      </td>
                      <td className="btnOnTable1">
                      <button className="btnOnTable ">
                        <FontAwesomeIcon icon={faTrash} />
                          </button>
                      </td>
                    </tr>
                  );
                })}
              {DSChiDoan && DSChiDoan.length === 0 && (
                <tr className="tablenone">
                  <td className="tablenone">Không có chi đoàn nào!</td>
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
    </>
  );
};

export default DanhSachChiDoan;
