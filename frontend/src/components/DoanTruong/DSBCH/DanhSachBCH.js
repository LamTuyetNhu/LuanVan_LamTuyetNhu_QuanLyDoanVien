import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/logo.jpg";
import {
  faPlus,
  faPenNib,
  faCloudArrowDown,
  faDownload,
  faMagnifyingGlass,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { laydsBCH, chucvu, searchBCH } from "../../../services/apiService";

const DanhSachBCH = (props) => {
  const { IDLop } = useParams();
  const [DoanVien, setDoanVien] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [DSChucVu, setListChucVu] = useState([]);

  const [searchData, setSearchData] = useState({
    MSSV: "",
    HoTen: "",
    IDChucVu: "",
    GioiTinh: "",
  });

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchDoanVien();
    fetchDSChucVu();

    fetchAllData();
  }, [currentPage, totalPages]);

  const fetchDoanVien = async () => {
    try {
      let res = await laydsBCH(currentPage);

      if (res.status === 200) {
        setDoanVien(res.data.dataCD);
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

  const handleSearch = async () => {
    try {
      const trimmedMSSV = searchData.MSSV.trim().toLowerCase();
      const trimmedHoTen = searchData.HoTen.trim().toLowerCase();

      let res = await searchBCH({
        ...searchData,
        MSSV: trimmedMSSV,
        HoTen: trimmedHoTen,
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

      // Lặp qua tất cả các trang
      for (let page = 1; page <= totalPages; page++) {
        let res = await laydsBCH(page);

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
        <h2 className="text-center">Danh Sách Ban Chấp Hành</h2>
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
              <div className="searchDV-input">
                <select
                  type="text"
                  className="search_name"
                  value={searchData.GioiTinh}
                  onChange={(e) => {
                    setSearchData({ ...searchData, GioiTinh: e.target.value });
                  }}
                >
                  <option value="Giới tính">Chọn giới tính</option>
                  <option value="1">Nam</option>
                  <option value="0">Nữ</option>
                  <option value="2">Khác</option>
                </select>
              </div>
              <button className="formatButton" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} /> Tìm
              </button>
            </div>
            <div className="buttonSearch">
           
              <button className="formatButton" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faCloudArrowDown} /> Tải xuống
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
                          <NavLink
                            to={`/BCH-DoanTruong/DanhSachBCH/${item.MaLop}/${item.MSSV}/${item.IDChiTietNamHoc}` } className="NavLink-item"
                          >
                          <div className="giang-vien-item">
                            <div className="gv-image img-hover-zoom gv1">
                              <a>
                                <img src={`http://localhost:8080/images/${item.TenAnh}`} />
                              </a>
                            </div>
                            <div className="gv-body">
                              <div className="giang-vien-title">
                                <a>{item.HoTen}</a>
                              </div>
                              <div className="giang-vien-subtitle">
                                {item.TenLop}
                              </div>
                              <p>{item.TenCV}</p>
                            </div>
                          </div>
                        </NavLink>
                        </div>

                      );
                    })}

                  {DoanVien && DoanVien.length === 0 && (
                    <tr className="tablenone">
                      <td className="tablenone">Không có đoàn viên nào!</td>
                    </tr>
                  )}
                </div>
              </div>
            </div>
          </div>
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

export default DanhSachBCH;
