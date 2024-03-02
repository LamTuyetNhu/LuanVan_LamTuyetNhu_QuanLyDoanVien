import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "../../Modal/DeleteConfirmationModal";
import DeleteSuccess from "../../Modal/DeleteSuccess";
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
  layTatCaDSDoanPhi,
  xoaMotDoanPhi,
} from "../../../services/apiService";

const DanhSachDoanPhi = (props) => {
  const navigate = useNavigate();
  const IDTruong = localStorage.getItem("IDTruong");

  const [DSDoanPhi, setDSDoanPhi] = useState([]);

  const [selectedIDDoanPhi, setSelectedIDDoanPhi] = useState(null);

  const [idnamhoc, setIDNamHoc] = useState(1);
  const [NamHoc, setNamHoc] = useState([]);
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
    fetchDSDoanPhi();
    fetchDSNamHoc();
  }, [idnamhoc, IDTruong]);

  const fetchDSDoanPhi = async () => {
    try {
      let res = await layTatCaDSDoanPhi(IDTruong, idnamhoc);
      console.log(res);

      if (res.status === 200) {
        setDSDoanPhi(res.data.dataDP);
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

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setIDNamHoc(selectedIDNamHoc);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h5 className="text-center">Danh Sách Đoàn Phí</h5>
          <div className="searchDV-input"> Năm học: 
            <select
              type="text"
              className="search_name"
              value={idnamhoc}
              onChange={handleNamHocChange}
            >
              {NamHoc.map((item, index) => {
                return (
                  <option key={index} value={item.IDNamHoc}>
                    {item.TenNamHoc}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="searchDV-Right">
          <div className="buttonSearch">
            <NavLink to="/BCH-DoanTruong/ThemMoi-DoanPhi">
              <button className="formatButton">
                {" "}
                <FontAwesomeIcon icon={faPlus} /> 
              </button>
            </NavLink>
          </div>
        </div>

        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-item1">STT</th>
                <th className="mb-tableItem">Tên đoàn phí</th>
                <th>Năm học</th>
                <th>Số tiền/Đoàn viên</th>
                <th className="table-item2">DS thu đoàn phí</th>
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
                      <td className="mb-tableItem mb-tableItem1">{item.TenDoanPhi}</td>
                      <td className="col-center">{item.TenNamHoc}</td>
                      <td className="col-right">
                        {formatCurrency(item.SoTien)}
                      </td>

                      <td className="btnOnTable1">
                        <NavLink
                          to={`/BCH-DoanTruong/DoanPhi/ChiTietDoanPhi/${item.IDDoanPhi}/${item.IDNamHoc}`}
                        >
                          <button className="btnOnTable">
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </NavLink>
                      </td>
                      <td className="btnOnTable1">
                        <NavLink
                          to={`/BCH-DoanTruong/DoanPhi/ChiTiet/${item.IDDoanPhi}`}
                        >
                          <button className="btnOnTable clcapnhat">
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        </NavLink>
                      </td>
                      <td className="btnOnTable1">
                        <button
                          className="btnOnTable mauxoa"
                          onClick={() => {
                            setSelectedIDDoanPhi(item.IDDoanPhi);
                            setShowModal(true);
                          }}
                        >
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

      <DeleteConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        handleDelete={handleDelete}
      />

      <DeleteSuccess show={showModal1} onHide={() => setShowModal1(false)} />
    </>
  );
};

export default DanhSachDoanPhi;
