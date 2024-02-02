import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import DeleteSuccess from "../../Modal/DeleteSuccess";
import DeleteConfirmationModal from "../../Modal/DeleteConfirmationModal";
import ModalSuccess from "../../Modal/ModalSuccess";
import axios from "axios";

import {
  faBackward,
  faTrash,
  faSave,
  faEdit,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import {
  chucvu,
  LayTonGiao,
  LayDanToc,
  LayMotDoanVien,
  XoaDoanVien,
  DVLayMotDoanVien,
  CapNhatDoanVien,
  namhoc,
  laymotlop,
} from "../../../services/apiService";

const DoanVien = (props) => {
  const {IDLop, IDDoanVien, IDNamHoc, IDChiTietNamHoc } = useParams();
  const [DoanVien, setDoanVien] = useState([]);
  const [DSDoanVien, setListDoanVien] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIDNamHoc, setIDNamHoc] = useState(IDNamHoc);
  const [NamHoc, setNamHoc] = useState([]);
  const [DanToc, setDanToc] = useState([]);
  const [TonGiao, setTonGiao] = useState([]);
  const [ChucVu, setChucVu] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const [editedDoanVien, seteditedDoanVien] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [logo, setLogo] = useState("http://localhost:8080/images/logo.jpg");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const [MSSV, setMSSV] = useState("");
  const [HoTen, setHoTen] = useState("");
  const [Email, setEmail] = useState("");
  const [SoDT, setSoDT] = useState("");
  const [GioiTinh, setGioiTinh] = useState("");
  const [NgaySinh, setNgaySinh] = useState("");
  const [QueQuan, setQueQuan] = useState("");
  const [NgayVaoDoan, setNgayVaoDoan] = useState("");
  const [IDDanToc, setIDDanToc] = useState("");
  const [IDTonGiao, setIDTonGiao] = useState("");
  const [IDChucVu, setIDChucVu] = useState("");

  const handleDelete = async () => {
    try {
      await XoaDoanVien(IDChiTietNamHoc);
      setShowModal(false);
      fetchDSDoanVien();
      setShowModal1(true);
      console.log("Hoạt động đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  useEffect(() => {
    fetchDSDoanVien();
    layMotDoanVien();
    fetchDSNamHoc();
    fetchChucVu();
    fetchTonGiao();
    fetchDanToc();
  }, [IDLop, IDDoanVien, selectedIDNamHoc]);

  const fetchDSDoanVien = async () => {
    try {
      let res = await laymotlop(IDLop, currentPage);
      console.log(res);

      if (res.status === 200) {
        setListDoanVien(res.data.dataCD);
        setTotalPages(res.data.totalPages);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const layMotDoanVien = async () => {
    try {
      let res = await DVLayMotDoanVien(IDDoanVien, selectedIDNamHoc);
      if (res.status === 200) {
        setDoanVien(res.data.dataDV);
        seteditedDoanVien(res.data.dataDV);
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
    MaLop: "",
    TenLop: "",
    HoTen: "",
    MSSV: "",
    Khoa: "",
    Email: "",
    SoDT: "",
    QueQuan: "",
    GioiTinh: "",
    NgaySinh: "",
    NgayVaoDoan: "",
    IDDanToc: "",
    IDTonGiao: "",
    IDChucVu: "",
  });

  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    seteditedDoanVien((prevData) => ({
      ...prevData,
      [id]: value,
    }));
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

  const validateEmail = (Email) => {
    return String(Email)
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

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const newErrors = {
      Email:
        !editedDoanVien.Email.trim() === ""
          ? "Vui lòng nhập Email"
          : !validateEmail(editedDoanVien.Email)
          ? "Email không hợp lệ!"
          : "",
      HoTen: !editedDoanVien.HoTen.trim() === "" ? "Vui lòng nhập họ tên" : "",
      MSSV: !editedDoanVien.MSSV.trim() === "" ? "Vui lòng nhập MSSV" : "",
      SoDT: !editedDoanVien.SoDT.trim() === ""
        ? "Vui lòng nhập số điện thoại"
        : !validatePhoneNumber(editedDoanVien.SoDT)
        ? "Số điện thoại không hợp lệ!"
        : "",
      QueQuan:
        !editedDoanVien.QueQuan.trim() === "" ? "Vui lòng nhập quê quán" : "",
      GioiTinh:
        editedDoanVien.GioiTinh === undefined || editedDoanVien.GioiTinh === ""
          ? "Vui lòng nhập giới tính"
          : "",
      NgaySinh:
        !editedDoanVien.NgaySinh.trim() === ""
          ? "Vui lòng nhập ngày sinh"
          : !validateNgay(editedDoanVien.NgaySinh)
          ? "Ngày định dạng là dd/mm/yyyy"
          : "",

      NgayVaoDoan:
        !editedDoanVien.NgayVaoDoan.trim() === ""
          ? "Vui lòng nhập ngày vào đoàn"
          : !validateNgay(editedDoanVien.NgayVaoDoan)
          ? "Ngày định dạng là dd/mm/yyyy"
          : "",

      IDDanToc: !editedDoanVien.IDDanToc ? "Vui lòng nhập tên dân tộc" : "",
      IDTonGiao: !editedDoanVien.IDTonGiao ? "Vui lòng nhập tên tôn giáo" : "",
      IDChucVu: !editedDoanVien.IDChucVu ? "Vui lòng chọn tên chức vụ" : "",
      // IDNamHoc: !editedDoanVien.selectedIDNamHoc ? "Vui lòng chọn năm học" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("MSSV", editedDoanVien.MSSV);
      formData.append("HoTen", editedDoanVien.HoTen);
      formData.append("Email", editedDoanVien.Email);
      formData.append("SoDT", editedDoanVien.SoDT);
      formData.append("GioiTinh", editedDoanVien.GioiTinh);
      formData.append("NgaySinh", editedDoanVien.NgaySinh);
      formData.append("NgayVaoDoan", editedDoanVien.NgayVaoDoan);
      formData.append("IDDanToc", editedDoanVien.IDDanToc);
      formData.append("IDTonGiao", editedDoanVien.IDTonGiao);
      formData.append("IDChucVu", editedDoanVien.IDChucVu);
      formData.append("IDNamHoc", selectedIDNamHoc);
      formData.append("QueQuan", editedDoanVien.QueQuan);
      formData.append("IDDoanVien", IDDoanVien);

      if (image instanceof Blob) {
        formData.append("file", image, image.name);
      }

      console.log(formData);
      let res = await axios.post(
        "http://localhost:8080/api/CapNhatDoanVien",
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

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setIDNamHoc(selectedIDNamHoc);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center mg-bt">
          <h2 className="text-center">Đoàn Viên</h2>
          <div className="searchDV-input">
            {" "}
            Năm học
            <select
              type="text"
              className="search_name"
              value={selectedIDNamHoc}
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
        <div className="margin-top">
          <div className="row formAdd">
            <div className="col col-2">
              <div className="avatar">
                <img
                  className="avatar_img"
                  src={
                    previewImage ||
                    `http://localhost:8080/images/${DoanVien.TenAnh}`
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
            </div>
            <div className="col col-10">
              <div className="row">
                <div className="form-group col col-4">
                  <Form.Label htmlFor="MaLop">Mã chi đoàn</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="MaLop"
                    aria-describedby="MaLop"
                    value={DoanVien.MaLop}
                    disabled
                  />
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="TenLop">Tên chi đoàn</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenLop"
                    aria-describedby="TenLop"
                    value={DoanVien.TenLop}
                    disabled
                  />
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="Khoa">Khóa</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="Khoa"
                    aria-describedby="Khoa"
                    value={DoanVien.Khoa}
                    disabled
                  />
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="MSSV">Mã số sinh viên</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="MSSV"
                      aria-describedby="MSSV"
                      value={editedDoanVien.MSSV}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="MSSV"
                      aria-describedby="MSSV"
                      value={DoanVien.MSSV}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.MSSV}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="HoTen">Họ tên đoàn viên</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="HoTen"
                      aria-describedby="HoTen"
                      value={editedDoanVien.HoTen}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="HoTen"
                      aria-describedby="HoTen"
                      value={DoanVien.HoTen}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.HoTen}</div>
                </div>

                <div className="form-group col col-4">
                  <Form.Label htmlFor="Email">Email</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="Email"
                      aria-describedby="Email"
                      value={editedDoanVien.Email}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="Email"
                      aria-describedby="Email"
                      value={DoanVien.Email}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.Email}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="SoDT">Số điện thoại</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="SoDT"
                      aria-describedby="SoDT"
                      value={editedDoanVien.SoDT}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="SoDT"
                      aria-describedby="SoDT"
                      value={DoanVien.SoDT}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.SoDT}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="QueQuan">Quê quán</Form.Label>
                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="QueQuan"
                      aria-describedby="QueQuan"
                      value={editedDoanVien.QueQuan}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="QueQuan"
                      aria-describedby="QueQuan"
                      value={DoanVien.QueQuan}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.QueQuan}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="GioiTinh">Giới tính</Form.Label>

                  {isEditing ? (
                    <Form.Select
                      className="form-control"
                      type="text"
                      id="GioiTinh"
                      aria-describedby="GioiTinh"
                      value={editedDoanVien.GioiTinh}
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
                      id="GioiTinh"
                      aria-describedby="GioiTinh"
                      value={
                        DoanVien.GioiTinh === 0
                          ? "Nữ"
                          : DoanVien.GioiTinh === 1
                          ? "Nam"
                          : "Khác"
                      }
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.GioiTinh}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="NgaySinh">
                    Ngày sinh
                  </Form.Label>
                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="NgaySinh"
                      aria-describedby="NgaySinh"
                      value={editedDoanVien.NgaySinh}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="NgaySinh"
                      aria-describedby="NgaySinh"
                      value={DoanVien.NgaySinh}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.NgaySinh}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="NgayVaoDoan">
                    Ngày vào đoàn
                  </Form.Label>
                  {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="NgayVaoDoan"
                      aria-describedby="NgayVaoDoan"
                      value={editedDoanVien.NgayVaoDoan}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="NgayVaoDoan"
                      aria-describedby="NgayVaoDoan"
                      value={DoanVien.NgayVaoDoan}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.NgayVaoDoan}</div>
                </div>
                <div className="form-group col col-4">
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
                        {/* {DoanVien.TenDanToc} */} Chọn dân tộc
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
                <div className="form-group col col-4">
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
                        Chọn tôn giáo
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
                <div className="form-group col col-4">
                  <Form.Label htmlFor="IDChucVu">Chức vụ</Form.Label>
                  {isEditing ? (
                    <Form.Select
                      className="form-control"
                      type="text"
                      id="IDChucVu"
                      aria-describedby="IDChucVu"
                      value={editedDoanVien.IDChucVu}
                      onChange={handleChange}
                    >
                      <option value="" disabled selected>
                        Chọn chức vụ
                      </option>
                      {ChucVu.map((chucvu, index) => {
                        return (
                          <option key={index} value={chucvu.IDChucVu}>
                            {chucvu.TenCV}
                          </option>
                        );
                      })}
                    </Form.Select>
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="IDChucVu"
                      aria-describedby="IDChucVu"
                      value={DoanVien.TenCV}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.IDChucVu}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="TenNamHoc">Năm học</Form.Label>
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="TenNamHoc TenNamHoc1"
                      aria-describedby="TenNamHoc"
                      value={DoanVien.TenNamHoc}
                      disabled
                    />
                  <div className="error-message">{errors.IDNamHoc}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="update row">
            <div className="btns">
              <button className="allcus-button" type="submit">
                <NavLink
                  to={`/BCH-DoanTruong/ChiTietChiDoan/${DoanVien.IDLop}`}
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
      <DeleteConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        handleDelete={handleDelete}
      />

      <NavLink
        to={`/BCH-DoanTruong/ChiTietChiDoan/${DoanVien.IDLop}`}
        className="navlink"
      >
        <DeleteSuccess show={showModal1} onHide={() => setShowModal1(false)} />
      </NavLink>

      {/* <NavLink
        to={`/BCH-DoanTruong/ChiTietChiDoan/${DoanVien.IDLop}`}
        className="navlink"
      > */}
        <ModalSuccess
          show={showModalUpdate}
          onHide={() => setShowModalUpdate(false)}
        />
      {/* </NavLink> */}
    </>
  );
};

export default DoanVien;
