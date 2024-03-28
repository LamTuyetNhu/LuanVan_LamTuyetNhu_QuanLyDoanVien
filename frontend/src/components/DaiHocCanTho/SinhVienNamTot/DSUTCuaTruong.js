import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import ModalUpdateStatus from "../../Modal/UpdateStatus";
import { NavLink, useNavigate } from "react-router-dom";

import {
  faEdit,
  faFilePdf,
  faCloudArrowDown,
  faMagnifyingGlass,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import {
  searchManySVNT,
  namhoc,
  DanhSachUngTuyenCT,
  laytatcatruong,

} from "../../../services/apiService";

const DanhSachDoanVien = (props) => {
  const navigate = useNavigate();
  const [DSDoanVien, setListDoanVien] = useState([]);

  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);
  const [IDTruong, setTruong] = useState(4);
  const [DSTruong, setDSTruong] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIDUngTuyen, setSelectedIDUngTuyen] = useState(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const handleIconClick = (IDUngTuyen) => {
    setSelectedIDUngTuyen(IDUngTuyen);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const [searchData, setSearchData] = useState({
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
    fetchAllData();
    fetchDSNamHoc();
    fetchDSTruong();
    setShowModalUpdate(true);
  }, [idnamhoc, IDTruong, currentPage, totalPages]);

  const fetchDSDoanVien = async () => {
    try {
      let res = await DanhSachUngTuyenCT(idnamhoc, IDTruong, currentPage);
      console.log(res);
      if (res.status === 200) {
        console.log("Data from API:", res.data.dataUT);
        setListDoanVien(res.data.dataUT);
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

  const fetchDSTruong = async () => {
    try {
      let res = await laytatcatruong();

      if (res.status === 200) {
        setDSTruong(res.data.dataCD);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const trimmedInfo = searchData.info.trim().toLowerCase();

      let res = await searchManySVNT({
        trimmedInfo: trimmedInfo,
        IDNamHoc: idnamhoc,
        IDTruong: IDTruong,
      });

      console.log(res);
      if (res.status === 200) {
        setListDoanVien(res.data.dataUT);
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
      
      for (let page = 1; page <= totalPages; page++) {
        let res = await DanhSachUngTuyenCT(idnamhoc, IDTruong, page);
        if (res.status === 200) {
          allDataArray = [...allDataArray, ...res.data.dataUT];
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
        };
      });

      // Tạo một đối tượng Workbook từ mảng dữ liệu
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "DanhSachSinhVienNamTot");

      // Xuất file Excel
      XLSX.writeFile(
        wb,
        `DanhSachSinhVienNamTot - ${allData[0].TenNamHoc}.xlsx`
      );
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error.message);
      // Xử lý lỗi nếu có
    }
  };

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setNamHoc(selectedIDNamHoc);
  };

  const handleTruongChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setTruong(selectedIDNamHoc);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Sinh Viên Năm Tốt</h2>
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
            Tên trường/khoa:
            <select
              type="text"
              className="search_name"
              value={IDTruong}
              onChange={handleTruongChange}
            >
              {DSTruong.map((item, index) => {
                return (
                  <option key={index} value={item.IDTruong}>
                    {item.TenTruong}
                  </option>
                );
              })}
            </select>
          </div>

              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Tìm mã lớp, mssv, họ tên"
                  value={searchData.info}
                  onChange={(e) => {
                    setSearchData({ info: e.target.value });
                  }}
                />
              </div>

              <button className="formatButton" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
            <div className="buttonSearch">
              <div>
                <NavLink to="/DaiHocCanTho/TieuChi" className="navlink">
                  <button className="formatButton">Tiêu chí</button>
                </NavLink>
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
                <NavLink to="/DaiHocCanTho/TieuChi" className="navlink">
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
                  placeholder="Tìm lớp, mssv, họ tên"
                  value={searchData.info}
                  onChange={(e) => {
                    setSearchData({ info: e.target.value });
                  }}
                />
              </div>

              <button className="formatButton" onClick={handleSearch}>
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
                <th>STT</th>
                <th>Mã lớp</th>
                <th className="mb-tableItem">MSSV</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Hồ sơ</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody id="myTable">
              {DSDoanVien &&
                DSDoanVien.length > 0 &&
                DSDoanVien.map((item, index) => {
                  return (
                    <tr key={`table-doanvien-${index}`} className="tableRow">
                      <td className="col-center">{index + 1}</td>
                      <td className="">{item.MaLop}</td>
                      <td className="mb-tableItem mb-tableItem1">
                        {item.MSSV}
                      </td>
                      <td className="">{item.HoTen}</td>
                      <td className="">{item.Email}</td>
                      <td className="col-center">
                        <a
                          href={`http://localhost:8080/files/${item.FileUngTuyen}`}
                        >
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            className="icon-black"
                          />
                        </a>
                      </td>
                      <td className="">
                        {item.TTUngTuyen === 0
                          ? "Chưa xét duyệt"
                          : item.TTUngTuyen === 1
                          ? "Đã xét duyệt"
                          : "Không đủ điều kiện"}
                      </td>
                      <td
                        className="col-center col-cusor"
                        onClick={() =>
                          handleIconClick(item.IDUngTuyen, item.TTUngTuyen)
                        }
                      >
                        <FontAwesomeIcon icon={faEdit} className="clcapnhat" />
                      </td>
                    </tr>
                  );
                })}
              {DSDoanVien && DSDoanVien.length === 0 && (
                <tr className="tablenone">
                  <td className="tablenone">Không có sinh viên nào đăng ký!</td>
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

      {isModalOpen && (
        <ModalUpdateStatus
          onClose={closeModal}
          selectedIDUngTuyen={selectedIDUngTuyen}
        />
      )}
    </>
  );
};

export default DanhSachDoanVien;
