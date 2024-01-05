import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

import {
  faEye,
  faMagnifyingGlass,
  faPenToSquare,
  faPlus,
  faTrash,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  namhoc,
  searchNamHoc,
  layTatCaDSDoanPhi,
  xoaMotDoanPhi,
} from "../../../services/apiService";

const DanhSachDoanPhi = (props) => {
  const [DSDoanPhi, setDSDoanPhi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedIDDoanPhi, setSelectedIDDoanPhi] = useState(null);
  const [NamHoc, setNamHoc] = useState([]);

  const [searchData, setSearchData] = useState({
    TenNamHoc: ""
  });

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchDSDoanPhi();
    fetchDSNamHoc();
  }, [currentPage, totalPages]);

  const fetchDSDoanPhi = async () => {
    try {
      let res = await layTatCaDSDoanPhi(currentPage);
      console.log(res);

      if (res.status === 200) {
        setDSDoanPhi(res.data.dataDP);
        setTotalPages(res.data.totalPages);
      } else {
        // Xử lý trường hợp lỗi
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

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  const handleSearch = async () => {
    try {
      let res = await searchNamHoc({
        ...searchData,
      });
      console.log(res);
      if (res.status === 200) {
        setDSDoanPhi(res.data.dataDP);
      } else {
        console.error("Lỗi khi tìm kiếm:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error.message);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Hàm xử lý khi nhấn nút sang trái
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const handleDelete = async () => {
    try {
      await xoaMotDoanPhi(selectedIDDoanPhi);
      setShowModal(false);
      setShowModal1(true);
      fetchDSDoanPhi();
      console.log("Đoàn phí đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa đoàn phí:", error);
    }
  };

  return (
    <>
      <div className="container-fluid app__content">
        <h5 className="text-center">Danh Sách Đoàn Phí</h5>
        <div className="searchDV">
          <div className="">       
            <div className="searchDV-input">
              <select
                className="search_name"
                value={searchData.TenNamHoc}
                onChange={(e) => {
                  setSearchData({
                    ...searchData,
                    TenNamHoc: e.target.value,
                  });
                }}
              >
                <option value="" disabled>
                  Chọn năm học
                </option>
                {NamHoc.map((namhoc, index) => {
                  return (
                    <option key={index} value={namhoc.TenNamHoc}>
                      {namhoc.TenNamHoc}
                    </option>
                  );
                })}
              </select>
            </div>
            <button className="formatButton" onClick={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} /> Tìm
            </button>
          </div>
          <div className="buttonSearch">
          <NavLink to="/BCH-DoanTruong/ThemMoi-DoanPhi">
                <button className="formatButton">
                  {" "}
                  <FontAwesomeIcon icon={faPlus} /> Thêm
                </button>
              </NavLink>
          </div>
        </div>

        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-item1">STT</th>
                <th>Tên đoàn phí</th>
                <th>Năm học</th>
                <th>Số tiền/Đoàn viên</th>
                <th className="table-item2">Chi tiết</th>
                <th className="table-item2">Cập nhật</th>
                <th className="table-item2">Xóa</th>
              </tr>
            </thead>
            <tbody id="myTable">
              {DSDoanPhi &&
                DSDoanPhi.length > 0 &&
                DSDoanPhi.map((item, index) => {
                  return (
                    <tr key={`table-chidoan-${index}`} className="tableRow">
                      <td className="col-center">{index + 1}</td>
                      <td className="">{item.TenDoanPhi}</td>
                      <td className="col-center">{item.TenNamHoc}</td>
                      <td className="col-right">{formatCurrency(item.SoTien)}</td>

                      <td className="btnOnTable1">
                        <NavLink
                          to={`/BCH-DoanTruong/ChiTietChiDoan`}
                        >
                          <button className="btnOnTable ">
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </NavLink>
                      </td>
                      <td className="btnOnTable1">
                      <NavLink
                          to={`/BCH-DoanTruong/DoanPhi/ChiTiet/${item.IDDoanPhi}`}
                        >

                      <button className="btnOnTable ">
                        <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        </NavLink>
                      </td>
                      <td className="btnOnTable1">
                      <button className="btnOnTable" onClick={() => { setSelectedIDDoanPhi(item.IDDoanPhi); setShowModal(true)}}>
                        <FontAwesomeIcon icon={faTrash} />
                          </button>
                      </td>
                    </tr>
                  );
                })}
              {DSDoanPhi && DSDoanPhi.length === 0 && (
                <tr className="tablenone">
                  <td className="tablenone">Không có đoàn phí nào!</td>
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

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton className="border-none">
          <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
          Bạn chắc chắn xóa?
        </Modal.Body>
        <Modal.Footer className="border-none">
          <button
            className="allcus-button button-error"
            onClick={() => handleDelete()}
          >
            Xóa
          </button>
          <button className="allcus-button" onClick={() => setShowModal(false)}>
            Đóng
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal1}
        onHide={() => setShowModal1(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton className="border-none">
          <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
          Xóa thành công!
        </Modal.Body>
        <Modal.Footer className="border-none">
          <NavLink
            to={`/BCH-DoanTruong/DoanPhi`}
            className="navlink"
          >
            <button
              className="allcus-button"
              onClick={() => setShowModal1(false)}
            >
              Đóng
            </button>
          </NavLink>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DanhSachDoanPhi;
