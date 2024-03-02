import { NavLink, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "../../Modal/DeleteConfirmationModal";
import DeleteSuccess from "../../Modal/DeleteSuccess";
import {
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import {
  namhoc,
  layDSDoanPhiCuaLop,
  xoaMotDoanPhi,
} from "../../../services/apiService";

const DanhSachDoanPhi = (props) => {
  const navigate = useNavigate();
  const IDLop = localStorage.getItem("IDLop");

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
  }, [IDLop, idnamhoc]);

  const fetchDSDoanPhi = async () => {
    try {
      let res = await layDSDoanPhiCuaLop(IDLop, idnamhoc);
      console.log(res);

      if (res.status === 200) {
        setDSDoanPhi(res.data.dataDP);
      } else {
        // Xử lý trường hợp lfỗi
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
          <div className="searchDV-input">Năm học:
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

        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-item1">STT</th>
                <th className="mb-tableItem">Tên đoàn phí</th>
                <th>Năm học</th>
                <th>Số tiền/Đoàn viên</th>
                <th className="table-item2">Danh sách thu đoàn phí</th>
              </tr>
            </thead>
            <tbody id="myTable">
              {DSDoanPhi &&
                DSDoanPhi.length > 0 &&
                DSDoanPhi.map((item, index) => {
                  return (
                    <tr key={`table-chidoan-${index}`} className="tableRow">
                      <td className="col-center">{index + 1}</td>
                      <td className="mb-tableItem mb-tableItem1" >{item.TenDoanPhi}</td>
                      <td className="col-center">{item.TenNamHoc}</td>
                      <td className="col-right">
                        {formatCurrency(item.SoTien)}
                      </td>

                      <td className="btnOnTable1 ">
                        <NavLink
                          to={`/ChiDoan/ChiTietDoanPhi/${item.IDDoanPhi}/${item.IDNamHoc}`}
                        >
                          <button className="btnOnTable clcapnhat">
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </NavLink>
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
