import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { NavLink } from "react-router-dom";
import {
  namhoc,
  LayMotDoanPhi,
  CapNhatDoanPhi,
} from "../../../services/apiService";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";

import { useParams } from "react-router-dom";

import {
  faBackward,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChiTietDoanPhi = (props) => {
  const { IDDoanPhi } = useParams();
  const [DoanPhi, setDoanPhi] = useState([]);

  const [NamHoc, setNamHoc] = useState([]);

  const [editedDoanPhi, seteditedDoanPhi] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    layMotDoanPhi();
    fetchDSNamHoc();
  }, [IDDoanPhi]);

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

  const layMotDoanPhi = async () => {
    try {
      let res = await LayMotDoanPhi(IDDoanPhi);
      seteditedDoanPhi(res.data.dataDP);
      if (res.status === 200) {
        setDoanPhi(res.data.dataDP);
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

  const [errors, setErrors] = useState({
    TenDoanPhi: "",
    SoTien: "",
    IDNamHoc: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "SoTien") {
      // Kiểm tra xem value có phải là số không
      if (isNaN(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          SoTien: "Vui lòng nhập số cho trường này",
        }));
      } else {
        // Định dạng giá trị số tiền theo Việt Nam đồng
        setDoanPhi((prevData) => ({
          ...prevData,
          [id]: new Intl.NumberFormat("vi-VN").format(value),
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          SoTien: "",
        }));
      }
    }
    console.log("Input changed:", e.target.value);
    seteditedDoanPhi((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const [showModal, setShowModal] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  // const handleClose = () => {
  //   setShowModal(false);
  // };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const newErrors = {
      TenDoanPhi: !editedDoanPhi.TenDoanPhi ? "Vui lòng nhập tên đoàn phí" : "",
      SoTien: !editedDoanPhi.SoTien ? "Vui lòng nhập số tiền" : "",
      IDNamHoc: !editedDoanPhi.IDNamHoc ? "Vui lòng chọn năm học" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await CapNhatDoanPhi(editedDoanPhi);
      layMotDoanPhi();

      setDoanPhi(editedDoanPhi);
      setShowModal(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center">Đoàn phí</h2>

        <form id="customerForm" className="update">
          <div className="formadd">
            <Form.Label htmlFor="TenDoanPhi" className="formadd-label">
              Tên đoàn phí
            </Form.Label>
            {isEditing ? (
              <Form.Control
                className="form-control"
                type="text"
                id="TenDoanPhi"
                aria-describedby="TenDoanPhi"
                value={editedDoanPhi.TenDoanPhi}
                onChange={handleChange}
              />
            ) : (
              <Form.Control
                className="form-control"
                type="text"
                id="TenDoanPhi"
                aria-describedby="TenDoanPhi"
                value={DoanPhi.TenDoanPhi}
                disabled
              />
            )}
            <div className="error-message">{errors.TenDoanPhi}</div>
          </div>

          <div className="flex row">
            <div className="col col-6">
              <div className="formadd">
                <Form.Label htmlFor="SoTien" className="formadd-label">
                  Số tiền
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    className="form-control"
                    type="number"
                    id="SoTien"
                    aria-describedby="SoTien"
                    value={editedDoanPhi.SoTien}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    className="form-control"
                    type="text"
                    id="SoTien"
                    aria-describedby="SoTien"
                    value={formatCurrency(DoanPhi.SoTien)}
                    disabled
                  />
                )}
                <div className="error-message">{errors.SoTien}</div>
              </div>
            </div>
            <div className="col col-6">
            <div className="formadd">

              <Form.Label htmlFor="IDNamHoc" className="formadd-label">
                Năm học
              </Form.Label>
              <br />
              {isEditing ? (
                <Form.Select
                  id="IDNamHoc"
                  type="text"
                  aria-describedby="IDNamHoc"
                  className="form-select search_name"
                  value={editedDoanPhi.IDNamHoc}
                  onChange={handleChange}
                >
                  {/* <option>{DoanPhi.TenNamHoc}</option> */}
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
                  id="IDNamHoc"
                  className="search_name form-control"
                  value={DoanPhi.TenNamHoc}
                  type="text"
                  aria-describedby="IDNamHoc"
                  onChange={handleChange}
                  disabled
                />
              )}
              <div className="error-message">{errors.IDNamHoc}</div>
            </div>
            </div>
          </div>

          <br />
          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink to="/BCH-DoanTruong/DoanPhi" className="navlink">
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
          </div>
        </form>
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
          Cập nhật thành công!
        </Modal.Body>
        <Modal.Footer className="border-none">
          <button className="allcus-button" onClick={() => setShowModal(false)}>
            Đóng
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChiTietDoanPhi;
