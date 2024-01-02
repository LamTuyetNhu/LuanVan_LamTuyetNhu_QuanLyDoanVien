import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import { faBackward, faTrash } from "@fortawesome/free-solid-svg-icons";
import { LayMotDoanVien, XoaDoanVien } from "../../services/apiService";
import logo from "../../assets/logo.jpg";

const DoanVien = (props) => {
  const { IDLop, IDDoanVien } = useParams();
  const [DoanVien, setDoanVien] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const handleDelete = async () => {
    try {
      await XoaDoanVien(IDDoanVien);
      setShowModal(false);
      setShowModal1(true);

      console.log("Hoạt động đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  useEffect(() => {
    layMotDoanVien();
  }, [IDLop, IDDoanVien]);

  const layMotDoanVien = async () => {
    try {
      let res = await LayMotDoanVien(IDLop, IDDoanVien);

      if (res.status === 200) {
        setDoanVien(res.data.dataDV);
        console.log(res.data.dataDV);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="row formAdd">
          <div className="col col-2">
            <div className="avatar">
              <img className="avatar_img" src={logo} alt="" />
            </div>
          </div>
          <div className="col col-10">
            <div className="row">
              <div className="form-group col col-4">
                <label for="TenChiDoan">Tên chi đoàn</label>
                <input
                  className="form-control"
                  type="text"
                  id="TenLop"
                  value={DoanVien.TenLop}
                />
              </div>
              <div className="form-group col col-4">
                <label for="HoTen">Họ và tên</label>
                <input
                  className="form-control"
                  type="text"
                  id="HoTen"
                  value={DoanVien.HoTen}
                />
              </div>
              <div className="form-group col col-4">
                <label for="MSSV">Mã số đoàn viên</label>
                <input
                  className="form-control"
                  type="text"
                  id="MSSV"
                  value={DoanVien.MSSV}
                />
              </div>

              <div className="form-group col col-4">
                <label for="Khoa">Khóa</label>
                <input
                  className="form-control"
                  type="text"
                  id="Khoa"
                  value={DoanVien.Khoa}
                />
              </div>
              <div className="form-group col col-4">
                <label for="Email">Email</label>
                <input
                  className="form-control"
                  type="text"
                  id="Email"
                  value={DoanVien.Email}
                />
              </div>
              <div className="form-group col col-4">
                <label for="SoDT">Số điện thoại</label>
                <input
                  className="form-control"
                  type="text"
                  id="SoDT"
                  value={DoanVien.SoDT}
                />
              </div>
              <div className="form-group col col-4">
                <label for="GioiTinh">Giới tính</label>
                <input
                  className="form-control"
                  type="text"
                  id="GioiTinh"
                  value={
                    DoanVien.GioiTinh === 0
                      ? "Nữ"
                      : DoanVien.GioiTinh === 1
                      ? "Nam"
                      : "Khác"
                  }
                />
              </div>
              <div className="form-group col col-4">
                <label for="NgaySinh">Ngày sinh</label>
                <input
                  className="form-control"
                  type="text"
                  id="NgaySinh"
                  value={
                    DoanVien && DoanVien.NgaySinh
                      ? format(new Date(DoanVien.NgaySinh), "dd/MM/yyyy")
                      : ""
                  }
                />
              </div>
              <div className="form-group col col-4">
                <label for="QueQuan">Quê Quán</label>
                <input
                  className="form-control"
                  type="text"
                  id="QueQuan"
                  value={DoanVien.QueQuan}
                />
              </div>
              <div className="form-group col col-4">
                <label for="TenDanToc">Dân tộc</label>
                <input
                  className="form-control"
                  type="text"
                  id="TenDanToc"
                  value={DoanVien.TenDanToc}
                />
              </div>
              <div className="form-group col col-4">
                <label for="TenTonGiao">Tôn giáo</label>
                <input
                  className="form-control"
                  type="text"
                  id="TenTonGiao"
                  value={DoanVien.TenTonGiao}
                />
              </div>
              <div className="form-group col col-4">
                <label for="NgayVaoDoan">Ngày vào đoàn</label>
                <input
                  className="form-control"
                  type="text"
                  id="NgayVaoDoan"
                  value={
                    DoanVien && DoanVien.NgayVaoDoan
                      ? format(new Date(DoanVien.NgayVaoDoan), "dd/MM/yyyy")
                      : ""
                  }
                />
              </div>
              <div className="form-group col col-4">
                <label for="TenCV">Chức vụ</label>
                <input
                  className="form-control"
                  type="text"
                  id="TenCV"
                  value={DoanVien.TenCV}
                />
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
          <NavLink
            to={`/BCH-DoanTruong/ChiTietChiDoan/${DoanVien.IDLop}`}
            className="navlink"
          >
            <button
              className="allcus-button"
              onClick={() => setShowModal1(false)}
            >
              Đóng
            </button>
          </NavLink>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DoanVien;
