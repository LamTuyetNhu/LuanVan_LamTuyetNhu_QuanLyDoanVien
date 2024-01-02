import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";


import {
  faPenNib,
  faFilter,
  faCloudArrowUp,
  faCloudArrowDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import {
  searchDoanVien,
  laymotlop,
  chucvu,
} from "../../services/apiService";

const DanhSachDoanVien = (props) => {
  const { IDLop } = useParams();
  const [DSDoanVien, setListDoanVien] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [DSChucVu, setListChucVu] = useState([]);

  const [searchData, setSearchData] = useState({
    IDLop: IDLop,
    MSSV: "",
    HoTen: "",
    IDChucVu: "",
    GioiTinh: "",
  });

  useEffect(() => {
    fetchDSDoanVien();
    fetchDSChucVu();
    // handleSearch();
  },  [currentPage]);

  const fetchDSDoanVien = async () => {
    try {
      let res = await laymotlop(IDLop, currentPage);
      console.log(res);

      if (res.status === 200) {
        setListDoanVien(res.data.dataCD);
        
        setTotalPages(res.data.totalPages);
      } else {
        // Xử lý trường hợp lỗi
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
        // setListKhoa(res.data.DSKhoa); // Cập nhật state với danh sách khóa học
        const khoaData = res.data.dataCV;

        // Kiểm tra nếu khoaData là mảng trước khi cập nhật state
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

  const handleSearch = async () => {
    try {
      const trimmedMSSV = searchData.MSSV.trim().toLowerCase();
      const trimmedHoTen = searchData.HoTen.trim().toLowerCase();

      let res = await searchDoanVien({
        ...searchData,
        MSSV: trimmedMSSV,
        HoTen: trimmedHoTen,
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

  const exportToExcel = () => {
    // Tạo một mảng chứa dữ liệu bạn muốn xuất
    const dataToExport = DSDoanVien.map((item) => {
      return {
        "Mã Chi Đoàn": item.MaLop,
        "Tên Chi Đoàn": item.TenLop,
        Khóa: item.Khoa,
        MSSV: item.MSSV,
        HoTen: item.HoTen,
        Email: item.Email,
        SoDT: item.SoDT,
        GioiTinh:
          item.GioiTinh === 0 ? "Nữ" : item.GioiTinh === 1 ? "Nam" : "Khác",
        QueQuan: item.QueQuan,
        DanToc: item.TenDanToc,
        TonGiao: item.TenTonGiao,
        NgaySinh: format(new Date(item.NgaySinh), "dd/MM/yyyy"),
        NgayVaoDoan: format(new Date(item.NgayVaoDoan), "dd/MM/yyyy"),
        "Trạng thái": item.ttLop === 1 ? "Đang hoạt động" : "Đã tốt nghiệp",
      };
    });

    // Tạo một đối tượng Workbook từ mảng dữ liệu
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachDoanVien");

    // Xuất file Excel
    XLSX.writeFile(wb, "DanhSachDoanVien.xlsx");
  };

  return (
    <>
      <div className="container-fluid app__content">
        <h2 className="text-center">Danh Sách Đoàn Viên</h2>
        <div className="search">
          <div className="searchDV">
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
                  <option value="Chức vụ">
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
              <div className="searchDV-input">
                <select
                  type="text"
                  className="search_name"
                  value={searchData.GioiTinh}
                  onChange={(e) => {
                    setSearchData({ ...searchData, GioiTinh: e.target.value });
                  }}
                >
                  <option value="Giới tính">
                    Chọn giới tính
                  </option>
                  <option value="1">Nam</option>
                  <option value="0">Nữ</option>
                  <option value="2">Khác</option>
                </select>
              </div>
              <button className="formatButton" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} /> Tìm
              </button>
              {/* <FontAwesomeIcon icon={faFilter} /> */}
            </div>
            <div className="buttonSearch">
            <button className="formatButton">
                <FontAwesomeIcon icon={faCloudArrowUp} /> Tải lên
              </button>
              <button className="formatButton" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faCloudArrowDown} /> Tải xuống
              </button>
            </div>
          </div>
        </div>

        <div className="listDV">
          <div className="table-container">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="table-item ">STT</th>
                  <th className="table-item">Mã Đoàn Viên</th>
                  <th className="table-item">Tên Đoàn Viên</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                  <th>Chức vụ</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody id="myTable">
                {DSDoanVien &&
                  DSDoanVien.length > 0 &&
                  DSDoanVien.map((item, index) => {
                    return (
                      <tr key={`table-doanvien-${index}`} className="tableRow">
                        <td className="table-item col-right">{index + 1}</td>
                        <td className="table-item">{item.MSSV}</td>
                        <td className="table-item">{item.HoTen}</td>
                        <td className="table-item">
                          {format(new Date(item.NgaySinh), "dd/MM/yyyy")}
                        </td>
                        <td className="table-item">
                          {item.GioiTinh === 0
                            ? "Nữ"
                            : item.GioiTinh === 1
                            ? "Nam"
                            : "Khác"}
                        </td>
                        <td className="table-item">{item.TenCV}</td>
                        <td className="table-item">{item.Email}</td>
                        <td className="table-item">{item.SoDT}</td>

                        <td>
                        <NavLink
                          to={`/BCH-DoanTruong/ChiTietChiDoan/${item.MaLop}/${item.MSSV}`}
                        >
                          <button className="btnOnTable">
                            <FontAwesomeIcon icon={faPenNib} /> Chi tiết
                          </button>
                        </NavLink>
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

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <div className="footer">
                  <button
                    key={index}
                    className={`btn-footer ${currentPage === index + 1 ? "active" : ""}`}
                    onClick={() => changePage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DanhSachDoanVien;
