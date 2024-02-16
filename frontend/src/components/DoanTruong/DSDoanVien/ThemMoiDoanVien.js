import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import loadVietnamBoundary from "./DiaGioiVN";

import Modal1 from "../../Modal/Modal";
import ModalAddSuccess from "../../Modal/ModalAddSuccess";
import axios from "axios";
import {
  faBackward,
  faSave,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import {
  chucvu,
  LayTonGiao,
  LayDanToc,
  namhoc,
  laymotchidoan,
} from "../../../services/apiService";
import logo from "../../../assets/logo.jpg";

const DoanVien = (props) => {
  const IDLop = localStorage.getItem("IDLop");

  const [ChiDoan, setChiDoan] = useState([]);
  const [NamHoc, setNamHoc] = useState([]);
  const [DanToc, setDanToc] = useState([]);
  const [TonGiao, setTonGiao] = useState([]);
  const [ChucVu, setChucVu] = useState([]);

  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState(false);

  const [vietnamBoundaryData, setVietnamBoundaryData] = useState(null);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const [MSSV, setMSSV] = useState("");
  const [HoTen, setHoTen] = useState("");
  const [Email, setEmail] = useState("");
  const [SoDT, setSoDT] = useState("");
  const [GioiTinh, setGioiTinh] = useState("");
  const [NgaySinh, setNgaySinh] = useState("");
  const [Ward, setWard] = useState("");
  const [District, setDistrict] = useState("");
  const [Province, setProvince] = useState("");
  const [NgayVaoDoan, setNgayVaoDoan] = useState("");
  const [IDDanToc, setIDDanToc] = useState("");
  const [IDTonGiao, setIDTonGiao] = useState("");
  const [IDChucVu, setIDChucVu] = useState("");
  const [IDNamHoc, setIDNamHoc] = useState("");

  useEffect(() => {
    fetchDSNamHoc();
    fetchChucVu();
    fetchTonGiao();
    fetchDanToc();
    fetchMotLop();
    fetchData();
  }, [IDLop]);

  const fetchData = async () => {
    const vietnamBoundaryData = await loadVietnamBoundary();
    if (vietnamBoundaryData) {
      // Use the data to populate dropdowns or handle as needed
      console.log("Vietnam Boundary Data:", vietnamBoundaryData);
      setVietnamBoundaryData(vietnamBoundaryData);
    }
  };

  const renderVietnamBoundary = (vietnamBoundaryData) => {
    // Implement logic to render dropdowns based on the data
    // Example: vietnamBoundaryData.citis.map(...), etc.
    // Adjust this based on the actual structure of your data

    if (!vietnamBoundaryData) {
      return null;
    }

    return vietnamBoundaryData.map((city) => (
      <option key={city.Name} value={city.Name}>
        {city.Name}
      </option>
    ));
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict(""); // Reset district when province changes
    setSelectedWard(""); // Reset ward when province changes
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedWard(""); // Reset ward when district changes
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const renderDropdownOptions = (options) => {
    if (!options) {
      return null;
    }

    return options.map((option) => (
      <option key={option.Name} value={option.Name}>
        {option.Name}
      </option>
    ));
  };

  const fetchMotLop = async () => {
    try {
      let res = await laymotchidoan(IDLop);
      console.log(res);
      if (res.status === 200) {
        const ChiDoanData = res.data.dataCD;

        // Check if ChiDoanData is an object and contains the expected properties
        if (
          ChiDoanData &&
          "MaLop" in ChiDoanData &&
          "TenLop" in ChiDoanData &&
          "Khoa" in ChiDoanData
        ) {
          setChiDoan(ChiDoanData);
        } else {
          console.error(
            "Dữ liệu chi đoàn không chứa các thuộc tính cần thiết."
          );
        }
      } else {
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
    IDNamHoc: "",
  });

  const [showModal, setShowModal] = useState(false);

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

  const handleUpLoadImage = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
      setImage(event.target.files[0]);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const newErrors = {
      Email:
        !Email.trim() === ""
          ? "Vui lòng nhập Email"
          : !validateEmail(Email)
          ? "Email không hợp lệ!"
          : "",
      HoTen: !HoTen || HoTen.trim() === "" ? "Vui lòng nhập họ tên" : "",
      MSSV: !MSSV || MSSV.trim() === "" ? "Vui lòng nhập MSSV" : "",
      SoDT:
        !SoDT.trim() === ""
          ? "Vui lòng nhập số điện thoại"
          : !validatePhoneNumber(SoDT)
          ? "Số điện thoại không hợp lệ!"
          : "",
      GioiTinh:
        GioiTinh === undefined || GioiTinh === ""
          ? "Vui lòng nhập giới tính"
          : "",
      NgaySinh: !NgaySinh.trim() === "" ? "Vui lòng nhập ngày sinh" : "",

      NgayVaoDoan:
        !NgayVaoDoan.trim() === "" ? "Vui lòng nhập ngày vào đoàn" : "",
      IDDanToc: !IDDanToc ? "Vui lòng nhập tên dân tộc" : "",
      IDTonGiao: !IDTonGiao ? "Vui lòng nhập tên tôn giáo" : "",
      IDChucVu: !IDChucVu ? "Vui lòng chọn tên chức vụ" : "",
      IDNamHoc: !IDNamHoc ? "Vui lòng chọn năm học" : "",
      Province: !Province ? "Vui lòng chọn tỉnh thành" : "",
      District: !District ? "Vui lòng chọn quận huyện" : "",
      Ward: !Ward ? "Vui lòng chọn phường xã" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("MSSV", MSSV);
      formData.append("HoTen", HoTen);
      formData.append("Email", Email);
      formData.append("SoDT", SoDT);
      formData.append("GioiTinh", GioiTinh);
      formData.append("NgaySinh", NgaySinh);
      formData.append("NgayVaoDoan", NgayVaoDoan);
      formData.append("IDDanToc", IDDanToc);
      formData.append("IDTonGiao", IDTonGiao);
      formData.append("IDChucVu", IDChucVu);
      formData.append("IDNamHoc", IDNamHoc);
      formData.append("Ward", Ward);
      formData.append("District", District);
      formData.append("Province", Province);
      formData.append("IDLop", IDLop);

      // formData.append("file", image, image.name);

      if (image instanceof Blob) {
        formData.append("file", image, image.name);
      }

      console.log(formData);
      let res = await axios.post(
        "http://localhost:8080/api/ThemMoiDoanVien",
        formData
      );
      setShowModal(true);
      // setIsEditing(false);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alert(error.response.data.message);
        // Hiển thị thông báo lỗi cho người dùng hoặc thực hiện các xử lý khác tùy thuộc vào yêu cầu của bạn
      } else {
        console.error("Lỗi khi cập nhật dữ liệu:", error);
      }
      // console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };

  return (
    <>
      <div className="container-fluid app__content">
        <h2 className="text-center"> Thêm Mới Đoàn Viên</h2>
        <div className="margin-top">
          <div className="row formAdd">
            <div className="col col-2">
              <div className="avatar">
                <img className="avatar_img" src={previewImage || logo} alt="" />
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
                    value={ChiDoan.MaLop}
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
                    value={ChiDoan.TenLop}
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
                    value={ChiDoan.Khoa}
                    disabled
                  />
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="MSSV">Mã số sinh viên</Form.Label>

                  <Form.Control
                    className="form-control"
                    type="text"
                    id="MSSV"
                    aria-describedby="MSSV"
                    value={MSSV}
                    onChange={(e) => setMSSV(e.target.value)}
                  />
                  <div className="error-message">{errors.MSSV}</div>

                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="HoTen">Họ tên đoàn viên</Form.Label>

                  <Form.Control
                    className="form-control"
                    type="text"
                    id="HoTen"
                    aria-describedby="HoTen"
                    value={HoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                  />
                  <div className="error-message">{errors.HoTen}</div>
                </div>

                <div className="form-group col col-4">
                  <Form.Label htmlFor="Email">Email</Form.Label>

                  <Form.Control
                    className="form-control"
                    type="email"
                    id="Email"
                    aria-describedby="Email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="error-message">{errors.Email}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="SoDT">Số điện thoại</Form.Label>

                  <Form.Control
                    className="form-control"
                    type="text"
                    id="SoDT"
                    aria-describedby="SoDT"
                    value={SoDT}
                    onChange={(e) => setSoDT(e.target.value)}
                  />
                  <div className="error-message">{errors.SoDT}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="GioiTinh">Giới tính</Form.Label>

                  <Form.Select
                    className="form-control"
                    type="text"
                    id="GioiTinh"
                    aria-describedby="GioiTinh"
                    value={GioiTinh}
                    onChange={(e) => setGioiTinh(e.target.value)}
                  >
                    <option value="" disabled>
                      Chọn giới tính
                    </option>
                    <option value={0}>Nữ</option>
                    <option value={1}>Nam</option>
                    <option value={2}>Khác</option>
                  </Form.Select>
                  <div className="error-message">{errors.GioiTinh}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="NgaySinh">Ngày sinh</Form.Label>

                  <Form.Control
                    className="form-control"
                    type="date"
                    id="NgaySinh"
                    aria-describedby="NgaySinh"
                    value={NgaySinh}
                    onChange={(e) => setNgaySinh(e.target.value)}
                  />
                  <div className="error-message">{errors.NgaySinh}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="province">Tỉnh/Thành phố</Form.Label>
                  <Form.Select
                    className="form-select form-select-sm mb-3"
                    id="Province"
                    aria-label=".form-select-sm"
                    onChange={(e) => {
                      handleProvinceChange(e);
                      setProvince(e.target.value);
                    }}
                    // onChange={handleProvinceChange}
                    value={selectedProvince}
                  >
                    <option value="" disabled selected>
                      Chọn tỉnh thành
                    </option>
                    {renderDropdownOptions(vietnamBoundaryData)}
                  </Form.Select>
                  <div className="error-message">{errors.selectedProvince}</div>
                </div>

                <div className="form-group col col-4">
                  <Form.Label htmlFor="district">Quận/Huyện</Form.Label>
                  <Form.Select
                    className="form-select form-select-sm mb-3"
                    id="district"
                    aria-label=".form-select-sm"
                    onChange={(e) => {
                      handleDistrictChange(e);
                      setDistrict(e.target.value);
                    }}
                    value={selectedDistrict}
                    disabled={!selectedProvince} // Disable if no province is selected
                  >
                    <option value="" disabled>
                      Chọn quận huyện
                    </option>
                    {/* Render district options based on the selected province */}
                    {selectedProvince &&
                      renderDropdownOptions(
                        vietnamBoundaryData.find(
                          (city) => city.Name === selectedProvince
                        ).Districts
                      )}
                  </Form.Select>
                  <div className="error-message">{errors.selectedDistrict}</div>
                </div>

                <div className="form-group col col-4">
                  <Form.Label htmlFor="ward">Phường/Xã</Form.Label>
                  <Form.Select
                    className="form-select form-select-sm"
                    id="ward"
                    aria-label=".form-select-sm"
                    onChange={(e) => {
                      handleWardChange(e);
                      setWard(e.target.value);
                    }}
                    value={selectedWard}
                    disabled={!selectedDistrict} // Disable if no district is selected
                  >
                    <option value="" disabled>
                      Chọn phường xã
                    </option>
                    {/* Render ward options based on the selected province and district */}
                    {selectedProvince &&
                      selectedDistrict &&
                      renderDropdownOptions(
                        vietnamBoundaryData
                          .find((city) => city.Name === selectedProvince)
                          .Districts.find(
                            (district) => district.Name === selectedDistrict
                          ).Wards
                      )}
                  </Form.Select>
                  <div className="error-message">{errors.selectedWard}</div>
                </div>

                <div className="form-group col col-4">
                  <Form.Label htmlFor="NgayVaoDoan">Ngày vào đoàn</Form.Label>

                  <Form.Control
                    className="form-control"
                    type="date"
                    id="NgayVaoDoan"
                    aria-describedby="NgayVaoDoan"
                    value={NgayVaoDoan}
                    onChange={(e) => setNgayVaoDoan(e.target.value)}
                  />
                  <div className="error-message">{errors.NgayVaoDoan}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="IDDanToc">Dân tộc</Form.Label>
                  <Form.Select
                    className="form-control"
                    type="text"
                    id="IDDanToc"
                    aria-describedby="IDDanToc"
                    value={IDDanToc}
                    onChange={(e) => setIDDanToc(e.target.value)}
                  >
                    <option value="" disabled selected>
                      Chọn dân tộc
                    </option>
                    {DanToc.map((dantoc, index) => {
                      return (
                        <option key={index} value={dantoc.IDDanToc}>
                          {dantoc.TenDanToc}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <div className="error-message">{errors.IDDanToc}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="IDTonGiao">Tôn giáo</Form.Label>

                  <Form.Select
                    className="form-control"
                    type="text"
                    id="IDTonGiao"
                    aria-describedby="IDTonGiao"
                    value={IDTonGiao}
                    onChange={(e) => setIDTonGiao(e.target.value)}
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
                  <div className="error-message">{errors.IDTonGiao}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="IDChucVu">Chức vụ</Form.Label>

                  <Form.Select
                    className="form-control"
                    type="text"
                    id="IDChucVu"
                    aria-describedby="IDChucVu"
                    value={IDChucVu}
                    onChange={(e) => setIDChucVu(e.target.value)}
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
                  <div className="error-message">{errors.IDChucVu}</div>
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="TenNamHoc">Năm học</Form.Label>
                  <Form.Select
                    className="form-control"
                    type="text"
                    id="IDNamHoc"
                    aria-describedby="IDNamHoc"
                    value={IDNamHoc}
                    onChange={(e) => setIDNamHoc(e.target.value)}
                  >
                    <option value="" disabled selected>
                      Chọn năm học
                    </option>
                    {NamHoc.map((namhoc, index) => {
                      return (
                        <option key={index} value={namhoc.IDNamHoc}>
                          {namhoc.TenNamHoc}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <div className="error-message">{errors.IDNamHoc}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="update row">
            <div className="btns">
              <button className="allcus-button" type="submit">
                <NavLink
                  to={`/BCH-DoanTruong/ChiTietChiDoan`}
                  className="navlink"
                >
                  <FontAwesomeIcon icon={faBackward} />
                </NavLink>
              </button>

              <>
                <button className="allcus-button" onClick={handleSaveChanges}>
                  <FontAwesomeIcon icon={faSave} /> Lưu
                </button>
              </>
            </div>
          </div>
        </div>
      </div>

      <ModalAddSuccess show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
};

export default DoanVien;
