import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { namhoc, KetQuaCuaMotDoanVien } from "../../services/apiService";
import axios from "axios";
import ModalAddSuccess from "../Modal/ModalAddSuccess";

const SinhVienNamTot = (props) => {
  const navigate = useNavigate();
  const IDDoanVien = localStorage.getItem("IDDoanVien");

  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);
  const [DSKetQua, setDSKetQua] = useState([]);

  const [hk1, setHK1] = useState("");
  const [hk2, setHK2] = useState("");
  const [rl1, setRL1] = useState("");
  const [rl2, setRL2] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [errors, setErrors] = useState({
    hk1,
    hk2,
    rl1,
    rl2,
    idnamhoc,
  });

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    // Thêm logic kiểm tra hạn của token nếu cần
    return true;
  };

  useEffect(() => {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const tabs = $$(".tab-item");
    const panes = $$(".tab-pane");

    const tabActive = $(".tab-item.active");
    const line = $(".tabs .line");

    line.style.left = tabActive.offsetLeft + "px";
    line.style.width = tabActive.offsetWidth + "px";

    tabs.forEach((tab, index) => {
      var pane = panes[index];

      tab.onclick = function () {
        $(".tab-item.active").classList.remove("active");
        $(".tab-pane.active").classList.remove("active");

        line.style.left = this.offsetLeft + "px";
        line.style.width = this.offsetWidth + "px";

        this.classList.add("active");
        pane.classList.add("active");
      };
    });

    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }
    fetchDSNamHoc();
    fetchDSKetQua();
  }, [IDDoanVien, idnamhoc]);

  const fetchDSNamHoc = async () => {
    try {
      let res = await namhoc();
      if (res.status === 200) {
        const NamHocdata = res.data.dataNH;

        if (Array.isArray(NamHocdata)) {
          setDSNamHoc(NamHocdata);
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

  const fetchDSKetQua = async () => {
    try {
      let res = await KetQuaCuaMotDoanVien(IDDoanVien);
      if (res.status === 200) {
        const DanhGiadata = res.data.dataDG;

        if (Array.isArray(DanhGiadata)) {
          setDSKetQua(DanhGiadata);
        } else {
          console.error("Dữ liệu khóa không hợp lệ:", DanhGiadata);
        }
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const validateHK = (value) => {
    const floatValue = parseFloat(value);
    return !isNaN(floatValue) && floatValue >= 0 && floatValue <= 4;
  };

  // Hàm kiểm tra validateRL
  const validateRL = (value) => {
    const intValue = parseInt(value);
    return !isNaN(intValue) && intValue >= 0 && intValue <= 100;
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const newErrors = {
      hk1:
        !hk1.trim() === ""
          ? "Vui lòng nhập điểm học kỳ"
          : !validateHK(hk1)
          ? "Điểm không hợp lệ!"
          : "",
      hk2:
        !hk1.trim() === ""
          ? "Vui lòng nhập điểm học kỳ"
          : !validateHK(hk2)
          ? "Điểm không hợp lệ!"
          : "",
      rl1:
        !hk1.trim() === ""
          ? "Vui lòng nhập điểm rèn luyện"
          : !validateRL(rl1)
          ? "Điểm không hợp lệ!"
          : "",
      rl2:
        !hk1.trim() === ""
          ? "Vui lòng nhập điểm hrèn luyện"
          : !validateRL(rl2)
          ? "Điểm không hợp lệ!"
          : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const requestData = {
        hk1,
        hk2,
        rl1,
        rl2,
        idnamhoc,
        IDDoanVien,
      };

      let res = await axios.post(
        `http://localhost:8080/api/DiemCuaMotDoanVien`,
        requestData
      );

      let PhanLoai = res.data.dataDG
      
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setNamHoc(selectedIDNamHoc);
  };

  function getClassForPhanLoai(phanLoai) {
    switch (phanLoai) {
      case 1:
        return "excellent";
      case 2:
        return "good";
      case 3:
        return "average";
      case 4:
        return "weak";
      default:
        return "";
    }
  }

  function getPhanLoaiText(phanLoai) {
    switch (phanLoai) {
      case 1:
        return " Đoàn viên xuất sắc";
      case 2:
        return "Đoàn viên khá";
      case 3:
        return "Đoàn viên trung bình";
      case 4:
        return "Đoàn viên yếu";
      default:
        return "Chưa xét";
    }
  }

  const handleDSKetQuaClick = (namHoc) => {
    localStorage.setItem("IDDoanVien", IDDoanVien);
    localStorage.setItem("idnamhoc", namHoc);

    navigate("/DoanVien/CapNhatDiem");
  };
  return (
    <>
      <div className="container app__content">
        <h2 className="text-center mg-bt">Đánh giá đoàn viên</h2>

        <div className="tabs">
          <div className="tab-item active">
            <i className="tab-icon fas fa-code"></i>
            Tiêu chí đánh giá
          </div>
          <div className="tab-item">
            <i className="tab-icon fas fa-cog"></i>
            Kết quả đánh giá
          </div>
          <div className="line"></div>
        </div>

        <div className="tab-content">
          <div className="tab-pane active">
            <form id="customerForm" className="formHD">
              <div className="row margin-top1 ">
                <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto col-score">
                  <div className="card card-opacity1">
                    <div className="card-body">
                      <h5 className="card-title card-title1">
                        Đoàn viên xuất sắc
                      </h5>
                      <form id="customerForm" className="formHD">
                        <div style={{ whiteSpace: "pre-line" }}>
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto">
                              <div className="col-center margin-bottom">
                                <b>Điểm học tập</b>
                              </div>
                              <div className="col-center">
                                <div className="score ">
                                  <b>2.5</b>
                                </div>
                              </div>
                              <p className="col-center">
                                Điểm trung bình học tập hai học kỳ, mỗi học kỳ
                                đạt từ 2.5 trở lên
                                <br />
                              </p>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto">
                              <div className="col-center margin-bottom">
                                <b>Điểm rèn luyện</b>
                              </div>
                              <div className="col-center">
                                <div className="score ">
                                  <b>80</b>
                                </div>
                              </div>

                              <p className="col-center">
                                Điểm trung bình rèn luyện 2 học kỳ đạt từ 80 trở
                                lên (không có học kỳ nào dưới 70)
                              </p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto col-score">
                  <div className="card card-opacity1">
                    <div className="card-body">
                      <h5 className="card-title card-title1">Đoàn viên khá</h5>
                      <form id="customerForm" className="formHD">
                        <div style={{ whiteSpace: "pre-line" }}>
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto">
                              <div className="col-center margin-bottom">
                                <b>Điểm học tập</b>
                              </div>
                              <div className="col-center">
                                <div className="score ">
                                  <b>2.0</b>
                                </div>
                              </div>
                              <p className="col-center">
                                Điểm trung bình học tập hai học kỳ xết đạt từ
                                2.0 trở lên (không có học kỳ nào dưới 1.5)
                              </p>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto">
                              <div className="col-center margin-bottom">
                                <b>Điểm rèn luyện</b>
                              </div>
                              <div className="col-center">
                                <div className="score ">
                                  <b>70</b>
                                </div>
                              </div>

                              <p className="col-center">
                                Điểm trung bình rèn luyện 2 học kỳ đạt từ 70 trở
                                lên (không có học kỳ nào dưới 60)
                              </p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto col-score">
                  <div className="card card-opacity1">
                    <div className="card-body">
                      <h5 className="card-title card-title1">
                        Đoàn viên trung bình
                      </h5>
                      <form id="customerForm" className="formHD">
                        <div style={{ whiteSpace: "pre-line" }}>
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto">
                              <div className="col-center margin-bottom">
                                <b>Điểm học tập</b>
                              </div>
                              <div className="col-center">
                                <div className="score ">
                                  <b>1.5</b>
                                </div>
                              </div>
                              <p className="col-center">
                                Điểm trung bình học tập hai học kỳ xét đạt từ
                                1.5 trở lên (không có học kỳ nào dưới 1.0)
                                <br />
                              </p>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto">
                              <div className="col-center margin-bottom">
                                <b>Điểm rèn luyện</b>
                              </div>
                              <div className="col-center">
                                <div className="score ">
                                  <b>50</b>
                                </div>
                              </div>

                              <p className="col-center">
                                Điểm trung bình rèn luyện 2 học kỳ đạt từ 50 trở
                                lên
                              </p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto col-score">
                  <div className="card card-opacity1">
                    <div className="card-body">
                      <h5 className="card-title card-title1">Đoàn viên yếu</h5>
                      <form id="customerForm" className="formHD">
                        <div style={{ whiteSpace: "pre-line" }}>
                          <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto">
                              <div className="col-center margin-bottom">
                                <b>Điểm học tập</b>
                              </div>
                              <div className="col-center">
                                <div className="score ">
                                  <b>&lt; 1.5</b>
                                </div>
                              </div>
                              <p className="col-center">
                                Điểm trung bình học tập hai học kỳ không đạt yêu
                                cầu (dưới 1.5) hoặc có một kỳ dưới 1.0
                              </p>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12 mb-4 mx-auto">
                              <div className="col-center margin-bottom">
                                <b>Điểm rèn luyện</b>
                              </div>
                              <div className="col-center">
                                <div className="score ">
                                  <b>
                                    <b>&lt; 50</b>
                                  </b>
                                </div>
                              </div>

                              <p className="col-center">
                                Điểm trung bình rèn luyện 2 học kỳ dưới 50 hoặc
                                có một học kỳ dưới 30
                              </p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="tab-pane">
            <div id="customerForm" className="formHD">
              <div className="row margin-top1">
                {DSKetQua.length === 0 ? (
                  <div className=" ">
                    <p className="tablenone1">Không có phân loại nào.</p>
                  </div>
                ) : (
                  DSKetQua.map((ketqua, index) => (
                    <div className="col-lg-6 col-md-6 col-sm-12 mb-4 mx-auto">
                      <div className="card card-opacity1 " onClick={() => handleDSKetQuaClick(ketqua.IDNamHoc)}>
                        <div className="card-body">
                          <div
                            className={`card-title card-title1 circle ${getClassForPhanLoai(
                              ketqua.PhanLoai
                            )}`}
                          >
                            {getPhanLoaiText(ketqua.PhanLoai)}
                            <h5>{ketqua.TenNamHoc}</h5>
                          </div>
                          <img src={require(`../../assets/${ketqua.PhanLoai}.jpg`)} className="img-fluid img-mandel" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalAddSuccess show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
};

export default SinhVienNamTot;
