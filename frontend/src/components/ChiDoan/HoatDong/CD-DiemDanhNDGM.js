import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef, } from "react";
import { format } from "date-fns";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { faSave, faEdit, faBackward } from "@fortawesome/free-solid-svg-icons";
import { laytenlop, layMSSVdoanvien } from "../../../services/apiService";
import axios from "axios";
import ModalAddSuccess from "../../Modal/ModalAddSuccess";
import Modal1 from "../../Modal/Modal";
const SinhVienNamTot = (props) => {
  const [doanVienDetails, setDoanVienDetails] = useState([]);
  const [diemDanhData, setDiemDanhData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái để kiểm soát nút Điểm danh/Lưu
  const { IDHoatDong } = useParams();
  const IDLop = localStorage.getItem("IDLop");
  const [MaLop, setMaLop] = useState([])

  const navigate = useNavigate();
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchTenLop()
    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }

    const fetchDataForMSSV = async (MSSV) => {
      try {
        const response = await layMSSVdoanvien(MSSV);
        console.log(response.data);
        // Thêm đối tượng vào mảng doanVienDetails
        setDoanVienDetails((prevDetails) => [...prevDetails, response.data.dataDV]); // Giả sử response.data.dataDV là đối tượng bạn muốn thêm
      } catch (error) {
        console.error("Lỗi khi gọi API cho MSSV", MSSV, error);
      }
    };
  
    const fetchDoanVienDetails = async () => {
      // Duyệt qua mỗi phần tử trong mảng diemDanhData và gọi API cho từng MSSV
      try {
        await Promise.all(
          diemDanhData.flatMap((subArray) =>
            subArray.map((MSSV) => fetchDataForMSSV(MSSV))
          )
        );
      } catch (error) {
        console.error("Lỗi khi gọi API cho mảng MSSV", error);
      }
    };
  
    if (diemDanhData.length > 0) {
      fetchDoanVienDetails();
    }
  }, [IDHoatDong, diemDanhData, IDLop]);

  
  const fetchTenLop = async () => {
    try {
      let res = await laytenlop(IDLop);
      console.log(res);

      if (res.status === 200) {
        setMaLop(res.data.dataCD.MaLop)

      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImageUrls, setSelectedImageUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsError, setModalIsError] = useState(false);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files); // Lưu trữ các files thực tế để tải lên
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImageUrls(imageUrls); // Dùng để hiển thị preview
  };

  const handleSubmit = async () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/predict_images/${MaLop}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response.data);
        setDiemDanhData(response.data); // Lưu dữ liệu vào state
        setIsSubmitting(true); // Để thay đổi trạng thái của nút
      } catch (error) {
        setModalMessage("Điểm danh thất bại: " + error.message);
        setModalIsError(true);
        setShowModal(true);
      }
    } else {
      // Hiển thị thông báo nếu người dùng chưa chọn ảnh
      setModalMessage("Vui lòng chọn ít nhất một ảnh để điểm danh.");
      setModalIsError(true);
      setShowModal(true);
    }
  };

  const idDoanVienList = doanVienDetails.flatMap(detail => detail.map(dv => dv.IDDoanVien));
  const payload = {
    IDHoatDong: IDHoatDong,
    IDDoanVienList: idDoanVienList
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/SaveIDDoanVienDiemDanhCuaLop", payload);
      // Xử lý sau khi lưu thành công
      setModalMessage("Điểm danh thành công!");
      setModalIsError(false);
      setShowModal(true);
    } catch (error) {
      // Xử lý lỗi khi lưu
      setModalMessage("Lưu điểm danh thất bại: " + error.message);
      setModalIsError(true);
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center mg-bt">Điểm Danh Chi Đoàn</h2>

        <div id="upload-box" className="upload-box">
          <div id="image-gallery" className="image-gallery">
            {selectedImageUrls.map((image, index) => (
              <img key={index} src={image} alt={`upload-preview-${index}`} />
            ))}
          </div>

          <label htmlFor="image-upload" className="upload-icon">
            📷 Chọn ảnh đoàn viên
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="text-center error-message error-message1"></div>
        {doanVienDetails.length > 0 && (
  <table className="table table-striped">
    <thead>
      <tr className="table-item">
        <th>STT</th>
        <th>MSSV</th>
        <th>Họ Tên</th>
      </tr>
    </thead>
    <tbody>
      {doanVienDetails.flatMap((detail, index) =>
        detail.map((item, subIndex) => (
          <tr key={`${index}-${subIndex}`}>
            <td className="col-center">{index * doanVienDetails[0].length + subIndex + 1}</td>
            <td>{item.MSSV}</td>
            <td>{item.HoTen}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
)}
        <div className="update row">
          <div className="btns">
            <button
              className="allcus-button bgcapnhat"
              onClick={isSubmitting ? handleSave : handleSubmit}
            >
              <FontAwesomeIcon icon={isSubmitting ? faSave : faEdit} />{" "}
              {isSubmitting ? "Lưu" : "Điểm danh"}
            </button>

            <button className="allcus-button button-error" type="submit">
                <NavLink to="/ChiDoan" className="navlink">
                  Hủy
                </NavLink>
              </button>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal1
          show={showModal}
          onHide={() => setShowModal(false)}
          message={modalMessage}
          isError={modalIsError}
        />
      )}
      {/* <ModalAddSuccess show={showModal} onHide={() => setShowModal(false)} /> */}
    </>
  );
};

export default SinhVienNamTot;
