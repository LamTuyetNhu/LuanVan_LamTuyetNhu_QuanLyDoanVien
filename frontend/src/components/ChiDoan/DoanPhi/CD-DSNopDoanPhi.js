import { NavLink , useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../Modal/Modal";
import * as XLSX from "xlsx";
import {
  faSave,
  faCloudArrowDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import {
  searchManyDoanPhiCuaDoanVien,
  LayDSNopDoanPhiCuaMotLop,
  SaveCheckboxStatesCuaMotLop,
} from "../../../services/apiService";

const NopDoanPhi = (props) => {
  const navigate = useNavigate();
  const [DSNopDoanPhi, setDSNopDoanPhi] = useState([]);
  const [TenDP, setTenDP] = useState([]);
  const [TenNamHoc, setTenNamHoc] = useState([]);

  const [checkboxStates, setCheckboxStates] = useState([]);
  const { IDDoanPhi, IDNamHoc } = useParams();
  const IDLop = localStorage.getItem("IDLop");

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
    fetchDSNopDoanPhi();
  }, [IDDoanPhi, IDNamHoc]);

  useEffect(() => {
    const initialCheckboxStates = DSNopDoanPhi.map((item) => item.Check === 1);
    setCheckboxStates(initialCheckboxStates);
  }, [DSNopDoanPhi]);

  const fetchDSNopDoanPhi = async () => {
    try {
      let res = await LayDSNopDoanPhiCuaMotLop(IDLop, IDDoanPhi, IDNamHoc);
      console.log("API Response:", res.data);
      if (res.status === 200) {
        setDSNopDoanPhi(res.data.ChiTietDoanPhi);
        setTenDP(res.data.TenDoanPhi);
        setTenNamHoc(res.data.TenNamHoc);
      } else {
        // Xử lý trường hợp lỗi
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

  const handleCheckboxChange = (index) => {
    setCheckboxStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const handleSave = async () => {
    try {
      const dataToSave = DSNopDoanPhi.map((item, index) => ({
        IDThuDP: item.IDThuDP, // Replace with the actual property name
        isChecked: checkboxStates[index],
      }));

      console.log(dataToSave);

      let res = await SaveCheckboxStatesCuaMotLop(IDDoanPhi, dataToSave);
      if (res.status === 200) {
        setModalMessage("Cập nhật thành công!");
        setIsErrorModal(false);
        setShowModal(true);
        console.log("Lưu trạng thái thành công!");
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
        setModalMessage("Cập nhật thất bại");
        setIsErrorModal(true);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isErrorModal, setIsErrorModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
    setIsErrorModal(false);
  };

  const exportToExcel = () => {
    try {
      const filteredData = DSNopDoanPhi.map((item) => ({
        MSSV: item.MSSV,
        "Tên đoàn viên": item.HoTen,
        "Điểm danh": item.Check === 1 ? "X" : "",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(filteredData);

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = TenDP; // Tên file sẽ là nội dung của thẻ h2, bạn có thể thay đổi theo yêu cầu

      // Tải file
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      const url = window.URL.createObjectURL(data);
      a.href = url;
      a.download = `${fileName}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error.message);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const filteredData = DSNopDoanPhi.filter((item) => {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      return (
        item.MSSV.toLowerCase().includes(lowerCaseSearchQuery) ||
        item.HoTen.toLowerCase().includes(lowerCaseSearchQuery)
      );
    });

    setDSNopDoanPhi(filteredData);
  };

  return (
    <>
      <div className="container-fluid app__content">
      <div className="namhoc-center">

        <h5 className="text-center">
          {TenDP} <br /> {TenNamHoc}
        </h5>
      </div>

        <div className="search">
          <div className="searchDV">
            <div className="">
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name "
                  placeholder="Tìm mã, tên đoàn viên"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="formatButton" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </div>
        </div>

        <div className="listDV">

        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-item1">STT</th>
                <th className="mb-tableItem">MSSV</th>
                <th>Tên đoàn viên</th>
                <th>Số tiền</th>
                <th>Đã đóng</th>
              </tr>
            </thead>
            <tbody id="myTable">
              {DSNopDoanPhi &&
                DSNopDoanPhi.length > 0 &&
                DSNopDoanPhi.map((item, index) => {
                  return (
                    <tr key={`table-chidoan-${index}`} className="tableRow">
                      <td className="col-center">{index + 1}</td>
                      <td className="mb-tableItem mb-tableItem1">
                        {item.MSSV}
                      </td>
                      <td className="">{item.HoTen}</td>

                      <td className="col-right">
                        {formatCurrency(item.SoTienLop)}
                      </td>
                      <td className="col-center">
                        <input
                          type="checkbox"
                          checked={checkboxStates[index]}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                    </tr>
                  );
                })}
              {DSNopDoanPhi && DSNopDoanPhi.length === 0 && (
                <tr className="tablenone">
                  <td className="tablenone">Chưa có có chi đoàn đóng phí!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {DSNopDoanPhi && DSNopDoanPhi.length > 0 && (
        <div className="">
          <div className="searchDV-Right">
            <button className="formatButton" onClick={exportToExcel}>
              <FontAwesomeIcon icon={faCloudArrowDown} /> Tải xuống
            </button>
            <button className="formatButton" onClick={handleSave}>
              <FontAwesomeIcon icon={faSave} /> Lưu
            </button>
          </div>
        </div>
        )}
        <br/>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        message={modalMessage}
        isError={isErrorModal}
      />
    </>
  );
};

export default NopDoanPhi;
