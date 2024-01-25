import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import axios from "axios";

import {
  faCloudArrowDown,
  faMagnifyingGlass,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  laydsBCHMotLop,
  chucvu,
  searchBCH,
  namhoc,
  getKhoa
} from "../../../services/apiService";

const DanhSachBCH = (props) => {
  const { IDLop } = useParams();
  const [DoanVien, setDoanVien] = useState([]);

  const [DSChucVu, setListChucVu] = useState([]);

  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);
  const [DSKhoa, setKhoa] = useState([]);

  // const [searchData, setSearchData] = useState({
  //   IDNamHoc: idnamhoc,
  //   MSSV: "",
  //   HoTen: "",
  //   IDChucVu: "",
  //   Khoa: "",
  // });

  useEffect(() => {
    fetchDoanVien();
    // fetchDSChucVu();
    fetchDSNamHoc();
    // fetchDSKhoa()
  }, [IDLop, idnamhoc]);

  const fetchDoanVien = async () => {
    try {
      let res = await laydsBCHMotLop(IDLop, idnamhoc);
      console.log(res);
      if (res.status === 200) {
        setDoanVien(res.data.dataCD);
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

  const exportToExcel = async () => {
    // await fetchAllData();

    // const dataToExport = allData.map((item) => {
    const dataToExport = DoanVien.map((item) => {
      return {
        "Mã Chi Đoàn": item.MaLop,
        "Tên Chi Đoàn": item.TenLop,
        "Khóa": item.Khoa,
        "MSSV": item.MSSV,
        "Họ tên": item.HoTen,
        "Email": item.Email,
        "Số điện thoại": item.SoDT,
        "Giới tính":
          item.GioiTinh === 0 ? "Nữ" : item.GioiTinh === 1 ? "Nam" : "Khác",
        "Quê quán": item.QueQuan,
        "Dân tộc": item.TenDanToc,
        "TÔn giáo": item.TenTonGiao,
        "Ngày sinh": format(new Date(item.NgaySinh), "dd/MM/yyyy"),
        "Ngày vào đoàn": format(new Date(item.NgayVaoDoan), "dd/MM/yyyy"),
        "Trạng thái": item.ttLop === 1 ? "Đang hoạt động" : "Đã tốt nghiệp",
      };
    });

    // Tạo một đối tượng Workbook từ mảng dữ liệu
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachDoanVien");

    // Xuất file Excel
    XLSX.writeFile(wb, "DanhSachDoanVien.xlsx");
  };

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setNamHoc(selectedIDNamHoc);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Ban Chấp Hành</h2>
          <div className="searchDV-input">
            <select
              type="text"
              className="search_name"
              value={idnamhoc}
              onChange={handleNamHocChange}
            >
              {DSNamHoc.map((item, index) => {
                return (
                  <option key={index} value={item.IDNamHoc}>
                    {item.TenNamHoc}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

          <div className="searchDV-Right">
            <div className="">
              <button className="formatButton" onClick={exportToExcel}>
                <FontAwesomeIcon icon={faCloudArrowDown} /> 
              </button>
            </div>
          </div>

        <div className="listDV">
          <div className="table-container">
            <div className="giang-vien-container namhoc-center">
              <div className="container">
                <div className="row giang-vien-items giang-vien-item1">
                  {DoanVien &&
                    DoanVien.length > 0 &&
                    DoanVien.map((item, index) => {
                      return (
                        <div className="col-lg-4 col-md-6 col-sm-6 giang-vien-col lazy">
                          <NavLink
                            to={`/ChiDoan/${IDLop}/DanhSachBCH/${item.IDDoanVien}/${item.IDChiTietNamHoc}`}
                            className="NavLink-item"
                          >
                            <div className="giang-vien-item">
                              <div className="gv-image img-hover-zoom gv1">
                                <a>
                                  <img
                                    src={`http://localhost:8080/images/${item.TenAnh}`}
                                  />
                                </a>
                              </div>
                              <div className="gv-body">
                                <div className="giang-vien-subtitle">
                                  {item.MSSV}
                                </div>
                                <div className="giang-vien-title">
                                  <a>{item.HoTen}</a>
                                </div>
                                <div className="giang-vien-subtitle">
                                  {item.TenLop}
                                </div>
                                <p>{item.TenCV}</p>
                              </div>
                            </div>
                          </NavLink>
                        </div>
                      );
                    })}

                  {DoanVien && DoanVien.length === 0 && (
                    <tr className="tablenone">
                      <td className="tablenone">Không có đoàn viên nào!</td>
                    </tr>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default DanhSachBCH;
