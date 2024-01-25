import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

import {
  faEye,
  faEdit,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import {
  namhoc,
  laydshoatdongcualop,
  searchHoatDong,
} from "../../../services/apiService";

const DanhSachHoatDong = (props) => {
  const { IDLop } = useParams();

  const [DSHoatDong, setDSHoatDong] = useState([]);

  const [idnamhoc, setIDNamHoc] = useState(1);
  const [NamHoc, setNamHoc] = useState([]);

  useEffect(() => {
    fetchDSHoatDong();
    fetchDSNamHoc();
  }, [IDLop, idnamhoc]);

  const fetchDSHoatDong = async () => {
    try {
      let res = await laydshoatdongcualop(IDLop, idnamhoc);

      if (res.status === 200) {
        setDSHoatDong(res.data.dataHD);
      } else {
        // Xử lý trường hợp lỗi
        console.error("Lỗi khi gọi API:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  const [searchData, setSearchData] = useState({
    TenHoatDong: "",
    Thang: "",
    ttHD: "",
  });

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

  const handleSearch = async () => {
    try {
      const trimmedTenHoatDong = searchData.TenHoatDong.trim();

      let res = await searchHoatDong({
        ...searchData,
        TenHoatDong: trimmedTenHoatDong,
      }); 

      console.log(res);
      if (res.status === 200) {
        setDSHoatDong(res.data.dataHD);
      } else {
        console.error("Lỗi khi tìm kiếm:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error.message);
    }
  };

  const handleNamHocChange = (e) => {
    const selectedIDNamHoc = e.target.value;
    setIDNamHoc(selectedIDNamHoc);
  };

  return (
    <>
      <div className="container-fluid app__content">
        <div className="namhoc-center">
          <h2 className="text-center">Danh Sách Hoạt Động</h2>

          <div className="searchDV-input">
            <select
              type="text"
              className="search_name"
              value={idnamhoc}
              onChange={handleNamHocChange}
            >
              {NamHoc.map((item, index) => {
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
                  placeholder="Tên hoạt động"
                  value={searchData.TenHoatDong}
                  onChange={(e) => {
                    setSearchData({
                      ...searchData,
                      TenHoatDong: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="searchDV-input">
                <select
                  type="text"
                  className="search_name"
                  value={searchData.Thang}
                  onChange={(e) => {
                    setSearchData({ ...searchData, Thang: e.target.value });
                  }}
                >
                  <option value="" disabled selected>
                    Tháng bắt đầu
                  </option>
                  <option value="1">Tháng 1</option>
                  <option value="2">Tháng 2</option>
                  <option value="3">Tháng 3</option>
                  <option value="4">Tháng 4</option>
                  <option value="5">Tháng 5</option>
                  <option value="6">Tháng 6</option>
                  <option value="7">Tháng 7</option>
                  <option value="8">Tháng 8</option>
                  <option value="9">Tháng 9</option>
                  <option value="10">Tháng 10</option>
                  <option value="11">Tháng 11</option>
                  <option value="12">Tháng 12</option>
                </select>
              </div>
              <div className="searchDV-input">
                <select
                  type="text"
                  className="search_name"
                  value={searchData.ttHD}
                  onChange={(e) => {
                    setSearchData({ ...searchData, ttHD: e.target.value });
                  }}
                >
                  <option value="" disabled selected>
                    Trạng thái
                  </option>
                  <option value="0">Chưa ban hành</option>
                  <option value="1">Đã ban hành</option>
                  <option value="2">Hoàn thành</option>
                </select>
              </div>
              <button className="formatButton" onClick={handleSearch}>
                {" "}
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>

          </div>
        </div>

        <div className="listDV">
          <div className="table-container">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="table-item">STT</th>
                  <th className="table-item">Tên hoạt động</th>
                  <th>Ngày ban hành</th>
                  <th>Ngày bắt đầu</th>

                  <th>Ngày hết hạn</th>
                  <th>Trạng thái</th>
                  <th className="table-item2"> Danh sách điểm danh</th>
                  <th className="table-item2">Chi tiết</th>
                </tr>
              </thead>
              <tbody id="myTable">
                {DSHoatDong &&
                  DSHoatDong.length > 0 &&
                  DSHoatDong.map((item, index) => {
                    return (
                      <tr key={`table-hoatdong-${index}`} className="tableRow">
                        <td className="col-center">{index + 1}</td>
                        <td className="">{item.TenHoatDong}</td>
                        <td className="col-center">
                          {format(new Date(item.NgayTao), "dd/MM/yyyy")}
                        </td>
                        <td className="col-center">
                          {format(new Date(item.NgayBanHanh), "dd/MM/yyyy")}
                        </td>
                        <td className="col-center">
                          {format(new Date(item.NgayHetHan), "dd/MM/yyyy")}
                        </td>

                        <td
                          className={` ${
                            item.ttHD === 0
                              ? ""
                              : item.ttHD === 1
                              ? "daTotNghiep"
                              : item.ttHD === 2
                              ? "chuaTotNghiep"
                              : "hoanthanh"
                          }`}
                        >
                          {item.ttHD === 0
                            ? "Chưa ban hành"
                            : item.ttHD === 1
                            ? "Đang diễn ra"
                            : item.ttHD === 2
                            ? "Hoàn thành"
                            : "Đã xóa"}
                        </td>

                        <td className="btnOnTable1">
                          <NavLink
                            to={`/ChiDoan/${IDLop}/ChiTietDiemDanh/${item.IDHoatDong}/${item.IDNamHoc}`}
                          >
                            <button className="btnOnTable clcapnhat ">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </NavLink>
                        </td>

                        <td className="btnOnTable1 thButton">
                          <NavLink
                            to={`/ChiDoan/${IDLop}/ChiTietHoatDong/${item.IDHoatDong}`}
                          >
                            <button className="btnOnTable">
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          </NavLink>
                        </td>
                      </tr>
                    );
                  })}
                {DSHoatDong && DSHoatDong.length === 0 && (
                  <tr className="tablenone">
                    <td className="tablenone">Không có hoạt động nào!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DanhSachHoatDong;
