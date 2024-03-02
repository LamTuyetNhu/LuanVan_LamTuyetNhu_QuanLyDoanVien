import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import {
  faCloudArrowDown,
  faMagnifyingGlass,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  laydsBCH,
  chucvu,
  searchBCH,
  namhoccuakhoa,
  getKhoa,
  searchManyDoanVienBCH
} from "../../../services/apiService";

const DanhSachBCH = (props) => {
  const IDTruong = localStorage.getItem("IDTruong");
  const navigate = useNavigate();

  const [DoanVien, setDoanVien] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [DSKhoa, setKhoa] = useState([]);
  const [DSChucVu, setListChucVu] = useState([]);

  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);
  const [khoa, setChoiceKhoa] = useState(46);

  const [searchMany, setsearchMany] = useState({
    info: "",
  });

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
    fetchDSKhoa();
    setSearchData((prevSearchData) => ({
      ...prevSearchData,
      IDNamHoc: idnamhoc,
      Khoa: khoa,
      IDTruong: IDTruong
    }));
  }, [currentPage, idnamhoc, khoa, IDTruong]);

  const fetchDoanVien = async () => {
    try {
      let res = await laydsBCH(currentPage, idnamhoc, khoa, IDTruong);
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

  const fetchDSNamHoc = async () => {
    try {
      let res = await namhoccuakhoa(khoa);
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

  const fetchDSKhoa = async () => {
    try {
      let res = await getKhoa();
      if (res.status === 200) {
        const Khoa = res.data.dataCD;
        setKhoa(Khoa);
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
      let res = await searchManyDoanVienBCH({
        Khoa: khoa,
        trimmedInfo,
        IDNamHoc: idnamhoc,
        IDTruong: IDTruong
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

  const handleKhoaChange = (e) => {
    const selectedKhoa = e.target.value;
    setChoiceKhoa(selectedKhoa);
    fetchDSNamHoc();
  };

  const [searchData, setSearchData] = useState({
    IDNamHoc: idnamhoc,
    MSSV: "",
    HoTen: "",
    IDChucVu: "",
    Khoa: khoa,
    IDTruong: IDTruong
  });

  const handleSearch = async () => {
    try {
      const trimmedMSSV = searchData.MSSV.trim().toLowerCase();
      const trimmedHoTen = searchData.HoTen.trim().toLowerCase();

      let res = await searchBCH({
        ...searchData,
        MSSV: trimmedMSSV,
        HoTen: trimmedHoTen,
        IDTruong: IDTruong
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
        let res = await laydsBCH(page, idnamhoc, khoa, IDTruong);

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
        "TÔn giáo": item.TenTonGiao,
        "Ngày sinh": format(new Date(item.NgaySinh), "dd/MM/yyyy"),
        "Ngày vào đoàn": format(new Date(item.NgayVaoDoan), "dd/MM/yyyy"),
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

  const handleViewButtonClick = (itemID) => {
    localStorage.setItem("IDDoanVien", itemID);
    navigate(`/BCH-DoanTruong/DanhSachBCH/DoanVien`);
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
            <div className="">
              <button className="formatButton" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faCloudArrowDown} />
              </button>
            </div>
          </div>

          <div className="searchDV tablet-mobile">
            <div className="searchDV-Right">
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
                            onClick={() =>
                              handleViewButtonClick(item.IDDoanVien)
                            }
                          >
                            <div className="gv-image img-hover-zoom gv1">
                              <a>
                                <img
                                  src={`http://localhost:8080/images/${item.TenAnh}`}
                                />
                              </a>
                            </div>
                            <div className="gv-body">
                              <div className="giang-vien-subtitle">
                                {item.MSSV}
                              </div>
                              <div className="giang-vien-title">
                                <a>{item.HoTen}</a>
                              </div>
                              <div className="giang-vien-subtitle">
                                {item.TenLop}
                              </div>
                              <p>{item.TenCV}</p>
                            </div>
                          </div>
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
    </>
  );
};

export default DanhSachBCH;
