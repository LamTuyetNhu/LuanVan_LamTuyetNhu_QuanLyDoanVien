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

// const ThemMoiDoanVien = (formData) => {
//   console.log(formData)
//   return axios.post("api/ThemMoiDoanVien", formData);
// };

const ThemMoiDoanVien = async (formData) => {
  try {
    console.log("HIHIHI")
    console.log(formData)
    const response = await axios.post("api/ThemMoiDoanVien", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure correct content type for file uploads
      },
    });
    console.log("HUHUHUHU")
    console.log(response.data); // Log the response data for debugging
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to handle it in your application
  }
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

const LayMotDoanVien = (IDLop, IDDoanVien, IDChiTietNamHoc) => {
  return axios.get(`api/laymotdoanvien/${IDLop}/${IDDoanVien}/${IDChiTietNamHoc}`);
};

const XoaDoanVien = (IDChiTietNamHoc) => {
  return axios.post(`api/XoaDoanVien/${IDChiTietNamHoc}`);
};

const laydsBCH = (page) => {
  return axios.get(`api/dsBCH/${page}`);
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
  LayMotDoanVien,
  XoaDoanVien,
  CapNhatDoanVien,
  ThemMoiDoanVien,
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
  LayTonGiao,
  LayDanToc
};


