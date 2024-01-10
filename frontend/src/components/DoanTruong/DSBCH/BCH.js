import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import {
  faBackward,
  faTrash,
  faSave,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import {
  LayMotDoanVien,
  XoaBanChapHanh,
  chucvu,
  LayTonGiao,
  LayDanToc,
  CapNhatDoanVien,
  namhoc,
} from "../../../services/apiService";

const BanChapHanh = (props) => {
  const { MaLop, MSSV, IDChiTietNamHoc } = useParams();
  const [DoanVien, setDoanVien] = useState([]);

  const [select, setSelect] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const [NamHoc, setNamHoc] = useState([]);
  const [DanToc, setDanToc] = useState([]);
  const [TonGiao, setTonGiao] = useState([]);
  const [ChucVu, setChucVu] = useState([]);

  const [editedDoanVien, seteditedDoanVien] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    try {
      await XoaBanChapHanh(select);
      setShowModal(false);
      setShowModal1(true);

      console.log("Hoạt động đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  useEffect(() => {
    layMotDoanVien();
    fetchDSNamHoc();
    fetchChucVu();
    fetchTonGiao();
    fetchDanToc();
  }, [MaLop, MSSV]);

  const layMotDoanVien = async () => {
    try {
      let res = await LayMotDoanVien(MaLop, MSSV, IDChiTietNamHoc);

      if (res.status === 200) {
        setDoanVien(res.data.dataDV);
        console.log(res.data.dataDV);
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
    IDNamHoc: "",
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

  const handleSaveChanges = async (e) => {
    e.preventDefault() 
      

    const newErrors = {
      // MaLop: !editedDoanVien.MaLop.trim() ? "Vui lòng nhập mã lớp" : "",
      // TenLop: !editedDoanVien.TenLop.trim() ? "Vui lòng nhập tên lớp" : "",
      // Khoa: !editedDoanVien.Khoa.trim() ? "Vui lòng nhập khóa" : "",
      Email: !editedDoanVien.Email.trim() ? "Vui lòng nhập Email" : "",
      HoTen: !editedDoanVien.HoTen.trim() ? "Vui lòng nhập họ tên" : "",
      MSSV: !editedDoanVien.MSSV.trim() ? "Vui lòng nhập MSSV" : "",
      SoDT: !editedDoanVien.SoDT.trim() ? "Vui lòng nhập số điện thoại" : "",
      QueQuan: !editedDoanVien.QueQuan.trim() ? "Vui lòng nhập quê quán" : "",
      GioiTinh:
        editedDoanVien.GioiTinh === undefined || editedDoanVien.GioiTinh === ""
          ? "Vui lòng nhập giới tính"
          : "",
      NgaySinh: !editedDoanVien.NgaySinh.trim()
        ? "Vui lòng nhập ngày sinh"
        : "",
      NgayVaoDoan: !editedDoanVien.NgayVaoDoan.trim()
        ? "Vui lòng nhập ngày vào đoàn"
        : "",
      IDDanToc: !editedDoanVien.IDDanToc ? "Vui lòng nhập tên dân tộc" : "",
      IDTonGiao: !editedDoanVien.IDTonGiao ? "Vui lòng nhập tên tôn giáo" : "",
      IDChucVu: !editedDoanVien.IDChucVu ? "Vui lòng chọn tên chức vụ" : "",
      IDNamHoc: !editedDoanVien.IDNamHoc ? "Vui lòng chọn năm học" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }



    try {
      // Gọi API hoặc hàm cập nhật dữ liệu ở đây
      await CapNhatDoanVien(editedDoanVien);

      // Sau khi cập nhật thành công, cập nhật lại trạng thái ChiDoan và kết thúc chế độ chỉnh sửa
      setDoanVien(editedDoanVien);
      setShowModalUpdate(true);
      setIsEditing(false);
      LayMotDoanVien();
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };

  return (
    <>
      <div className="container-fluid app__content">
        <h2 className="text-center">Ban Chấp Hành</h2>

        <div className="margin-top">
          <div className="row formAdd">
            <div className="col col-2">
              <div className="avatar">
                <img
                  className="avatar_img"
                  src={`http://localhost:8080/images/${DoanVien.TenAnh}`}
                  alt=""
                />
              </div>
            </div>
            <div className="col col-10">
              <div className="row">
              <div className="form-group col col-4">
                  <Form.Label htmlFor="MaLop">Mã chi đoàn</Form.Label>
                  {/* {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="MaLop"
                      aria-describedby="MaLop"
                      value={editedDoanVien.MaLop}
                      onChange={handleChange}
                    />
                  ) : ( */}
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="MaLop"
                    aria-describedby="MaLop"
                    value={DoanVien.MaLop}
                    disabled
                  />
                  {/* )} */}
                  {/* <div className="error-message">{errors.MaLop}</div> */}
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="TenLop">Tên chi đoàn</Form.Label>
                  {/* {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="TenLop"
                      aria-describedby="TenLop"
                      value={editedDoanVien.TenLop}
                      onChange={handleChange}
                    />
                  ) : ( */}
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="TenLop"
                    aria-describedby="TenLop"
                    value={DoanVien.TenLop}
                    disabled
                  />
                  {/* )} */}
                  {/* <div className="error-message">{errors.TenLop}</div> */}
                </div>
                <div className="form-group col col-4">
                  <Form.Label htmlFor="Khoa">Khóa</Form.Label>
                  {/* {isEditing ? (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="Khoa"
                      aria-describedby="Khoa"
                      value={editedDoanVien.Khoa}
                      onChange={handleChange}
                    />
                  ) : ( */}
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="Khoa"
                    aria-describedby="Khoa"
                    value={DoanVien.Khoa}
                    disabled
                  />
                  {/* )} */}
                  {/* <div className="error-message">{errors.Khoa}</div> */}
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
                  <Form.Label htmlFor="QueQuan">Quê Quán</Form.Label>
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
                  <Form.Label htmlFor="NgaySinh">Ngày sinh (dd/mm/yyyy)</Form.Label>
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
                  <Form.Label htmlFor="NgayVaoDoan">Ngày vào đoàn (dd/mm/yyyy)</Form.Label>
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
                  <Form.Label htmlFor="IDDanToc">Dân Tộc</Form.Label>
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
                        {/* {DoanVien.TenTonGiao} */} Chọn tôn giáo
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
                        {/* {DoanVien.TenCV} */} Chọn chức vụ
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
                  {isEditing ? (
                    <Form.Select
                      className="form-control"
                      type="text"
                      id="IDNamHoc"
                      aria-describedby="IDNamHoc"
                      value={editedDoanVien.IDNamHoc}
                      onChange={handleChange}
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
                  ) : (
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="TenNamHoc TenNamHoc1"
                      aria-describedby="TenNamHoc"
                      value={DoanVien.TenNamHoc}
                      disabled
                    />
                  )}
                  <div className="error-message">{errors.IDNamHoc}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="update row">
            <div className="btns">
              <button className="allcus-button" type="submit">
                <NavLink to={`/BCH-DoanTruong/DanhSachBCH`} className="navlink">
                  <FontAwesomeIcon icon={faBackward} />
                </NavLink>
              </button>

              {isEditing ? (
                <>
                  <button className="allcus-button" onClick={handleSaveChanges}>
                    <FontAwesomeIcon icon={faSave} /> Lưu
                  </button>
                </>
              ) : (
                <button className="allcus-button" onClick={handleToggleEdit}>
                  <FontAwesomeIcon icon={faEdit} /> Cập nhật
                </button>
              )}

              <button
                className="allcus-button button-error"
                type="button"
                onClick={() => {
                  setSelect(DoanVien.IDChiTietNamHoc);
                  setShowModal(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton className="border-none">
          <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
          Bạn chắc chắn xóa?
        </Modal.Body>
        <Modal.Footer className="border-none">
          <button
            className="allcus-button button-error"
            onClick={() => handleDelete()}
          >
            Xóa
          </button>
          <button className="allcus-button" onClick={() => setShowModal(false)}>
            Đóng
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal1}
        onHide={() => setShowModal1(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton className="border-none">
          <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
          Xóa thành công!
        </Modal.Body>
        <Modal.Footer className="border-none">
          <NavLink to={`/BCH-DoanTruong/DanhSachBCH`} className="navlink">
            <button
              className="allcus-button"
              onClick={() => setShowModal1(false)}
            >
              Đóng
            </button>
          </NavLink>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModalUpdate}
        onHide={() => setShowModalUpdate(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton className="border-none">
          <Modal.Title className="custom-modal-title">Thông báo!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body" bsPrefix="custom-modal-body">
          Cập nhật thành công!
        </Modal.Body>
        <Modal.Footer className="border-none">
          <button
            className="allcus-button"
            onClick={() => setShowModalUpdate(false)}
          >
            Đóng
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BanChapHanh;
