import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ModalSuccess from "../../Modal/ModalSuccess";
import axios from "axios";
import DeleteSuccess from "../../Modal/DeleteSuccess";
import DeleteConfirmationModal from "../../Modal/DeleteConfirmationModal";
import {
  faBackward,
  faSave,
  faEdit,
  faCamera,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import {
  chucvu,
  LayTonGiao,
  LayDanToc,
  layDSChucVuBCH,
  laytenBCH,
  XoaBCHTruong,
  XoaChiTietBCHTruong,
} from "../../../services/apiService";

const DoanVien = (props) => {
  const navigate = useNavigate();
  const IDBCH = localStorage.getItem("IDBCH");

  const [DoanVien, setDoanVien] = useState([]);
  const [CVDoanVien, setCVDoanVien] = useState([]);
  const [DGDoanVien, setDGDoanVien] = useState([]);

  const [DanToc, setDanToc] = useState([]);
  const [TonGiao, setTonGiao] = useState([]);
  const [ChucVu, setChucVu] = useState([]);
  const [listIDChucVu, setListIDChucVu] = useState([]);
  const [listIDDanhGia, setListIDDanhGia] = useState([]);

  const [editedDoanVien, seteditedDoanVien] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [logo, setLogo] = useState("http://localhost:8080/images/logo.jpg");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

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
    layMotDoanVien();
    fetchChucVu();
    fetchTonGiao();
    fetchDanToc();
    DSChucVuDoanVien();
  }, [IDBCH]);

  const handleDelete = async () => {
    try {
      await XoaBCHTruong(IDBCH);
      setShowModal(false);
      setShowModal1(true);
      console.log("Hoạt động đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  const formatToTwoDigits = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  const layMotDoanVien = async () => {
    try {
      let res = await laytenBCH(IDBCH);
      if (res.status === 200) {
        const { dataDV, dataCV } = res.data;
        // Assuming dataDV contains basic information and dataCV contains roles (ChucVu)
        const mergedData = {
          ...dataDV,
          CVDoanVien: dataCV, // assuming dataCV is an array of ChucVu
        };

        // Format dates in the desired format with leading zeros
        const ngaySinhDate = new Date(mergedData.NgaySinhBCH);
        const formattedNgaySinh = `${formatToTwoDigits(
          ngaySinhDate.getDate()
        )}/${formatToTwoDigits(
          ngaySinhDate.getMonth() + 1
        )}/${ngaySinhDate.getFullYear()}`;

        const ngayVaoDoanDate = new Date(mergedData.NgayVaoDoanBCH);
        const formattedNgayVaoDoan = `${formatToTwoDigits(
          ngayVaoDoanDate.getDate()
        )}/${formatToTwoDigits(
          ngayVaoDoanDate.getMonth() + 1
        )}/${ngayVaoDoanDate.getFullYear()}`;

        // Assign the formatted dates to the properties
        mergedData.NgaySinhBCH = formattedNgaySinh;
        mergedData.NgayVaoDoanBCH = formattedNgayVaoDoan;

        setDoanVien(mergedData);
        seteditedDoanVien(mergedData);
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const DSChucVuDoanVien = async () => {
    try {
      let res = await layDSChucVuBCH(IDBCH);
      if (res.status === 200) {
        const { dataDV } = res.data;
        // Assuming dataDV contains roles (ChucVu)
        setCVDoanVien(dataDV);
        setListIDChucVu(dataDV.map((item) => item.IDChucVu));
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const fetchChucVu = async () => {
    try {
      let res = await chucvu();
      if (res.status === 200) {
        // setListKhoa(res.data.dataNH); // Cập nhật state với danh sách khóa học
        const ChucVuData = res.data.dataCV;

        // Kiểm tra nếu khoaData là mảng trước khi cập nhật state
        if (Array.isArray(ChucVuData)) {
          setChucVu(ChucVuData);
        } else {
          console.error("Dữ liệu khóa không hợp lệ:", ChucVuData);
        }
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const fetchDanToc = async () => {
    try {
      let res = await LayDanToc();
      if (res.status === 200) {
        // setListKhoa(res.data.dataNH); // Cập nhật state với danh sách khóa học
        const DanTocData = res.data.dataDT;

        // Kiểm tra nếu khoaData là mảng trước khi cập nhật state
        if (Array.isArray(DanTocData)) {
          setDanToc(DanTocData);
        } else {
          console.error("Dữ liệu khóa không hợp lệ:", DanTocData);
        }
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const fetchTonGiao = async () => {
    try {
      let res = await LayTonGiao();
      if (res.status === 200) {
        // setListKhoa(res.data.dataNH); // Cập nhật state với danh sách khóa học
        const TonGiaoData = res.data.dataTG;

        // Kiểm tra nếu khoaData là mảng trước khi cập nhật state
        if (Array.isArray(TonGiaoData)) {
          setTonGiao(TonGiaoData);
        } else {
          console.error("Dữ liệu khóa không hợp lệ:", TonGiaoData);
        }
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [errors, setErrors] = useState({
    TenBCH: "",
    MaBCH: "",
    EmailBCH: "",
    SoDTBCH: "",
    QueQuanBCH: "",
    GioiTinhBCH: "",
    NgaySinhBCH: "",
    NgayVaoDoanBCH: "",
    IDDanToc: "",
    IDTonGiao: "",
    IDChucVu: "",
    IDNamHoc: "",
  });

  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id.startsWith("CV_")) {
      // Handle changes in the table (Chức Vụ)
      const index = parseInt(id.split("_")[1]);
      handleChangeChucVu(value, index);
    } else {
      // Handle changes for other inputs
      seteditedDoanVien((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleToggleEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleUpLoadImage = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
      setImage(event.target.files[0]);
    }
  };

  const validateEmailBCH = (EmailBCH) => {
    return String(EmailBCH)
      .toLowerCase()
      .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  };

  const validatePhoneNumber = (sdt) => {
    return String(sdt).match(/^0[2-9][0-9]{8}$/);
  };

  const validateNgay = (Ngay) => {
    return String(Ngay).match(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    );
  };

  const handleChangeChucVu = (e, index) => {
    const { value } = e.target;

    // Update the Chức Vụ in the current row of CVDoanVien
    setCVDoanVien((prevCV) =>
      prevCV.map((item, i) =>
        i === index ? { ...item, IDChucVu: value } : item
      )
    );

    // Update the list of IDChucVu
    setListIDChucVu((prevList) => {
      const updatedList = [...prevList];
      updatedList[index] = value;
      return updatedList;
    });

    // Update editedDoanVien with the updated list of IDChucVu
    seteditedDoanVien((prevData) => ({
      ...prevData,
      IDChucVu: [...listIDChucVu],
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    console.log("editedDoanVien:", editedDoanVien);
    const newErrors = {
      EmailBCH: !editedDoanVien.EmailBCH
        ? "Vui lòng nhập Email"
        : !validateEmailBCH(editedDoanVien.EmailBCH)
        ? "Email không hợp lệ!"
        : "",
      TenBCH: !editedDoanVien.TenBCH ? "Vui lòng nhập họ tên" : "",
      MaBCH: !editedDoanVien.MaBCH ? "Vui lòng nhập mã cán bộ" : "",
      SoDTBCH: !editedDoanVien.SoDTBCH
        ? "Vui lòng nhập số điện thoại"
        : !validatePhoneNumber(editedDoanVien.SoDTBCH)
        ? "Số điện thoại không hợp lệ!"
        : "",
      QueQuanBCH: !editedDoanVien.QueQuanBCH ? "Vui lòng nhập quê quán" : "",
      GioiTinhBCH:
        editedDoanVien.GioiTinhBCH === undefined ||
        editedDoanVien.GioiTinhBCH === ""
          ? "Vui lòng nhập giới tính"
          : "",
      NgaySinhBCH: !editedDoanVien.NgaySinhBCH
        ? "Vui lòng nhập ngày sinh"
        : !validateNgay(editedDoanVien.NgaySinhBCH)
        ? "Ngày định dạng là dd/mm/yyyy"
        : "",

      NgayVaoDoanBCH: !editedDoanVien.NgayVaoDoanBCH
        ? "Vui lòng nhập ngày vào đoàn"
        : !validateNgay(editedDoanVien.NgayVaoDoanBCH)
        ? "Ngày định dạng là dd/mm/yyyy"
        : "",

      IDDanToc: !editedDoanVien.IDDanToc ? "Vui lòng nhập tên dân tộc" : "",
      IDTonGiao: !editedDoanVien.IDTonGiao ? "Vui lòng nhập tên tôn giáo" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("MaBCH", editedDoanVien.MaBCH);
      formData.append("TenBCH", editedDoanVien.TenBCH);
      formData.append("EmailBCH", editedDoanVien.EmailBCH);
      formData.append("SoDTBCH", editedDoanVien.SoDTBCH);
      formData.append("GioiTinhBCH", editedDoanVien.GioiTinhBCH);
      formData.append("NgaySinhBCH", editedDoanVien.NgaySinhBCH);
      formData.append("NgayVaoDoanBCH", editedDoanVien.NgayVaoDoanBCH);
      formData.append("IDDanToc", editedDoanVien.IDDanToc);
      formData.append("IDTonGiao", editedDoanVien.IDTonGiao);
      formData.append("IDChucVu", editedDoanVien.IDChucVu);
      formData.append("QueQuanBCH", editedDoanVien.QueQuanBCH);
      formData.append("IDBCH", IDBCH);
      formData.append("listIDChucVu", JSON.stringify(listIDChucVu));

      if (image instanceof Blob) {
        formData.append("file", image, image.name);
      }

      console.log(formData);
      let res = await axios.post(
        "http://localhost:8080/api/CapNhatBanChapHanh",
        formData
      );

      // Sau khi cập nhật thành công, cập nhật lại trạng thái ChiDoan và kết thúc chế độ chỉnh sửa
      setDoanVien(editedDoanVien);
      setShowModalUpdate(true);
      layMotDoanVien();
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };

  const handleDisplayButtonClick = async (itemID) => {
    try {
      await XoaChiTietBCHTruong(itemID);
      setCVDoanVien((prevCVDoanVien) =>
        prevCVDoanVien.filter((item) => item.IDChiTietNamHoc !== itemID)
      );

      setShowModal2(true);
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  return (
    <>
      <div className="container-fluid app__content">
        <h2 className="text-center">Ban Chấp Hành {DoanVien.TenTruong}</h2>
        {/* <div className="margin-top"></div> */}
        <br />
        <div className="row formAdd">
          <div className="col-12 col-md-3 col-lg-2">
            <div className="avatar">
              <img
                className="avatar_img"
                src={
                  previewImage ||
                  `http://localhost:8080/images/${DoanVien.TenAnhBCH}`
                }
                alt=""
              />
              <label htmlFor="fileInput" className="camera-icon">
                <FontAwesomeIcon icon={faCamera} />
                <input
                  type="file"
                  name="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={(e) => handleUpLoadImage(e)}
                />
              </label>
            </div>
            <div className="namhoc-center">
            <NavLink to={`/BCH-DoanTruong/DanhSachBCHTruong/BCHTruong/AnhDiemDanh`} className="navlink">
              
            <button className="allcus-button">
              <FontAwesomeIcon icon={faSave} /> Ảnh điểm danh
            </button>
            </NavLink>
            </div>
          </div>
          <div className="col-12 col-md-9 col-lg-10 margin-top1">
            <div className="row">
              <div className="form-group col-12 col-md-6 col-lg-4">
                <Form.Label htmlFor="MaBCH">Mã số cán bộ</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="MaBCH"
                    aria-describedby="MaBCH"
                    value={editedDoanVien.MaBCH}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="MaBCH"
                    aria-describedby="MaBCH"
                    value={DoanVien.MaBCH}
                    disabled
                  />
                )}
                <div className="error-message">{errors.MaBCH}</div>
              </div>
              <div className="form-group col-12 col-md-6 col-lg-4">
                <Form.Label htmlFor="TenBCH">Họ tên ban chấp hành</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenBCH"
                    aria-describedby="TenBCH"
                    value={editedDoanVien.TenBCH}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenBCH"
                    aria-describedby="TenBCH"
                    value={DoanVien.TenBCH}
                    disabled
                  />
                )}
                <div className="error-message">{errors.TenBCH}</div>
              </div>
              <div className="form-group col-12 col-md-6 col-lg-4">
                <Form.Label htmlFor="GioiTinhBCH">Giới tính</Form.Label>

                {isEditing ? (
                  <Form.Select
                    className="form-control"
                    type="text"
                    id="GioiTinhBCH"
                    aria-describedby="GioiTinhBCH"
                    value={editedDoanVien.GioiTinhBCH}
                    onChange={handleChange}
                  >
                    <option value={0}>Nữ</option>
                    <option value={1}>Nam</option>
                    <option value={2}>Khác</option>
                  </Form.Select>
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="GioiTinhBCH"
                    aria-describedby="GioiTinhBCH"
                    value={
                      DoanVien.GioiTinhBCH === 0
                        ? "Nữ"
                        : DoanVien.GioiTinhBCH === 1
                        ? "Nam"
                        : "Khác"
                    }
                    disabled
                  />
                )}
                <div className="error-message">{errors.GioiTinhBCH}</div>
              </div>
              <div className="form-group col-12 col-md-12 col-lg-8">
                <Form.Label htmlFor="EmailBCH">Email</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="EmailBCH"
                    aria-describedby="EmailBCH"
                    value={editedDoanVien.EmailBCH}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="EmailBCH"
                    aria-describedby="EmailBCH"
                    value={DoanVien.EmailBCH}
                    disabled
                  />
                )}
                <div className="error-message">{errors.EmailBCH}</div>
              </div>
              <div className="form-group col-12 col-md-6 col-lg-4">
                <Form.Label htmlFor="SoDTBCH">Số điện thoại</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="SoDTBCH"
                    aria-describedby="SoDTBCH"
                    value={editedDoanVien.SoDTBCH}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="SoDTBCH"
                    aria-describedby="SoDTBCH"
                    value={DoanVien.SoDTBCH}
                    disabled
                  />
                )}
                <div className="error-message">{errors.SoDTBCH}</div>
              </div>
              <div className="form-group col-12 col-md-12 col-lg-8">
                <Form.Label htmlFor="QueQuanBCH">Quê quán</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="QueQuanBCH"
                    aria-describedby="QueQuanBCH"
                    value={editedDoanVien.QueQuanBCH}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="QueQuanBCH"
                    aria-describedby="QueQuanBCH"
                    value={DoanVien.QueQuanBCH}
                    disabled
                  />
                )}
                <div className="error-message">{errors.QueQuanBCH}</div>
              </div>
              <div className="form-group col-12 col-md-6 col-lg-4">
                <Form.Label htmlFor="NgaySinhBCH">Ngày sinh</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="NgaySinhBCH"
                    aria-describedby="NgaySinhBCH"
                    value={editedDoanVien.NgaySinhBCH}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="NgaySinhBCH"
                    aria-describedby="NgaySinhBCH"
                    value={DoanVien.NgaySinhBCH}
                    disabled
                  />
                )}
                <div className="error-message">{errors.NgaySinhBCH}</div>
              </div>
              <div className="form-group col-12 col-md-6 col-lg-4">
                <Form.Label htmlFor="NgayVaoDoanBCH">Ngày vào đoàn</Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="NgayVaoDoanBCH"
                    aria-describedby="NgayVaoDoanBCH"
                    value={editedDoanVien.NgayVaoDoanBCH}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="NgayVaoDoanBCH"
                    aria-describedby="NgayVaoDoanBCH"
                    value={DoanVien.NgayVaoDoanBCH}
                    disabled
                  />
                )}
                <div className="error-message">{errors.NgayVaoDoanBCH}</div>
              </div>
              <div className="form-group col-12 col-md-6 col-lg-4">
                <Form.Label htmlFor="IDDanToc">Dân tộc</Form.Label>
                {isEditing ? (
                  <Form.Select
                    className="form-control"
                    type="text"
                    id="IDDanToc"
                    aria-describedby="IDDanToc"
                    value={editedDoanVien.IDDanToc}
                    onChange={handleChange}
                  >
                    <option value="" disabled selected>
                      {DoanVien.TenDanToc}
                    </option>
                    {DanToc.map((dantoc, index) => {
                      return (
                        <option key={index} value={dantoc.IDDanToc}>
                          {dantoc.TenDanToc}
                        </option>
                      );
                    })}
                  </Form.Select>
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenDanToc"
                    aria-describedby="TenDanToc"
                    value={DoanVien.TenDanToc}
                    disabled
                  />
                )}
                <div className="error-message">{errors.IDDanToc}</div>
              </div>
              <div className="form-group col-12 col-md-6 col-lg-4">
                <Form.Label htmlFor="IDTonGiao">Tôn giáo</Form.Label>
                {isEditing ? (
                  <Form.Select
                    className="form-control"
                    type="text"
                    id="IDTonGiao"
                    aria-describedby="IDTonGiao"
                    value={editedDoanVien.IDTonGiao}
                    onChange={handleChange}
                  >
                    <option value="" disabled selected>
                      {DoanVien.TenTonGiao}
                    </option>
                    {TonGiao.map((tongiao, index) => {
                      return (
                        <option key={index} value={tongiao.IDTonGiao}>
                          {tongiao.TenTonGiao}
                        </option>
                      );
                    })}
                  </Form.Select>
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenTonGiao"
                    aria-describedby="TenTonGiao"
                    value={DoanVien.TenTonGiao}
                    disabled
                  />
                )}
                <div className="error-message">{errors.IDTonGiao}</div>
              </div>
              <div className="listDV">
                <div className="table-container">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="table-item">STT</th>
                        <th className="table-item">Tên năm học</th>
                        <th>Chức vụ</th>
                        <th>Xóa năm học</th>
                      </tr>
                    </thead>
                    <tbody id="myTable">
                      {CVDoanVien &&
                        CVDoanVien.length > 0 &&
                        CVDoanVien.map((item, index) => {
                          return (
                            <tr
                              key={`table-hoatdong-${index}`}
                              className="tableRow"
                            >
                              <td className="col-center">{index + 1}</td>
                              <td className="col-center">{item.TenNamHoc}</td>
                              <td>
                                {isEditing ? (
                                  <Form.Select
                                    className="form-control"
                                    value={listIDChucVu[index]}
                                    onChange={(e) =>
                                      handleChangeChucVu(e, index)
                                    }
                                    id={`CV_${index}`}
                                  >
                                    {ChucVu.map((chucvu) => (
                                      <option
                                        key={chucvu.IDChucVu}
                                        value={chucvu.IDChucVu}
                                      >
                                        {chucvu.TenCV}
                                      </option>
                                    ))}
                                  </Form.Select>
                                ) : (
                                  // Display the current Chức Vụ
                                  item.TenCV
                                )}
                              </td>
                              <td className="btnOnTable1">
                                <button
                                  className="btnOnTable mauxoa"
                                  onClick={() =>
                                    handleDisplayButtonClick(item.IDChiTietBCH)
                                  }
                                >
                                  <FontAwesomeIcon icon={faX} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="update row">
                  <div className="btns">
                    <button className="allcus-button" type="submit">
                      <NavLink
                        to={`/BCH-DoanTruong/DanhSachBCHTruong`}
                        className="navlink"
                      >
                        <FontAwesomeIcon icon={faBackward} />
                      </NavLink>
                    </button>

                    {isEditing ? (
                      <>
                        <button
                          className="allcus-button bgcapnhat"
                          onClick={handleSaveChanges}
                        >
                          <FontAwesomeIcon icon={faSave} /> Lưu
                        </button>
                      </>
                    ) : (
                      <button
                        className="allcus-button bgcapnhat"
                        onClick={handleToggleEdit}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Cập nhật
                      </button>
                    )}

                    <button
                      className="allcus-button button-error"
                      type="button"
                      onClick={() => setShowModal(true)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalSuccess
        show={showModalUpdate}
        onHide={() => setShowModalUpdate(false)}
      />

      <DeleteConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        handleDelete={handleDelete}
      />

      <NavLink to={`/DaiHocCanTho/DanhSachBCHTruong`} className="navlink">
        <DeleteSuccess show={showModal1} onHide={() => setShowModal1(false)} />
      </NavLink>

      <DeleteSuccess show={showModal2} onHide={() => setShowModal2(false)} />
    </>
  );
};

export default DoanVien;
