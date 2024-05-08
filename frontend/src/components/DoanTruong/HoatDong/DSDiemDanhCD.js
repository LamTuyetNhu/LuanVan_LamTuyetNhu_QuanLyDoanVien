import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import Modal from "../../Modal/Modal";
import { faSave, faCloudArrowDown, faCamera } from "@fortawesome/free-solid-svg-icons";
import {
  LayDSDiemDanhCuaLop,
  SaveCheckboxStatesDiemDanhCuaLop,
} from "../../../services/apiService";
import * as XLSX from "xlsx";
const DiemDanh = (props) => {
  const navigate = useNavigate();
  const IDLop = localStorage.getItem("IDLop");

  const [DSDiemDanh, setDSDiemDanh] = useState([]);
  const [TenHoatDong, setTenHoatDong] = useState([]);

  const [TenNamHoc, setTenNamHoc] = useState([]);

  const [checkboxStates, setCheckboxStates] = useState([]);
  const { IDHoatDong, IDNamHoc } = useParams();

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }
    fetchDSDiemDanh();
  }, [IDHoatDong, IDNamHoc]);

  useEffect(() => {
    const initialCheckboxStates = DSDiemDanh.map((item) => item.Check === 1);
    setCheckboxStates(initialCheckboxStates);
  }, [DSDiemDanh]);

  const fetchDSDiemDanh = async () => {
    try {
      let res = await LayDSDiemDanhCuaLop(IDLop, IDHoatDong, IDNamHoc);
      console.log("API Response:", res.data);
      if (res.status === 200) {
        setDSDiemDanh(res.data.ChiTietHD);
        setTenHoatDong(res.data.TenHoatDong);
        setTenNamHoc(res.data.TenNamHoc);
        setTenNamHoc(res.data.TenNamHoc);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
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
      const dataToSave = DSDiemDanh.map((item, index) => ({
        IDDDDoanVien: item.IDDDDoanVien, // Replace with the actual property name
        isChecked: checkboxStates[index],
      }));

      console.log(dataToSave);

      let res = await SaveCheckboxStatesDiemDanhCuaLop(IDHoatDong, dataToSave);
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
      const filteredData = DSDiemDanh.map((item) => ({
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

      const fileName = TenHoatDong; // Tên file sẽ là nội dung của thẻ h2, bạn có thể thay đổi theo yêu cầu

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

  return (
    <>
      <div className="container-fluid app__content">
        <h5 className="text-center">{TenHoatDong}</h5>
        <h6 className="text-center">{TenNamHoc}</h6>
        {/* <div className="searchDV-Right">
              <NavLink to={`/BCH-DoanTruong/DiemDanhGuongMat/${IDHoatDong}`}>
                <button className="formatButton">
                  <FontAwesomeIcon icon={faCamera} /> Điểm danh bằng gương mặt
                </button>
              </NavLink>
            </div> */}
        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-item1">STT</th>
                <th className="mb-tableItem">MSSV</th>
                <th>Tên đoàn viên </th>
                <th>Điểm danh</th>
              </tr>
            </thead>
            <tbody id="myTable">
              {DSDiemDanh &&
                DSDiemDanh.length > 0 &&
                DSDiemDanh.map((item, index) => {
                  return (
                    <tr key={`table-chidoan-${index}`} className="tableRow">
                      <td className="col-center">{index + 1}</td>
                      <td className="mb-tableItem mb-tableItem1">
                        {item.MSSV}
                      </td>
                      <td className="">{item.HoTen}</td>
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
              {DSDiemDanh && DSDiemDanh.length === 0 && (
                <tr className="tablenone">
                  <td className="tablenone">Chưa có có chi đoàn nào!</td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
          {DSDiemDanh && DSDiemDanh.length > 0 && (
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
          <br />
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

export default DiemDanh;
