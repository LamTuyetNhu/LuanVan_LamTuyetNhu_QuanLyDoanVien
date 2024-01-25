import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import axios from "axios";

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
  namhoc,
  getKhoa
} from "../../../services/apiService";

const DanhSachBCH = (props) => {
  const { IDLop } = useParams();
  const [DoanVien, setDoanVien] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [DSChucVu, setListChucVu] = useState([]);

  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);
  const [DSKhoa, setKhoa] = useState([]);

  const [searchData, setSearchData] = useState({
    IDNamHoc: idnamhoc,
    MSSV: "",
    HoTen: "",
    IDChucVu: "",
    Khoa: "",
  });

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchDoanVien();
    fetchDSChucVu();
    fetchDSNamHoc();
    fetchAllData();
    fetchDSKhoa()
  }, [currentPage, idnamhoc]);

  const fetchDoanVien = async () => {
    try {
      let res = await laydsBCH(currentPage, idnamhoc);
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
      let res = await namhoc();
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
        const Khoa = res.data.dataCD;

        // if (Array.isArray(NamHocdata)) {
          setKhoa(Khoa);
        // } else {
        //   console.error("Dữ liệu khóa không hợp lệ:", NamHocdata);
        // }
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

      for (let page = 1; page <= totalPages; page++) {
        let res = await laydsBCH(page, idnamhoc);

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
        "Khóa": item.Khoa,
        "MSSV": item.MSSV,
        "Họ tên": item.HoTen,
        "Email": item.Email,
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

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setNamHoc(selectedIDNamHoc);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Ban Chấp Hành</h2>
          <div className="searchDV-input">
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
                  <option value="" disabled selected>Chọn chức vụ</option>
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
              {/* <div className="searchDV-input">
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
              </div> */}
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
                            to={`/BCH-DoanTruong/DanhSachBCH/${item.IDLop}/${item.IDDoanVien}/${item.IDChiTietNamHoc}`}
                            className="NavLink-item"
                          >
                            <div className="giang-vien-item">
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
