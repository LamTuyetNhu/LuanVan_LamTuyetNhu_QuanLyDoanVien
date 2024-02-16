import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../Modal/Modal";
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  LayDSNopDoanPhiCuaMotLop,
  SaveCheckboxStatesCuaMotLop,
} from "../../../services/apiService";

const NopDoanPhi = (props) => {
  const [DSNopDoanPhi, setDSNopDoanPhi] = useState([]);
  const [TenDP, setTenDP] = useState([]);
  const [TenNamHoc, setTenNamHoc] = useState([]);

  const [checkboxStates, setCheckboxStates] = useState([]);
  const {  IDDoanPhi, IDNamHoc } = useParams();
  const IDLop = localStorage.getItem("IDLop");

  useEffect(() => {
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

      console.log(dataToSave)
  
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

  return (
    <>
      <div className="container-fluid app__content">
        <h5 className="text-center">{TenDP} - {TenNamHoc}</h5>

        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-item1">STT</th>
                <th>MSSV</th>
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
                      <td className="">{item.MSSV}</td>
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

          <div>
            <button className="formatButton btnRight" onClick={handleSave}>
              <FontAwesomeIcon icon={faSave} /> Lưu
            </button>
          </div>
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

export default NopDoanPhi;
