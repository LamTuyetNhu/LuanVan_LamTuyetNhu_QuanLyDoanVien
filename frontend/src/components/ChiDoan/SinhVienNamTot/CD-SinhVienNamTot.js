import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import Modal from "../../Modal/Modal";
import ExcelDataModal from "../../Modal/ExcelDataModal1";

import axios from "axios";
import {
  faEdit,
  faFilePdf,
  faCloudArrowDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import {
  searchDoanVien,
  namhoc,
  DanhSachUngTuyen,
} from "../../../services/apiService";

const DanhSachDoanVien = (props) => {
  const [DSDoanVien, setListDoanVien] = useState([]);

  const [idnamhoc, setNamHoc] = useState(1);
  const [DSNamHoc, setDSNamHoc] = useState([]);

  const [searchData, setSearchData] = useState({
    MSSV: "",
    HoTen: "",
    IDChucVu: "",
    GioiTinh: "",
  });

  useEffect(() => {
    fetchDSDoanVien();
    fetchAllData();
    fetchDSNamHoc();
  }, [idnamhoc]);

  const fetchDSDoanVien = async () => {
    try {
      let res = await DanhSachUngTuyen(idnamhoc);
      console.log(res);

      if (res.status === 200) {
        console.log("Data from API:", res.data.dataUT);
        console.log("Total Pages from API:", res.data.totalPages);

        setListDoanVien(res.data.dataUT);
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

  const handleSearch = async () => {
    try {
      const trimmedMaLop = searchData.MaLop.trim().toLowerCase();
      const trimmedMSSV = searchData.MSSV.trim().toLowerCase();
      const trimmedHoTen = searchData.HoTen.trim().toLowerCase();

      let res = await searchDoanVien({
        ...searchData,
        MaLop: trimmedMaLop,
        MSSV: trimmedMSSV,
        HoTen: trimmedHoTen,
        IDNamHoc: idnamhoc,
      });

      console.log(res);
      if (res.status === 200) {
        setListDoanVien(res.data.dataUT);
      } else {
        console.error("Lỗi khi tìm kiếm:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error.message);
    }
  };

  const [allData, setAllData] = useState([]);

  const fetchAllData = async () => {
    try {
      let allDataArray = [];
      let res = await DanhSachUngTuyen(idnamhoc);

      if (res.status === 200) {
        allDataArray = [...allDataArray, ...res.data.dataUT];
      } else {
        console.error("Lỗi khi gọi API:", res.statusText);
      }
      setAllData(allDataArray);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const exportToExcel = async () => {
    // Tạo một mảng chứa dữ liệu bạn muốn xuất
    try {
      await fetchAllData();

      const dataToExport = allData.map((item) => {
        return {
          "Mã Chi Đoàn": item.MaLop,
          "Tên Chi Đoàn": item.TenLop,
          Khóa: item.Khoa,
          MSSV: item.MSSV,
          "Họ tên": item.HoTen,
          Email: item.Email,
          "Số điện thoại": item.SoDT,
          "Giới tính":
            item.GioiTinh === 0 ? "Nữ" : item.GioiTinh === 1 ? "Nam" : "Khác",
        };
      });

      // Tạo một đối tượng Workbook từ mảng dữ liệu
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "DanhSachSinhVienNamTot");

      // Xuất file Excel
      XLSX.writeFile(wb, `DanhSachSinhVienNamTot - ${allData[0].TenNamHoc}.xlsx`);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error.message);
      // Xử lý lỗi nếu có
    }
  };

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setNamHoc(selectedIDNamHoc);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Sinh Viên Năm Tốt</h2>
          <div className="searchDV-input">
            Năm học:{" "}
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
        <div className="search">
          <div className="searchDV">
            <div className="">
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Mã Lớp"
                  value={searchData.MaLop}
                  onChange={(e) => {
                    setSearchData({ ...searchData, MaLop: e.target.value });
                  }}
                />
              </div>
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Mã đoàn viên"
                  value={searchData.MSSV}
                  onChange={(e) => {
                    setSearchData({ ...searchData, MSSV: e.target.value });
                  }}
                />
              </div>
              <div className="searchDV-input">
                <input
                  type="text"
                  className="search_name"
                  placeholder="Tên đoàn viên"
                  value={searchData.HoTen}
                  onChange={(e) => {
                    setSearchData({ ...searchData, HoTen: e.target.value });
                  }}
                />
              </div>

              <button className="formatButton" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
            <div className="buttonSearch">
              <div>
                <button className="formatButton" onClick={exportToExcel}>
                  <FontAwesomeIcon icon={faCloudArrowDown} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="listDV">
        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã lớp</th>
                <th>MSSV</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Hồ sơ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody id="myTable">
              {DSDoanVien &&
                DSDoanVien.length > 0 &&
                DSDoanVien.map((item, index) => {
                  return (
                    <tr key={`table-doanvien-${index}`} className="tableRow">
                      <td className="col-center">{index + 1}</td>
                      <td className="">{item.MaLop}</td>
                      <td className="">{item.MSSV}</td>
                      <td className="">{item.HoTen}</td>
                      <td className="">{item.Email}</td>
                      <td className="col-center">
                        <a
                          href={`http://localhost:8080/files/${item.FileUngTuyen}`}
                        >
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            className="icon-black"
                          />
                        </a>
                      </td>
                      <td className="">
                        {item.TTUngTuyen === 0
                          ? "Chưa xét duyệt"
                          : item.TTUngTuyen === 1
                          ? "Đã xét duyệt"
                          : "Không đủ điều kiện"}
                      </td>
                    </tr>
                  );
                })}
              {DSDoanVien && DSDoanVien.length === 0 && (
                <tr className="tablenone">
                  <td className="tablenone">Không có sinh viên nào đăng ký!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DanhSachDoanVien;
