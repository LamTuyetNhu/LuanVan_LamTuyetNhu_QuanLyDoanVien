import axios from "../utils/axiosUser";

const getAllChiDoan = (page) => {
  return axios.get(`api/dschidoan/${page}`);
};

const XoaChiDoan = (selectedIDLop) => {
  return axios.post(`api/XoaChiDoan/${selectedIDLop}`);
};

const laymotchidoan = (IDLop) => {
  return axios.get(`api/LayMotChiDoan/${IDLop}`);
};

const CapNhatChiDoan = (formData) => {
  console.log(formData)
  return axios.post("api/CapNhatChiDoan", formData);
};

const getKhoa = () => {
  return axios.get("api/dskhoa");
};

const searchChiDoan = (formData) => {
  return axios.post("api/searchChiDoan", formData);
};

const laymotlop = (IDLop, page) => {
  return axios.get(`api/detailChiDoan/${IDLop}/${page}`);
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

const laydshoatdong = (page) => {
  return axios.get(`api/layDSHoatDong/${page}`);
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
  console.log(formData)
  return axios.post("api/CapNhatHoatDong", formData);
};

const XoaHoatDong = (IDHoatDong) => {
  return axios.post(`api/XoaHoatDong/${IDHoatDong}`);
};

const LayMotDoanVien = (IDLop, IDDoanVien) => {
  return axios.get(`api/laymotdoanvien/${IDLop}/${IDDoanVien}`);
};

const XoaDoanVien = (IDDoanVien) => {
  return axios.post(`api/XoaDoanVien/${IDDoanVien}`);
};

const laydsBCH = (page) => {
  return axios.get(`api/dsBCH/${page}`);
};

const searchBCH = (formData) => {
  return axios.post(`api/searchBCH`, formData);
};

const themChiDoan = (formData) => {
  return axios.post("api/ThemChiDoan", formData);
};

const namhoc = () => {
  return axios.get(`api/namhoc`);
};

const layTatCaDSDoanPhi = (page) => {
  return axios.get(`api/dsdoanphi/${page}`);
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
  LayMotDoanVien,
  XoaDoanVien,
  CapNhatDoanVien,
  laydsBCH,
  searchBCH,
  themChiDoan,
  XoaChiDoan,
  namhoc,
  searchNamHoc,
  layTatCaDSDoanPhi,
  xoaMotDoanPhi,
  themDoanPhi,
  LayMotDoanPhi,
  CapNhatDoanPhi
};
