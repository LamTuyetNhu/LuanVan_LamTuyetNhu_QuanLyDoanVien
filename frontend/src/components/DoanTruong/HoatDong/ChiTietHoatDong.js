import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { NavLink } from "react-router-dom";
import {
  LayMotHoatDong,
  CapNhatHoatDong,
  XoaHoatDong,
} from "../../../services/apiService";
import { format, parseISO } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { useParams } from "react-router-dom";

import { faBackward, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChiTietHoatDong = (props) => {
  const { IDHoatDong } = useParams();
  const [HoatDong, setHoatDong] = useState([]);

  useEffect(() => {
    layMotHoatDong();
  }, [IDHoatDong]);

  const layMotHoatDong = async () => {
    try {
      let res = await LayMotHoatDong(IDHoatDong);

      if (res.status === 200) {
        setHoatDong(res.data.dataHD);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [CapNhatHoatDong, setCapNhathoatdong] = useState({
    IDHoatDong: IDHoatDong,
    TenHoatDong: "",
    NgayBatDau: "",
    NgayHetHan: "",
    ChiTietHoatDong: "",
  });

  const [errors, setErrors] = useState({
    TenHoatDong: "",
    NgayBatDau: "",
    NgayHetHan: "",
    ChiTietHoatDong: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log("Input changed:", e.target.value);
    setCapNhathoatdong((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const isValidDate = (dateString) => {
    try {
      const parsedDate = parseISO(dateString);
      if (isNaN(parsedDate.getTime())) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "",
    bodyContent: "",
  });
  const [modalContent1, setModalContent1] = useState({
    title: "",
    bodyContent: "",
  });

  const handleClose = () => {
    setShowModal(false);
  };
  const handleClose1 = () => {
    setShowModal1(false);
  };

  const handleShowModal = (title, bodyContent) => {
    setModalContent({
      title,
      bodyContent,
    });
    setShowModal(true);
  };

  const handleShowModal1 = (title, bodyContent) => {
    setModalContent({
      title,
      bodyContent,
    });
    setShowModal1(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      TenHoatDong: !CapNhatHoatDong.TenHoatDong
        ? "Vui lòng nhập tên hoạt động"
        : "",
      NgayBatDau: !isValidDate(CapNhatHoatDong.NgayBatDau)
        ? "Ngày bắt đầu phải có định dạng là DD/MM/YYYY"
        : "",
      NgayHetHan: !isValidDate(CapNhatHoatDong.NgayHetHan)
        ? "Ngày kết thúc có định dạng là DD/MM/YYYY"
        : "",
      ChiTietHoatDong: !CapNhatHoatDong.ChiTietHoatDong
        ? "Vui lòng nhập chi tiết hoạt động"
        : "",
    };

    if (
      new Date(CapNhatHoatDong.NgayHetHan) <=
      new Date(CapNhatHoatDong.NgayBatDau)
    ) {
      newErrors.NgayHetHan = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error(
        "Vui lòng nhập đầy đủ thông tin và kiểm tra định dạng ngày!"
      );
      return;
    }

    try {
      await CapNhatHoatDong(CapNhatHoatDong);
      // Xử lý sau khi thêm thành công (chuyển hướng hoặc hiển thị thông báo)
      // handleShowModal("", "Cập nhật thành công!");
      console.log("Hoạt động đã được thêm mới thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm mới hoạt động:", error);
    }
  };

  /**/
  // const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDelete = async () => {
    try {
      await XoaHoatDong(IDHoatDong);
      setShowModal(false);
      handleShowModal1(true);
      // console.log(IDHoatDong)

      // Optionally, you can redirect or show a success message
      console.log("Hoạt động đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hoạt động:", error);
    }
  };

  // const handleCloseDeleteModal = () => {
  //   setShowDeleteModal(false);
  // };

  return (
    <>
      <div className="container app__content">
        <h2 className="text-center">{HoatDong.TenHoatDong}</h2>

        <form id="customerForm" className="update">
          <div className="formadd">
            <Form.Label htmlFor="TenHoatDong" className="formadd-label">
              Tên hoạt động
            </Form.Label>
            <Form.Control
              type="text"
              id="TenHoatDong"
              aria-describedby="TenHoatDong"
              value={HoatDong.TenHoatDong}
              onChange={handleChange}
            />
            <div className="error-message">{errors.TenHoatDong}</div>
          </div>
          <div className="row flex">
            <div className="col formadd">
              <Form.Label htmlFor="NgayBanHanh" className="formadd-label">
                Ngày bắt đầu
              </Form.Label>
              <Form.Control
                type="text"
                id="NgayBanHanh"
                aria-describedby="NgayBanHanh"
                value={
                  HoatDong && HoatDong.NgayBanHanh
                    ? format(new Date(HoatDong.NgayBanHanh), "dd/MM/yyyy")
                    : ""
                }
                onChange={handleChange}
              />
              <div className="error-message">{errors.NgayBatDau}</div>
            </div>
            <div className="col formadd">
              <Form.Label htmlFor="NgayHetHan" className="formadd-label">
                Ngày kết thúc
              </Form.Label>
              <Form.Control
                type="text"
                id="NgayHetHan"
                aria-describedby="NgayHetHan"
                value={
                  HoatDong && HoatDong.NgayHetHan
                    ? format(new Date(HoatDong.NgayHetHan), "dd/MM/yyyy")
                    : ""
                }
                onChange={handleChange}
              />
              <div className="error-message">{errors.NgayHetHan}</div>
            </div>
          </div>
          <div className="formadd">
            <Form.Label htmlFor="ChiTietHoatDong" className="formadd-label">
              Chi tiết
            </Form.Label>
            <Form.Control
              type="text"
              id="ChiTietHoatDong"
              as="textarea"
              rows={5}
              aria-describedby="ChiTietHD"
              value={HoatDong.ChiTietHD}
              onChange={handleChange}
            />
            <div className="error-message">{errors.ChiTietHoatDong}</div>
          </div>{" "}
          <br />
          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink to="/BCH-DoanTruong/HoatDong" className="navlink">
                <FontAwesomeIcon icon={faBackward} />
              </NavLink>
            </button>

            <button className="allcus-button" type="button">
              Cập nhật
            </button>

            <button
              className="allcus-button button-error"
              type="button"
              onClick={() => setShowModal(true)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
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
          Bạn chắc chắn xóa?
        </Modal.Body>
        <Modal.Footer className="border-none">
          <button
            className="allcus-button button-error"
            onClick={() => handleDelete()}
          >
            Xóa
          </button>
          <button className="allcus-button" onClick={() => setShowModal1(false)}>
            {/* <NavLink to="/BCH-DoanTruong/HoatDong" className="navlink"> */}
              Đóng
            {/* </NavLink> */}
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
          <button className="allcus-button" onClick={() => setShowModal1(false)}> 
            {/* <NavLink to="/BCH-DoanTruong/HoatDong" className="navlink"> */}
              Đóng
            {/* </NavLink> */}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChiTietHoatDong;
