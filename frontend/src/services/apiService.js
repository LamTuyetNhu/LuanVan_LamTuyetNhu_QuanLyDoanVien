import axios from "../utils/axiosUser";
// import axios from "axios"

// const token = localStorage.getItem("token");

// const instance = axios.create({
//   baseURL: 'http://localhost:8080/',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   }
// })

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 401) {
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

const getAllChiDoan = (page) => {
  return axios.get(`api/dschidoan/${page}`, {
    // headers: {
    //   'Authorization': `Bearer ${token}`
    // }
  });
};

const XoaChiDoan = (selectedIDLop) => {
  return axios.post(`api/XoaChiDoan/${selectedIDLop}`);
};

const laymotchidoan = (IDLop) => {
  return axios.get(`api/LayMotChiDoan/${IDLop}`);
};

const CapNhatChiDoan = (formData) => {
  return axios.post("api/CapNhatChiDoan", formData);
};

const getKhoa = () => {
  return axios.get("api/dskhoa");
};

const searchChiDoan = (formData) => {
  return axios.post("api/searchChiDoan", formData);
};

const laymotlop = (IDLop, page, idnamhoc) => {
  return axios.get(`api/detailChiDoan/${IDLop}/${page}/${idnamhoc}`);
};

const chucvu = () => {
  return axios.get(`api/getChucVu`);
};

const searchDoanVien = (formData) => {
  return axios.post("api/searchDoanVien", formData);
};

const CapNhatDoanVien = (formData) => {
  return axios.post("api/CapNhatDoanVien", formData);
};

const laydshoatdong = (page, idnamhoc) => {
  return axios.get(`api/layDSHoatDong/${page}/${idnamhoc}`);
};

const searchHoatDong = (formData) => {
  return axios.post("api/searchHoatDong", formData);
};

const themHoatDong = (formData) => {
  return axios.post("api/TaoHoatDong", formData);
};

const LayMotHoatDong = (IDHoatDong) => {
  return axios.get(`api/layMotHoatDong/${IDHoatDong}`);
};

const CapNhatHoatDong = (formData) => {
  return axios.post("api/CapNhatHoatDong", formData);
};

const XoaHoatDong = (IDHoatDong) => {
  return axios.post(`api/XoaHoatDong/${IDHoatDong}`);
};

const LayDSDiemDanh = (IDHoatDong) => {
  return axios.get(`api/LayDSDiemDanh/${IDHoatDong}`);
};

const SaveCheckboxStatesDiemDanh = (IDHoatDong, checkboxStates) => {
  return axios.post("api/saveCheckboxStatesDiemDanh", {
    IDHoatDong,
    checkboxStates,
  });
};

const LayMotDoanVien = (IDLop, IDDoanVien, IDChiTietNamHoc) => {
  return axios.get(
    `api/laymotdoanvien/${IDLop}/${IDDoanVien}/${IDChiTietNamHoc}`
  );
};

const XoaDoanVien = (IDChiTietNamHoc) => {
  return axios.post(`api/XoaDoanVien/${IDChiTietNamHoc}`);
};

const laydsBCH = (page, idnamhoc) => {
  return axios.get(`api/dsBCH/${page}/${idnamhoc}`);
};

const searchBCH = (formData) => {
  return axios.post(`api/searchBCH`, formData);
};

const XoaBanChapHanh = (select) => {
  return axios.post(`api/XoaBanChapHanh/${select}`);
};

const themChiDoan = (formData) => {
  return axios.post("api/ThemChiDoan", formData);
};

const namhoc = () => {
  return axios.get(`api/namhoc`);
};

const layTatCaDSDoanPhi = (page, idnamhoc) => {
  return axios.get(`api/dsdoanphi/${page}/${idnamhoc}`);
};

const searchNamHoc = (formData) => {
  return axios.post(`api/searchNamHoc`, formData);
};

const xoaMotDoanPhi = (IDDoanPhi) => {
  return axios.post(`api/XoaMotDoanPhi/${IDDoanPhi}`);
};

const themDoanPhi = (formData) => {
  return axios.post("api/ThemDoanPhi", formData);
};

const LayMotDoanPhi = (IDDoanPhi) => {
  return axios.get(`api/LayMotDoanPhi/${IDDoanPhi}`);
};

const CapNhatDoanPhi = (formData) => {
  return axios.post("api/CapNhatDoanPhi", formData);
};

const LayDSNopDoanPhi = (IDDoanPhi, IDNamHoc) => {
  return axios.get(`api/LayDSNopDoanPhi/${IDDoanPhi}/${IDNamHoc}`);
};

const SaveCheckboxStates = (IDDoanPhi, checkboxStates) => {
  return axios.post("api/saveCheckboxStates", {
    IDDoanPhi,
    checkboxStates,
  });
};

const LayDanToc = () => {
  return axios.get(`api/LayDanToc`);
};

const LayTonGiao = () => {
  return axios.get(`api/LayTonGiao`);
};

export {
  getAllChiDoan,
  searchChiDoan,
  laymotchidoan,
  CapNhatChiDoan,
  getKhoa,
  laymotlop,
  chucvu,
  searchDoanVien,
  laydshoatdong,
  searchHoatDong,
  themHoatDong,
  LayMotHoatDong,
  CapNhatHoatDong,
  XoaHoatDong,
  LayDSDiemDanh,
  SaveCheckboxStatesDiemDanh,
  LayMotDoanVien,
  XoaDoanVien,
  CapNhatDoanVien,
  // ThemMoiDoanVien,
  // ThemDanhSachDoanVien,
  laydsBCH,
  searchBCH,
  XoaBanChapHanh,
  themChiDoan,
  XoaChiDoan,
  namhoc,
  searchNamHoc,
  layTatCaDSDoanPhi,
  xoaMotDoanPhi,
  themDoanPhi,
  LayMotDoanPhi,
  CapNhatDoanPhi,
  LayDSNopDoanPhi,
  SaveCheckboxStates,
  LayTonGiao,
  LayDanToc,
};
