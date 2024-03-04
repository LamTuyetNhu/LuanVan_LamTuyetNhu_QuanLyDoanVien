import axios from "../utils/axiosUser";

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

const searchChiDoanXepLoai = (formData) => {
  return axios.post("api/searchChiDoanXepLoai", formData);
};

const searchManyInfo = (formData) => {
  console.log(formData);
  return axios.post("api/searchManyChiDoan", formData);
};

const searchManyInfoHD = (formData) => {
  console.log(formData);
  return axios.post("api/searchManyHoatDong", formData);
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

const searchDGDoanVien = (formData) => {
  return axios.post("api/searchDGDoanVien", formData);
};

const searchManyDoanVien = (formData) => {
  console.log(formData);
  return axios.post("api/searchManyDoanVien", formData);
};

const CapNhatDoanVien = (formData) => {
  return axios.post("api/CapNhatDoanVien", formData);
};

const laydshoatdong = (page, idnamhoc, IDTruong) => {
  return axios.get(`api/layDSHoatDong/${page}/${idnamhoc}/${IDTruong}`);
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

const LayDSDiemDanh = (IDHoatDong, IDNamHoc) => {
  return axios.get(`api/LayDSDiemDanh/${IDHoatDong}/${IDNamHoc}`);
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

const XoaDoanVien = (IDDoanVien) => {
  return axios.post(`api/XoaDoanVien/${IDDoanVien}`);
};

const XoaChiTietDoanVien = (IDChiTietNamHoc, IDDanhGia) => {
  return axios.post(`api/XoaChiTietDoanVien/${IDChiTietNamHoc}/${IDDanhGia}`);
};

const laydsBCH = (page, idnamhoc, khoa, IDTruong) => {
  return axios.get(`api/dsBCH/${page}/${idnamhoc}/${khoa}/${IDTruong}`);
};

const laydsBCHMotLop = (IDLop, idnamhoc) => {
  return axios.get(`api/dsachBCH/${IDLop}/${idnamhoc}`);
};

const searchBCH = (formData) => {
  return axios.post(`api/searchBCH`, formData);
};

const searchManyDoanVienBCH = (formData) => {
  console.log(formData);
  return axios.post("api/searchManyDoanVienBCH", formData);
};

const searchManyDoanPhiCuaDoanVien = (formData) => {
  console.log(formData);
  return axios.post("api/searchManyDoanPhiCuaDoanVien", formData);
};

const XoaBanChapHanh = (select) => {
  return axios.post(`api/XoaBanChapHanh/${select}`);
};

const themChiDoan = (IDTruong, formData) => {
  return axios.post(`api/ThemChiDoan/${IDTruong}`, formData);
};

const namhoc = () => {
  return axios.get(`api/namhoc`);
};

const namhoccuaxeploai = () => {
  return axios.get(`api/namhoccuaxeploai`);
};

const namhoccuachidoan = (IDLop) => {
  console.log(IDLop);
  return axios.get(`api/namhoccuamotchidoan/${IDLop}`);
};

const namhoccuakhoa = (Khoa) => {
  console.log(Khoa);
  return axios.get(`api/namhoccuakhoa/${Khoa}`);
};

const layTatCaDSDoanPhi = (IDTruong, idnamhoc) => {
  return axios.get(`api/dsdoanphi/${IDTruong}/${idnamhoc}`);
};

const searchNamHoc = (formData) => {
  return axios.post(`api/searchNamHoc`, formData);
};

const xoaMotDoanPhi = (IDDoanPhi) => {
  return axios.post(`api/XoaMotDoanPhi/${IDDoanPhi}`);
};

const themDoanPhi = (IDTruong, formData) => {
  return axios.post(`api/ThemDoanPhi/${IDTruong}`, formData);
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

const laytenlop = (IDLop) => {
  return axios.get(`api/laytenlop/${IDLop}`);
};

/* Chi Doan */
const layDSDoanPhiCuaLop = (IDLop, idnamhoc) => {
  return axios.get(`api/dsdoanphicualop/${IDLop}/${idnamhoc}`);
};

const LayDSNopDoanPhiCuaMotLop = (IDLop, IDDoanPhi, IDNamHoc) => {
  return axios.get(`api/LayDSNopDoanPhi/${IDLop}/${IDDoanPhi}/${IDNamHoc}`);
};

const SaveCheckboxStatesCuaMotLop = (IDDoanPhi, checkboxStates) => {
  return axios.post("api/SaveCheckboxStatesCuaMotLop", {
    IDDoanPhi,
    checkboxStates,
  });
};

const laydshoatdongcualop = (IDLop, idnamhoc) => {
  return axios.get(`api/layDSHoatDongCuaLop/${IDLop}/${idnamhoc}`);
};

const LayDSDiemDanhCuaLop = (IDLop, IDHoatDong, IDNamHoc) => {
  return axios.get(
    `api/LayDSDiemDanhCuaLop/${IDLop}/${IDHoatDong}/${IDNamHoc}`
  );
};

const SaveCheckboxStatesDiemDanhCuaLop = (IDHoatDong, checkboxStates) => {
  return axios.post("api/saveCheckboxStatesDiemDanhCuaLop", {
    IDHoatDong,
    checkboxStates,
  });
};

const laytendoanvien = (IDDoanVien) => {
  return axios.get(`api/laytendoanvien/${IDDoanVien}`);
};

const DVLayMotDoanVien = (IDDoanVien, IDNamHoc) => {
  return axios.get(`api/DVlaymotdoanvien/${IDDoanVien}/${IDNamHoc}`);
};

const layDSChucVuDoanVien = (IDDoanVien) => {
  return axios.get(`api/layDSChucVuDoanVien/${IDDoanVien}}`);
};

const layDSDanhGiaDoanVien = (IDDoanVien) => {
  return axios.get(`api/layDSDanhGiaDoanVien/${IDDoanVien}}`);
};

const laydshoatdongcuadoanvien = (IDDoanVien, idnamhoc) => {
  return axios.get(`api/laydshoatdongcuadoanvien/${IDDoanVien}/${idnamhoc}`);
};

const DanhSachUngTuyen = (IDNamHoc) => {
  return axios.get(`api/DanhSachUngTuyen/${IDNamHoc}`);
};

const DanhSachUngTuyenCT = (IDNamHoc, IDTruong, page) => {
  return axios.get(`api/DanhSachUngTuyenCT/${IDNamHoc}/${IDTruong}/${page}`);
};

const DanhSachUngTuyenCuaLop = (IDNamHoc, IDLop) => {
  return axios.get(`api/DanhSachUngTuyenCuaLop/${IDNamHoc}/${IDLop}`);
};

const DanhSachUngTuyenCuaDV = (IDDoanVien) => {
  return axios.get(`api/DanhSachUngTuyenCuaDV/${IDDoanVien}`);
};

const mauUngTuyen = () => {
  return axios.get(`api/MauUngTuyen`);
};

const CapNhatTrangThai = (IDUngTuyen, TTUngTuyen) => {
  console.log(IDUngTuyen);
  console.log(TTUngTuyen);
  return axios.post(`api/CapNhatUngTuyenCuaDV/${IDUngTuyen}/${TTUngTuyen}`);
};

const searchManySVNT = (formData) => {
  console.log(formData);
  return axios.post("api/searchManySVNT", formData);
};

const KetQuaCuaMotDoanVien = (IDDoanVien) => {
  return axios.get(`api/KetQuaCuaMotDoanVien/${IDDoanVien}`);
};

const laydsdoanphicuadoanvien = (IDDoanVien, idnamhoc) => {
  return axios.get(`api/laydsdoanphicuadoanvien/${IDDoanVien}/${idnamhoc}`);
};

const DSDanhGiaDoanVienCuaLop = (IDLop, page, idnamhoc) => {
  return axios.get(
    `api/DanhSachDanhGiaDoanVienCuaLop/${page}/${IDLop}/${idnamhoc}`
  );
};

const DanhGiaTungChiDoan = (IDLop, idnamhoc) => {
  return axios.get(`api/DanhGiaTungChiDoan/${IDLop}/${idnamhoc}`);
};

const DanhGiaChiDoan = (idnamhoc, khoa, IDTruong) => {
  return axios.get(`api/DanhGiaChiDoan/${idnamhoc}/${khoa}/${IDTruong}`);
};

const DoiMatKhauDoanVien = (IDDoanVien) => {
  return axios.get(`api/doimatkhaudoanvien/${IDDoanVien}`);
};

const LayDiemCuaMotDoanVien = (IDDoanVien, IDNamHoc) => {
  return axios.get(`api/LayDiemCuaMotDoanVien/${IDDoanVien}/${IDNamHoc}`);
};

const laytentruong = (IDTruong) => {
  return axios.get(`api/laytentruong/${IDTruong}`);
};

const CapNhatThongTin = (formData) => {
  return axios.post("api/CapNhatThongTinDoanTruong", formData);
};

const CapNhatThongTinLop = (formData) => {
  return axios.post("api/CapNhatThongTinLop", formData);
};

const layTieuChi = () => {
  return axios.get(`api/LayTieuChi`);
};

const layTieuChiChiDoan = () => {
  return axios.get(`api/LayTieuChiChiDoan`);
};

const layTieuChiDoanVien = () => {
  return axios.get(`api/LayTieuChiDoanVien`);
};

const laytentruongdh = (IDDHCT) => {
  return axios.get(`api/laytentruongdh/${IDDHCT}`);
};

const getAllTruong = (page) => {
  return axios.get(`api/dstruong/${page}`);
};

const laytatcatruong = () => {
  return axios.get(`api/laytatcatruong`);
};
const themtruong = (formData) => {
  return axios.post("api/ThemTruong", formData);
};

const searchManyTenTruong = (formData) => {
  console.log(formData);
  return axios.post("api/searchManyTenTruong", formData);
};

const XoaTruong = (selectedIDLop) => {
  return axios.post(`api/XoaTruong/${selectedIDLop}`);
};

const laymottruong = (IDTruong) => {
  return axios.get(`api/LayMotTruong/${IDTruong}`);
};

const CapNhatTruong = (IDTruong, formData) => {
  return axios.post(`api/CapNhatTruong/${IDTruong}`, formData);
};

const getAllChiDoanCT = (IDTruong, page, khoa) => {
  return axios.get(`api/dschidoan/${IDTruong}/${page}/${khoa}`, {});
};

const themChiDoanCT = (IDTruong, formData) => {
  return axios.post(`api/ThemChiDoan/${IDTruong}`, formData);
};

const laydsBCHTruong = (page, idnamhoc, IDTruong) => {
  return axios.get(`api/BCHTruong/${page}/${idnamhoc}/${IDTruong}`);
};

const namhoccuabch = () => {
  return axios.get(`api/namhoccuabch`);
};

const laytenBCH = (IDBCH) => {
  return axios.get(`api/laytenBCH/${IDBCH}`);
};

const layDSChucVuBCH = (IDBCH) => {
  return axios.get(`api/layDSChucVuBCH/${IDBCH}}`);
};

const searchBCHTruong = (formData) => {
  return axios.post(`api/searchBCHTruong`, formData);
};

const searchManyBCH = (formData) => {
  return axios.post("api/searchManyBCH", formData);
};

const XoaBCHTruong = (IDBCH) => {
  return axios.post(`api/XoaBCHTruong/${IDBCH}`);
};

const XoaChiTietBCHTruong = (IDChiTietBCH) => {
  return axios.post(`api/XoaChiTietBCHTruong/${IDChiTietBCH}`);
};

const CapNhatThongTinDHCT = (formData) => {
  return axios.post("api/CapNhatThongTinDHCT", formData);
};

const laytenBCHTruong = (IDBCH, IDTruong) => {
  return axios.get(`api/laytenBCHTruong/${IDBCH}/${IDTruong}`);
};

export {
  laytenBCHTruong,
  CapNhatThongTinDHCT,
  XoaChiTietDoanVien,
  XoaChiTietBCHTruong,
  XoaBCHTruong,
  searchManyBCH,
  searchBCHTruong,
  layDSChucVuBCH,
  laytenBCH,
  namhoccuabch,
  laydsBCHTruong,
  DanhSachUngTuyenCT,
  laytatcatruong,
  themChiDoanCT,
  getAllTruong,
  themtruong,
  searchManyTenTruong,
  XoaTruong,
  getAllChiDoanCT,
  searchChiDoan,
  searchChiDoanXepLoai,
  searchManyInfo,
  searchManyInfoHD,
  laymotchidoan,
  CapNhatChiDoan,
  getKhoa,
  laymotlop,
  chucvu,
  searchDoanVien,
  searchDGDoanVien,
  searchManyDoanVien,
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
  laydsBCH,
  laydsBCHMotLop,
  searchBCH,
  searchManyDoanVienBCH,
  XoaBanChapHanh,
  themChiDoan,
  XoaChiDoan,
  namhoc,
  namhoccuachidoan,
  namhoccuakhoa,
  namhoccuaxeploai,
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
  laytenlop,
  layDSDoanPhiCuaLop,
  LayDSNopDoanPhiCuaMotLop,
  SaveCheckboxStatesCuaMotLop,
  laydshoatdongcualop,
  LayDSDiemDanhCuaLop,
  SaveCheckboxStatesDiemDanhCuaLop,
  laytendoanvien,
  DVLayMotDoanVien,
  laydshoatdongcuadoanvien,
  DanhSachUngTuyen,
  DanhSachUngTuyenCuaLop,
  DanhSachUngTuyenCuaDV,
  mauUngTuyen,
  CapNhatTrangThai,
  searchManySVNT,
  KetQuaCuaMotDoanVien,
  laydsdoanphicuadoanvien,
  DoiMatKhauDoanVien,
  layDSChucVuDoanVien,
  layDSDanhGiaDoanVien,
  DSDanhGiaDoanVienCuaLop,
  LayDiemCuaMotDoanVien,
  DanhGiaChiDoan,
  laytentruong,
  CapNhatThongTin,
  CapNhatThongTinLop,
  searchManyDoanPhiCuaDoanVien,
  DanhGiaTungChiDoan,
  layTieuChi,
  layTieuChiChiDoan,
  layTieuChiDoanVien,
  laytentruongdh,
  laymottruong,
  CapNhatTruong,
};
