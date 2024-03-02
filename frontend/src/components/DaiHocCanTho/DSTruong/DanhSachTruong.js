import { NavLink, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

import DeleteSuccess from "../../Modal/DeleteSuccess";
import DeleteConfirmationModal from "../../Modal/DeleteConfirmationModal";
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
  getAllTruong,
  searchChiDoan,
  searchManyTenTruong,
  getKhoa,
  XoaTruong,
} from "../../../services/apiService";

const DanhSachChiDoan = (props) => {
  const [DSChiDoan, setListChiDoan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIDLop, setSelectedIDLop] = useState(null);
  const [pageSize, setPageSize] = useState(5);

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
    fetchDSChiDoan();
    fetchAllData();
  }, [currentPage, totalPages]);

  const fetchDSChiDoan = async () => {
    try {
      let res = await getAllTruong(currentPage);

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

  const [searchMany, setsearchMany] = useState({
    info: "",
  });

  const handleManySearch = async () => {
    try {
      const trimmedInfo = searchMany.info.trim().toLowerCase();
      let res = await searchManyTenTruong({ trimmedInfo }); // Assuming you have implemented the search API
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
        let res = await getAllTruong(page);

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
        "Tên trường/khoa": item.TenTruong,
        "Email": item.EmailTruong,
};
    });

    // Tạo một đối tượng Workbook từ mảng dữ liệu
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachTruong");

    // Xuất file Excel
    XLSX.writeFile(wb, "DanhSachTruong.xlsx");
  };

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const handleDelete = async () => {
    try {
      await XoaTruong(selectedIDLop);
      setShowModal(false);
      setShowModal1(true);
      fetchDSChiDoan();
      console.log("Chi đoàn đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  const calculateIndex = (pageIndex, pageSize, itemIndex) => {
    return (pageIndex - 1) * pageSize + itemIndex + 1;
  };

  const handleViewButtonClick = (itemID) => {
    localStorage.setItem("IDTruong", itemID);
    navigate(`/DaiHocCanTho/DoanTruong`);
  };

  const handleEditButtonClick = (itemID) => {
    localStorage.setItem("IDTruong", itemID);
    navigate(`/DaiHocCanTho/CapNhatTruongKhoa`);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h5 className="text-center">Danh Sách Trường/Khoa</h5>
        </div>
        <div className="searchDV laptop">
        <div className="">
            <div className="searchDV-input">
              <input
                type="text"
                className="search_name"
                placeholder="Tìm tên trường, email"
                value={searchMany.info}
                onChange={(e) => {
                  setsearchMany({ info: e.target.value });
                }}
              />
            </div>
            <button className="formatButton" onClick={handleManySearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <div className="buttonSearch">
            <NavLink to="/DaiHocCanTHo/ThemMoiTruong/Khoa">
              <button className="formatButton">
                {" "}
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </NavLink>
            <div>
              <button className="formatButton" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faCloudArrowDown} />
              </button>
            </div>
          </div>
        </div>

        <div className="searchDV tablet-mobile">
          <div className="searchDV-Right">
            <NavLink to="/DaiHocCanTHo/ThemMoiTruong/Khoa">
              <button className="formatButton">
                {" "}
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </NavLink>
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
                placeholder="Tìm tên trường, email"
                value={searchMany.info}
                onChange={(e) => {
                  setsearchMany({ info: e.target.value });
                }}
              />
            </div>
            <button className="formatButton" onClick={handleManySearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table table-striped mb-table">
            <thead>
              <tr>
                <th className="table-item1">STT</th>
                <th className="mb-tableItem">Tên trường/khoa</th>
                <th>Email</th>
                <th className="table-item2">Xem</th>
                <th className="table-item2">Cập nhật</th>
                <th className="table-item2">Xóa</th>
              </tr>
            </thead>
            <tbody id="myTable">
              {DSChiDoan &&
                DSChiDoan.length > 0 &&
                DSChiDoan.map((item, index) => {
                  const stt = calculateIndex(currentPage, pageSize, index);
                  return (
                    <tr key={`table-chidoan-${index}`} className="tableRow">
                      <td className=" col-center">{stt}</td>
                      <td className="mb-tableItem mb-tableItem1">
                        {item.TenTruong}
                      </td>
                      <td className="">{item.EmailTruong}</td>
                      <td className="btnOnTable1">
                        <button
                          className="btnOnTable"
                          onClick={() => handleViewButtonClick(item.IDTruong)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </td>
                      <td className="btnOnTable1">
                        <button
                          className="btnOnTable clcapnhat"
                          onClick={() => handleEditButtonClick(item.IDTruong)}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </td>
                      <td className="btnOnTable1">
                        <button
                          className="btnOnTable mauxoa"
                          onClick={() => {
                            setSelectedIDLop(item.IDTruong);
                            setShowModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {DSChiDoan && DSChiDoan.length === 0 && (
                <tr className="tablenone">
                  <td className="tablenone">Không có trường/khoa nào!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {DSChiDoan && DSChiDoan.length > 0 && (
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

      {DSChiDoan && DSChiDoan.length <= 5 && (
        <div className="pagination pagination">
          {/* You can add some message or content indicating that pagination is not shown */}
        </div>
      )}

      <DeleteConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        handleDelete={handleDelete}
      />

      <DeleteSuccess show={showModal1} onHide={() => setShowModal1(false)} />
    </>
  );
};

export default DanhSachChiDoan;
