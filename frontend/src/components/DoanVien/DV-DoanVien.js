import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { NavLink, useNavigate  } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ModalSuccess from "../Modal/ModalSuccess";
import axios from "axios";

import {
  faBackward,
  faSave,
  faEdit,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import {
  chucvu,
  LayTonGiao,
  LayDanToc,
  layDSDanhGiaDoanVien,
  layDSChucVuDoanVien,
  laytendoanvien,
} from "../../services/apiService";

const DoanVien = (props) => {
  const IDDoanVien = localStorage.getItem("IDDoanVien");
  const navigate = useNavigate();

  const [DoanVien, setDoanVien] = useState([]);
  const [CVDoanVien, setCVDoanVien] = useState([]);
  const [DGDoanVien, setDGDoanVien] = useState([]);
  const [listIDDanhGia, setListIDDanhGia] = useState([]);

  const [DanToc, setDanToc] = useState([]);
  const [TonGiao, setTonGiao] = useState([]);
  const [ChucVu, setChucVu] = useState([]);
  const [listIDChucVu, setListIDChucVu] = useState([]);

  const [editedDoanVien, seteditedDoanVien] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [logo, setLogo] = useState("http://localhost:8080/images/logo.jpg");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

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
    DSDanhGiaDoanVien();
  }, [IDDoanVien]);

  const layMotDoanVien = async () => {
    try {
      let res = await laytendoanvien(IDDoanVien);
      if (res.status === 200) {
        const { dataDV, dataCV } = res.data;
        // Assuming dataDV contains basic information and dataCV contains roles (ChucVu)
        const mergedData = {
          ...dataDV,
          CVDoanVien: dataCV, // assuming dataCV is an array of ChucVu
        };
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
      let res = await layDSChucVuDoanVien(IDDoanVien);
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

  const DSDanhGiaDoanVien = async () => {
    try {
      let res = await layDSDanhGiaDoanVien(IDDoanVien);
      if (res.status === 200) {
        const { dataDV } = res.data;
        // Assuming dataDV contains roles (ChucVu)
        setDGDoanVien(dataDV);
        setListIDDanhGia(dataDV.map((item) => item.IDDanhGia));
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
      Email:
        !editedDoanVien.Email
          ? "Vui lòng nhập Email"
          : !validateEmail(editedDoanVien.Email)
          ? "Email không hợp lệ!"
          : "",
      HoTen:
        !editedDoanVien.HoTen
          ? "Vui lòng nhập họ tên"
          : "",
      MSSV:
        !editedDoanVien.MSSV
          ? "Vui lòng nhập MSSV"
          : "",
      SoDT:
        !editedDoanVien.SoDT
          ? "Vui lòng nhập số điện thoại"
          : !validatePhoneNumber(editedDoanVien.SoDT)
          ? "Số điện thoại không hợp lệ!"
          : "",
      QueQuan:
        !editedDoanVien.QueQuan
          ? "Vui lòng nhập quê quán"
          : "",
      GioiTinh:
        editedDoanVien.GioiTinh === undefined || editedDoanVien.GioiTinh === ""
          ? "Vui lòng nhập giới tính"
          : "",
      NgaySinh:
        !editedDoanVien.NgaySinh
          ? "Vui lòng nhập ngày sinh"
          : !validateNgay(editedDoanVien.NgaySinh)
          ? "Ngày định dạng là dd/mm/yyyy"
          : "",

      NgayVaoDoan:
        !editedDoanVien.NgayVaoDoan
          ? "Vui lòng nhập ngày vào đoàn"
          : !validateNgay(editedDoanVien.NgayVaoDoan)
          ? "Ngày định dạng là dd/mm/yyyy"
          : "",

      IDDanToc:
        !editedDoanVien.IDDanToc 
          ? "Vui lòng nhập tên dân tộc"
          : "",
      IDTonGiao:
        !editedDoanVien.IDTonGiao 
          ? "Vui lòng nhập tên tôn giáo"
          : "",
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
      formData.append("QueQuan", editedDoanVien.QueQuan);
      formData.append("IDDoanVien", IDDoanVien);
      formData.append("listIDChucVu", JSON.stringify(listIDChucVu));

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

  return (
    <>
      <div className="container-fluid app__content">
        <h2 className="text-center">Đoàn Viên</h2>

        <div className="row formAdd">
          <div className="col-6 col-md-3 col-lg-2">
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
          <div className="col-12 col-md-9 col-lg-10 margin-top1">
            <div className="row">
              <div className="form-group col-12 col-md-6 col-lg-4 ">
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
              <div className="form-group col-12 col-md-6 col-lg-4">
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
              <div className="form-group col-12 col-md-6 col-lg-4">
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
              <div className="form-group col-12 col-md-6 col-lg-4">
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
              <div className="form-group col-12 col-md-6 col-lg-4">
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
              <div className="form-group col-12 col-md-6 col-lg-4">
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
              <div className="form-group col-12 col-md-12 col-lg-8">
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
              <div className="form-group col-12 col-md-6 col-lg-4">
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
              <div className="form-group col-12 col-md-12 col-lg-8">
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
              <div className="form-group col-12 col-md-6 col-lg-4">
                <Form.Label htmlFor="NgaySinh">Ngày sinh</Form.Label>
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
              <div className="form-group col-12 col-md-6 col-lg-4">
                <Form.Label htmlFor="NgayVaoDoan">Ngày vào đoàn</Form.Label>
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
                        <th>Phân loại</th>
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
                                  onChange={(e) => handleChangeChucVu(e, index)}
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
                                  item.TenCV
                                )}
                              </td>
                              <td>
                                {DGDoanVien[index]
                                  ? DGDoanVien[index].PhanLoai === 1
                                    ? "Xuất sắc"
                                    : DGDoanVien[index].PhanLoai === 2
                                    ? "Khá"
                                    : DGDoanVien[index].PhanLoai === 3
                                    ? "Trung bình"
                                    : DGDoanVien[index].PhanLoai === 4
                                    ? "Yếu kém"
                                    : "Chưa phân loại"
                                  : "Chưa có đánh giá"}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="update row">
              <div className="btns">
                <button className="allcus-button" type="submit">
                  <NavLink to={`/DoanVien`} className="navlink">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalSuccess
        show={showModalUpdate}
        onHide={() => setShowModalUpdate(false)}
      />
    </>
  );
};

export default DoanVien;
