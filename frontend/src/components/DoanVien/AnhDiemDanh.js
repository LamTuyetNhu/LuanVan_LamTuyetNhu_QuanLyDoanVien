import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { useNavigate, NavLink } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { faSave, faEdit, faBackward } from "@fortawesome/free-solid-svg-icons";
import { namhoc, KetQuaCuaMotDoanVien } from "../../services/apiService";
import axios from "axios";
import ModalAddSuccess from "../Modal/ModalAddSuccess";
import Modal1 from "../Modal/Modal";
const SinhVienNamTot = (props) => {
  const IDDoanVien = localStorage.getItem("IDDoanVien");

  const navigate = useNavigate();
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
  }, []);

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

  const [errors, setErrors] = useState({
    email: "",
  });

  const handleSubmit = async () => {
    const formData = new FormData();

    if (selectedFiles.length < 4) {
      const newErrors = {
        lengthImg: "Vui lòng chọn ít nhất 4 tấm ảnh!"
      };
      setErrors(newErrors);
      return;
    }

    selectedFiles.forEach((file, index) => {
      formData.append(`file`, file);
    });

    try {
      const response = await axios.post(
        `http://localhost:8080/api/AnhDiemDanh/${IDDoanVien}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // console.log("Upload success:", response.data);
        // setShowModal(true);
        setModalMessage("Thêm ảnh thành công!");
        setModalIsError(false);
        setShowModal(true);
      } else {
        setModalMessage("Thêm ảnh thất bại!");
        setModalIsError(true);
        setShowModal(true);
        console.error("Lỗi khi gọi API:", response.statusText);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center mg-bt">Ảnh Điểm Danh</h2>

        <div id="upload-box" className="upload-box">
          <div id="image-gallery" className="image-gallery">
            {selectedImageUrls.map((image, index) => (
              <img key={index} src={image} alt={`upload-preview-${index}`} />
            ))}
          </div>

          <label htmlFor="image-upload" className="upload-icon">
            📷 Tải ít nhất 4 ảnh của bạn
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
        <div className="text-center error-message error-message1">{errors.lengthImg}</div>
        <div className="update row">
          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink to={`/DoanVien`} className="navlink">
                <FontAwesomeIcon icon={faBackward} />
              </NavLink>
            </button>

            <button
              className="allcus-button bgcapnhat"
              onClick={handleSubmit}
              // onClick={handleToggleEdit}
            >
              <FontAwesomeIcon icon={faEdit} /> Lưu
            </button>
            {/* )} */}
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
