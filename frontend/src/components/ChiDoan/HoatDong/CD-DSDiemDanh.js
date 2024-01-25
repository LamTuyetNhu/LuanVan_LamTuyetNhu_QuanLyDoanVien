import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../Modal/Modal";
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  LayDSDiemDanhCuaLop,
  SaveCheckboxStatesDiemDanhCuaLop,
} from "../../../services/apiService";

const DiemDanh = (props) => {
  const { IDLop } = useParams();

  const [DSDiemDanh, setDSDiemDanh] = useState([]);
  const [TenHoatDong, setTenHoatDong] = useState([]);
  const [TenNamHoc, setTenNamHoc] = useState([]);

  const [checkboxStates, setCheckboxStates] = useState([]);
  const { IDHoatDong, IDNamHoc } = useParams();

  useEffect(() => {
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

  return (
    <>
      <div className="container-fluid app__content">
        <h5 className="text-center">
          {TenHoatDong} - {TenNamHoc}
        </h5>

        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-item1">STT</th>
                <th>MSSV</th>
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
                      <td className="">{item.MSSV}</td>
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

          {DSDiemDanh && DSDiemDanh.length > 0 && (
            <div>
              <button className="formatButton btnRight" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} /> Lưu
              </button>
            </div>
          )}
        </div>
        <div className="margin-bottom"></div>

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
