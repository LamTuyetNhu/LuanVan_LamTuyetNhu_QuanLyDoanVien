import axios from "../utils/axiosUser";

const getAllChiDoan = (page) => {
  return axios.get(`api/dschidoan/${page}`);
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

export {
  getAllChiDoan,
  searchChiDoan,
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
  laydsBCH,
  searchBCH,
  themChiDoan
};
