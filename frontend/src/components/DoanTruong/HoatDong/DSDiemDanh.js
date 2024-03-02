import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../Modal/Modal";
import * as XLSX from "xlsx";

import { faSave, faEye, faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
import {
  LayDSDiemDanh,
  SaveCheckboxStatesDiemDanh,
} from "../../../services/apiService";

const DiemDanh = (props) => {
  const navigate = useNavigate();

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
    // Thêm logic kiểm tra hạn của token nếu cần
    return true;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }
    fetchDSDiemDanh();
  }, [IDHoatDong]);

  useEffect(() => {
    const initialCheckboxStates = DSDiemDanh.map((item) => item.Check === 1);
    setCheckboxStates(initialCheckboxStates);
  }, [DSDiemDanh]);

  const fetchDSDiemDanh = async () => {
    try {
      let res = await LayDSDiemDanh(IDHoatDong, IDNamHoc);
      console.log("API Response:", res.data); 
      if (res.status === 200) {
        setDSDiemDanh(res.data.ChiTietHD);
        setTenHoatDong(res.data.TenHoatDong);
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
        IDDiemDanh: item.IDDiemDanh, // Replace with the actual property name
        isChecked: checkboxStates[index],
      }));

      console.log(dataToSave)
  
      let res = await SaveCheckboxStatesDiemDanh(IDHoatDong, dataToSave);
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

  const handleViewButtonClick = (itemID) => {
    localStorage.setItem("IDLop", itemID);
    navigate(`/BCH-DoanTruong/ChiTietHoatDong/DiemDanhChiDoan/${IDHoatDong}/${IDNamHoc}/DanhSachDiemDanhCuaChiDoan`);
  };

  const exportToExcel = () => {
    try {
      const filteredData = DSDiemDanh.map((item) => ({
        'Mã chi đoàn': item.MaLop,
        'Tên chi đoàn': item.TenLop,
        'Khóa': item.Khoa,
        'Điểm danh': item.Check === 1 ? 'X' : '',
      }));
  
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(filteredData);
  
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      const fileName = TenHoatDong; // Tên file sẽ là nội dung của thẻ h2, bạn có thể thay đổi theo yêu cầu
  
      // Tải file
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      const url = window.URL.createObjectURL(data);
      a.href = url;
      a.download = `${fileName}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error.message);
    }
  };

  return (
    <>
      <div className="container-fluid app__content">
        <h5 className="text-center">{TenHoatDong} ({TenNamHoc})</h5>

        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-item1">STT</th>
                <th className="mb-tableItem">Mã chi đoàn</th>
                <th>Tên chi đoàn</th>
                <th>Khóa</th>
                <th>Điểm danh</th>
                <th>DS điểm danh</th>
              </tr>
            </thead>
            <tbody id="myTable">
              {DSDiemDanh &&
                DSDiemDanh.length > 0 &&
                DSDiemDanh.map((item, index) => {
                  return (
                    <tr key={`table-chidoan-${index}`} className="tableRow">
                      <td className="col-center">{index + 1}</td>
                      <td className="mb-tableItem mb-tableItem1">{item.MaLop}</td>
                      <td className="">{item.TenLop}</td>
                      <td className="col-center">{item.Khoa}</td>
                      <td className="col-center">
                        <input
                          type="checkbox"
                          checked={checkboxStates[index]}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      <td className="col-center" onClick={() =>
                              handleViewButtonClick(item.IDLop)
                            }>
                              <button className="btnOnTable ">

                              <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                              </button>
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

          <div>
            <div className="searchDV-Right">

          <button className="formatButton" onClick={exportToExcel}>
              <FontAwesomeIcon icon={faCloudArrowDown} /> Tải xuống
            </button>
            <button className="formatButton" onClick={handleSave}>
              <FontAwesomeIcon icon={faSave} /> Lưu
            </button>
            </div>
          </div>
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

export default DiemDanh;
