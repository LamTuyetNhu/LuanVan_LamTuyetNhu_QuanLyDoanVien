import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Form from "react-bootstrap/Form";
import {
  faCloudArrowUp,
  faCloudArrowDown,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { namhoc, mauUngTuyen } from "../../services/apiService";
import Modal from "../Modal/Modal";
import ModalPDF from "../Modal/PDF";
import ResultSVNT from "../Modal/ResultSVNT";
import axios from "axios";
import { pdfjs } from "react-pdf";

const SinhVienNamTot = (props) => {
  const IDDoanVien = localStorage.getItem("IDDoanVien");

  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [MauUngTuyen, setMauUngTuyen] = useState([]);

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

    fetchDSNamHoc();
    fetchMauUngTuyen();
  }, [IDDoanVien, idnamhoc]);

  const fetchDSNamHoc = async () => {
    try {
      let res = await namhoc();
      if (res.status === 200) {
        // setListKhoa(res.data.dataNH); // Cập nhật state với danh sách khóa học
        const NamHocdata = res.data.dataNH;

        // Kiểm tra nếu khoaData là mảng trước khi cập nhật state
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

  const fetchMauUngTuyen = async () => {
    try {
      let res = await mauUngTuyen();
      console.log(res);
      if (res.status === 200) {
        const MauUngTuyenData = res.data.dataUT;
        // if (Array.isArray(MauUngTuyenData)) {
          const url = MauUngTuyenData[0].TenFile;

          setMauUngTuyen(url);
        // } else {
        //   console.error("Dữ liệu khóa không hợp lệ:", MauUngTuyenData);
        // }
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setShowExcelModal(true); // Show the modal for preview and selection
    } else {
      setErrorMessage("Vui lòng chọn file PDF!");
      setShowModalUpdate(true);
    }
  };

  const handleConfirmExcelData = async (idnamhoc) => {
    try {
      const formData = new FormData();
      formData.append("IDDoanVien", IDDoanVien);
      formData.append("idnamhoc", idnamhoc);
      formData.append("file", selectedFile);

      let res = await axios.post(
        "http://localhost:8080/api/UngTuyen",
        formData
      );

      if (res.status === 200) {
        // Thêm thành công
        setSuccessMessage("Thêm thành công!");
        setShowModalUpdate(true);
      } else {
        // Xử lý trường hợp lỗi
        setErrorMessage("Thêm không thành công!");
        setShowModalUpdate(true);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Lỗi khi tải file:", error.message);
      // setErrorMessage("Lỗi khi tải file!");
      setErrorMessage();

      setShowModalUpdate(true);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleViewResultClick = () => {
    setShowResult(true);
  };

  const handleDownloadMauUngTuyen = async () => {
    try {
      // Gửi yêu cầu HTTP để lấy thông tin mẫu ứng tuyển
      let res = await axios.get(`http://localhost:8080/files/${MauUngTuyen}`, {
        responseType: "blob", // Để xác định dữ liệu nhận được là dạng binary
      });

      console.log(res);
      // Tạo một đường link ảo để tải file
      const url = window.URL.createObjectURL(new Blob([res.data]));

      // Tạo một thẻ 'a' để kích hoạt tải về
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", MauUngTuyen); // Đặt tên file

      // Bắt đầu tải file
      document.body.appendChild(link);
      link.click();

      // Gỡ bỏ đối tượng đã tạo
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi khi tải mẫu ứng tuyển:", error.message);
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <>
      <div className="container app__content">
        <div className="namhoc-center">
          <h2 className="text-center mg-bt">
            Tiêu chuẩn xét chọn sinh viên năm tốt
          </h2>
        </div>
        <div className="tabs">
          <div className="tab-item active">
            <i className="tab-icon fas fa-code"></i>
            Đạo đức tốt
          </div>
          <div className="tab-item">
            <i className="tab-icon fas fa-cog"></i>
            Học tập tốt
          </div>
          <div className="tab-item">
            <i className="tab-icon fas fa-plus-circle"></i>
            Thể lực tốt
          </div>
          <div className="tab-item">
            <i className="tab-icon fas fa-pen-nib"></i>
            Tình nguyện tốt
          </div>
          <div className="tab-item">
            <i className="tab-icon fas fa-pen-nib"></i>
            Hội nhập tốt
          </div>
          <div className="tab-item">
            <i className="tab-icon fas fa-pen-nib"></i>
            Ứng tuyển
          </div>
          <div className="line"></div>
        </div>

        <div className="tab-content">
          <div className="tab-pane active">
            <h2>Đạo đức tốt</h2>
            <form id="customerForm" className="formHD">
              <div>
                <ul>
                  <li>
                    Điểm trung bình cộng của Học kỳ 1 và 2 trong năm học đạt từ
                    2,5 trở lên và không bị nợ học phần trong năm học.
                  </li>
                  <li>
                    Lưu ý:
                    <ul>
                      <li>Không xét điểm học tập Học kỳ 3.</li>
                      <li>
                        Sinh viên học lại học phần nợ ở các học kỳ trước trong
                        học kỳ 3 của năm học xét trao danh hiệu, nếu đạt điểm D
                        trở lên sẽ được xét không nợ môn.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Ưu tiên khi xét trao danh hiệu:
                    <ul>
                      <li>
                        Tham gia sinh hoạt thường xuyên ít nhất 01 câu lạc bộ
                        học thuật.
                      </li>
                      <li>
                        Tham gia kỳ thi Olympic các môn học từ cấp khoa trở lên
                        tổ chức.
                      </li>
                      <li>
                        Là chủ nhiệm đề tài nghiên cứu khoa học sinh viên trong
                        năm học.
                      </li>
                      <li>
                        Là thành viên các đội tuyển tham gia thi cấp quốc gia,
                        quốc tế.
                      </li>
                      <li>Tham gia các cuộc thi ý tưởng sáng tạo.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </form>
          </div>
          <div className="tab-pane">
            <h2>Học tập tốt</h2>
            <form id="customerForm" className="formHD">
              <div>
                <ul>
                  Đạt 01 trong các tiêu chí sau:
                  <li>
                    Trong năm học phải học ít nhất 01 học phần Giáo dục thể chất
                    (học phần có rèn luyện thể lực) và đạt điểm B trở lên.
                  </li>
                  <li>
                    Tham gia ít nhất 01 hoạt động rèn luyện thể dục, thể thao do
                    cấp Khoa, Liên chi hội trở lên tổ chức.
                  </li>
                </ul>
                <p>
                  * Đối với những sinh viên khuyết tật: tiêu chuẩn về thể lực
                  bao gồm: tập thể dục hàng ngày hoặc rèn luyện ít nhất 01 môn
                  thể thao dành cho người khuyết tật.
                </p>
              </div>
            </form>
          </div>
          <div className="tab-pane">
            <h2>Thể lực tốt</h2>
            <form id="customerForm" className="formHD">
              <div>
                <ul>
                  Đạt 01 trong các tiêu chí sau:
                  <li>
                    Trong năm học phải học ít nhất 01 học phần Giáo dục thể chất
                    (học phần có rèn luyện thể lực) và đạt điểm B trở lên.
                  </li>
                  <li>
                    Tham gia ít nhất 01 hoạt động rèn luyện thể dục, thể thao do
                    cấp Khoa, Liên chi hội trở lên tổ chức.
                  </li>
                </ul>
                <p>
                  * Đối với những sinh viên khuyết tật: tiêu chuẩn về thể lực
                  bao gồm: tập thể dục hàng ngày hoặc rèn luyện ít nhất 01 môn
                  thể thao dành cho người khuyết tật.
                </p>
              </div>
            </form>
          </div>
          <div className="tab-pane">
            <h2>Tình nguyện tốt</h2>
            <form id="customerForm" className="formHD">
              <div>
                <ul>
                  Đạt 01 trong các tiêu chuẩn sau:
                  <li>Được khen thưởng trong hoạt động tình nguyện.</li>
                  <li>Tham gia ít nhất 03 hoạt động tình nguyện.</li>
                  <li>Tham gia ít nhất 02 lần Hiến máu tình nguyện.</li>
                </ul>
              </div>
            </form>
          </div>
          <div className="tab-pane">
            <h2>Hội nhập tốt</h2>
            <div>
              <form id="customerForm" className="formHD">
                <div>
                  <ul>
                    Đạt 02 trong 03 tiêu chuẩn sau:
                    <li>
                      Về ngoại ngữ: đạt 01 trong 02 tiêu chí sau:
                      <ul>
                        <li>
                          Được cấp giấy khen tham gia cuộc thi ngoại ngữ cấp
                          trường trở lên.
                        </li>
                        <li>
                          Đạt chứng chỉ ngoại ngữ theo bảng quy đổi bên dưới
                       <div className="table-container">
                       <table className="table table-striped margin-top">
                            <thead>
                              <th>Đối tượng</th>
                              <th>Chứng chỉ</th>
                              <th>CEFR</th>
                              <th>IELTS</th>
                              <th>TOEIC</th>
                              <th>TOEFL</th>
                            </thead>
                            <tbody id="myTable">
                              <tr>
                                <td>Sinh viên năm 1, 2</td>
                                <td className="col-center">A</td>
                                <td className="col-center">A1</td>
                                <td className="col-center">2.0</td>
                                <td className="col-center">250</td>
                                <td className="col-center">60 CBT / 19 iBT</td>
                              </tr>

                              <tr>
                                <td>Sinh viên năm 3 trở lên</td>
                                <td className="col-center">B</td>
                                <td className="col-center">A2</td>
                                <td className="col-center">3.0</td>
                                <td className="col-center">350</td>
                                <td className="col-center">96 CBT / 40 iBT</td>
                              </tr>
                            </tbody>
                          </table>
                       </div>
                        </li>
                        <p>
                          Lưu ý:
                          <ul>
                            <li>
                              Các chứng chỉ phải được cấp trong thời gian năm
                              học (từ tháng 8/2019 đến tháng 7/2020).
                            </li>
                            <li>
                              Các chứng chỉ được cấp trước thời gian nêu trên,
                              yêu cầu phải đạt thêm 01 trong những tiêu chí sau:
                              <ul>
                                <li>
                                  Trong năm học phải học ít nhất 01 học phần
                                  hoặc khóa học về ngoại ngữ.
                                </li>
                                <li>
                                  Được cấp giấy chứng nhận tham gia cuộc thi
                                  ngoại ngữ cấp khoa, trường trở lên.
                                </li>
                              </ul>
                            </li>
                            <li>
                              Đối với sinh viên chuyên ngành Tiếng Anh: có chứng
                              chỉ ngoại ngữ khác tương đương chứng chỉ A trở
                              lên.
                            </li>
                          </ul>
                        </p>
                      </ul>
                    </li>
                    <li>
                      Tin học: đạt 01 trong 04 tiêu chí sau:
                      <ul>
                        <li>Đạt chứng chỉ tin học cơ bản trở lên;</li>
                        <li>
                          Điểm trung bình của 2 học phần tin học căn bản từ điểm
                          B trở lên;
                        </li>
                        <li>
                          Được cấp giấy khen hoặc giấy chứng nhận tham gia cuộc
                          thi tin học cấp khoa, trường trở lên.
                        </li>
                        <li>
                          Trong năm học có học ít nhất 01 học phần hoặc khóa học
                          về tin học, công nghệ thông tin và điểm trung bình học
                          phần đạt từ B hoặc khóa học đạt từ 7.0 điểm (loại khá)
                          trở lên. (Lưu ý: không xét điều kiện này đối với sinh
                          viên chuyên ngành Công nghệ thông tin, tin học)
                        </li>
                      </ul>
                    </li>
                    <li>
                      Tham gia các hoạt động, phong trào nâng cao kỹ năng Hội
                      nhập: đạt 02 trong 06 tiêu chí sau:
                      <ul>
                        <li>
                          Được chứng nhận tham gia 01 hoạt động Hội nhập do cấp
                          trường trở lên tổ chức.
                        </li>
                        <li>
                          Được chứng nhận tham gia 01 hoạt động giao lưu với
                          sinh viên quốc tế, trao đổi sinh viên do cấp khoa,
                          liên chi hội trở lên tổ chức hoặc tham gia các khóa
                          học ngắn hạn tại nước ngoài.
                        </li>
                        <li>
                          Được Hội Sinh viên, Đoàn Thanh niên từ cấp Khoa trở
                          lên khen thưởng về thành tích xuất sắc trong công tác
                          Hội và phong trào sinh viên hoặc công tác Đoàn và
                          phong trào thanh niên trong năm học.
                        </li>
                        <li>
                          Trực tiếp tổ chức hoặc được chứng nhận tham gia ít
                          nhất 01 lớp tập huấn hoặc khóa học bồi dưỡng kỹ năng
                          do cấp Khoa, Liên chi hội trở lên tổ chức.
                        </li>
                        <li>
                          Đạt điểm B trở lên đối với các Học phần về Kỹ năng do
                          Trường tổ chức giảng dạy (như Kỹ năng mềm, Đổi mới
                          sáng tạo và khởi nghiệp,…)
                        </li>
                        <li>
                          Đạt từ giải khuyến khích trở lên các cuộc thi tìm hiểu
                          về văn hóa, lịch sử, xã hội trong nước và thế giới do
                          cấp Khoa, Liên chi hội trở lên tổ chức.
                        </li>
                        <p>
                          Lưu ý:
                          <ul>
                            <li>
                              Tất cả các thành tích đề nghị danh hiệu “Sinh viên
                              5 tốt” cấp trường được tính trong khoảng thời gian
                              của năm học được xét trao danh hiệu.
                            </li>
                            <li>
                              Trường hợp có thêm các tiêu chuẩn ngoài nội dung
                              trên, Thường trực Hội Sinh viên trường sẽ xem xét.
                            </li>
                          </ul>
                        </p>
                      </ul>
                    </li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
          <div className="tab-pane">
            <h2>Ứng tuyển</h2>
            <div className="margin-top">
              <div className="table-container">
                <table className="table table-striped table-svnt">
                  <tbody id="myTable">
                    <tr className="tableRow">
                      <td>Tải mẫu ứng tuyển</td>
                      <td className="col-center">
                        <FontAwesomeIcon
                          className="icon-nonePd"
                          icon={faCloudArrowDown}
                          onClick={handleDownloadMauUngTuyen}
                        />
                      </td>
                    </tr>
                    <tr className="tableRow">
                      <td>Xem kết quả ứng tuyển</td>
                      <td className="col-center">
                        <FontAwesomeIcon
                          className="icon-nonePd"
                          icon={faEye}
                          onClick={handleViewResultClick}
                        />
                      </td>
                    </tr >
                    <tr className="tableRow">
                      <td>Nộp file ứng tuyển</td>
                      <td className="col-center">
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <FontAwesomeIcon
                            className="icon-nonePd"
                            icon={faCloudArrowUp}
                            onClick={handleButtonClick}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Display success message */}
        {successMessage && (
          <Modal
            show={showModalUpdate}
            onHide={() => {
              setShowModalUpdate(false);
              setSuccessMessage("");
            }}
            message={successMessage}
          />
        )}

        {/* Display error message */}
        {errorMessage && (
          <Modal
            show={showModalUpdate}
            onHide={() => {
              setShowModalUpdate(false);
              setErrorMessage("");
            }}
            message={errorMessage}
            isError={true}
          />
        )}
      </div>

      {showExcelModal && (
        <ModalPDF
          showModal={showExcelModal}
          onClose={() => setShowExcelModal(false)}
          onConfirm={handleConfirmExcelData}
          excelData={excelData}
        />
      )}

      {showResult && (
        <ResultSVNT
          showModal={showResult}
          onClose={() => setShowResult(false)}
        />
      )}
    </>
  );
};

export default SinhVienNamTot;
