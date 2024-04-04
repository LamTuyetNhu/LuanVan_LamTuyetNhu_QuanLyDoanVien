import React from "react";
import ReactDOM from "react-dom/client";
import DHCT from "./DHCT";
import App from "./App";
import BCH from "./BCH";
import DVDoanVien from "./DoanVien";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
/* Toan truong */
import DanhSachTruong from "./components/DaiHocCanTho/DSTruong/DanhSachTruong";
import TruongThongTinCaNhan from "./components/DaiHocCanTho/Info/DoiThongTinCaNhan";
import TruongDoiMatKhau from "./components/DaiHocCanTho/Info/DoiMatKhau";
import ThemMoiTruong from "./components/DaiHocCanTho/DSTruong/ThemTruong";
import CapNhatTruongKhoa from "./components/DaiHocCanTho/DSTruong/CapNhatTruongKhoa";
import CTDSChiDoan from "./components/DaiHocCanTho/DSChiDoan/DanhSachChiDoan";
import CTDanhSachChiDoan from "./components/DaiHocCanTho/DSChiDoan/DanhSachChiDoan";
import CTCapNhatChiDoan from "./components/DaiHocCanTho/DSChiDoan/CapNhatChiDoan";
import CTThemMoiChiDoan from "./components/DaiHocCanTho/DSChiDoan/ThemChiDoan";

import CTDanhSachBCH from "./components/DaiHocCanTho//DSBCH/DanhSachBCH";
import CTBanChapHanh from "./components/DaiHocCanTho/DSBCH/BCH";
import ThemMoiBCH from "./components/DaiHocCanTho/DSBCH/ThemBCH";

import CTDoanPhi from "./components/DaiHocCanTho/DoanPhi/CT-DoanPhi";
import CTDSNopDoanPhi from "./components/DaiHocCanTho/DoanPhi/DSNopDoanPhi";

import CTDanhSachDoanVien from "./components/DaiHocCanTho/DSDoanVien/DanhSachDoanVien";
import CTDoanVien from "./components/DaiHocCanTho/DSDoanVien/DoanVien";
import CTThemMoiDoanVien from "./components/DaiHocCanTho/DSDoanVien/ThemMoiDoanVien";

import CTDanhSachHoatDong from "./components/DaiHocCanTho/HoatDong/DanhSachHD";
import CTChiTietHoatDong from "./components/DaiHocCanTho/HoatDong/ChiTietHoatDong";
import CTDiemDanhNDGM from "./components/DaiHocCanTho/HoatDong/DiemDanhNDGM";
import CTDiemDanhBCHTruong from "./components/DaiHocCanTho/HoatDong/DSDiemDanhDV"
import CTThemMoiHoatDong from "./components/DaiHocCanTho/HoatDong/ThemMoiHD"

import CTSinhVienNamTot from "./components/DaiHocCanTho/SinhVienNamTot/DSUTCuaTruong";
import CTTieuChi from "./components/DaiHocCanTho/SinhVienNamTot/TieuChi";
import CTCapNhatTieuChi from "./components/DaiHocCanTho/SinhVienNamTot/CapNhatTieuChi";

import CTDanhGiaChiDoan from "./components/DaiHocCanTho/XepLoaiChiDoan/DanhGiaChiDoan";
import CTTieuChiDanhGiaChiDoan from "./components/DaiHocCanTho/XepLoaiChiDoan/TieuChiDanhGia";
import CTCapNhatTieuChiDanhGiaChiDoan from "./components/DaiHocCanTho/XepLoaiChiDoan/CapNhatTieuChiCD";
import CTChiTietDanhGia from "./components/DaiHocCanTho/XepLoaiChiDoan/ChiTietDanhGia";
import CTCapNhatTieuChiDanhGiaDoanVien from "./components/DaiHocCanTho/XepLoaiChiDoan/CapNhatTieuChiDV";

import CTThemMoiNamHoc from "./components/DaiHocCanTho/Info/ThemNamHoc"
/* Mot truowng / khoa */
import DanhSachChiDoan from "./components/DoanTruong/DSChiDoan/DanhSachChiDoan";
import CapNhatChiDoan from "./components/DoanTruong/DSChiDoan/CapNhatChiDoan";
import ThemMoiChiDoan from "./components/DoanTruong/DSChiDoan/ThemChiDoan";
import DanhSachBCH from "./components/DoanTruong//DSBCH/DanhSachBCH";
import BanChapHanh from "./components/DoanTruong/DSBCH/BCH";
import DoanPhi from "./components/DoanTruong/DoanPhi/DoanPhi";
import ThemMoiDoanPhi from "./components/DoanTruong/DoanPhi/ThemDoanPhi";
import CapNhatDoanPhi from "./components/DoanTruong/DoanPhi/CapNhapDoanPhi";
import DSNopDoanPhi from "./components/DoanTruong/DoanPhi/DSNopDoanPhi";
import DangNhap from "./components/DangNhap/DangNhap";
import DanhSachDoanVien from "./components/DoanTruong/DSDoanVien/DanhSachDoanVien";
import DoanVien from "./components/DoanTruong/DSDoanVien/DoanVien";
import ThemMoiDoanVien from "./components/DoanTruong/DSDoanVien/ThemMoiDoanVien";
import DanhSachHoatDong from "./components/DoanTruong/HoatDong/DanhSachHD";
import ThemMoiHoatDong from "./components/DoanTruong/HoatDong/ThemMoiHD";
import ChiTietHoatDong from "./components/DaiHocCanTho/HoatDong/ChiTietHoatDong";
import DiemDanhChiDoan from "./components/DoanTruong/HoatDong/DSDiemDanh";
import DiemDanhDoanVienChiDoan from "./components/DoanTruong/HoatDong/DSDiemDanhCD";
import SinhVienNamTot from "./components/DoanTruong/SinhVienNamTot/DanhSachDoanVien";
import TieuChi from "./components/DoanTruong/SinhVienNamTot/TieuChi";
import CapNhatTieuChi from "./components/DoanTruong/SinhVienNamTot/CapNhatTieuChi";
import DanhGiaChiDoan from "./components/DoanTruong/XepLoaiChiDoan/DanhGiaChiDoan";
import TieuChiDanhGiaChiDoan from "./components/DoanTruong/XepLoaiChiDoan/TieuChiDanhGia";
import CapNhatTieuChiDanhGiaChiDoan from "./components/DoanTruong/XepLoaiChiDoan/CapNhatTieuChiCD";
import ChiTietDanhGia from "./components/DoanTruong/XepLoaiChiDoan/ChiTietDanhGia";
import CapNhatDiemDoanVien from "./components/DoanTruong/XepLoaiChiDoan/DanhGiaDoanVien";
import CapNhatTieuChiDanhGiaDoanVien from "./components/DoanTruong/XepLoaiChiDoan/CapNhatTieuChiDV";
import ThongTinCaNhan from "./components/DoanTruong/Info/DoiThongTinCaNhan";
import DoiMatKhau from "./components/DoanTruong/Info/DoiMatKhau";
import TruongDSBCH from "./components/DoanTruong/DSBCHTruong/DanhSachBCH"
import TruongBCH from "./components/DoanTruong/DSBCHTruong/BCH"
import TruongAnhDiemDanhBCH from "./components/DoanTruong/DSBCHTruong/AnhDiemDanh"
import TruongThemBCH from "./components/DoanTruong/DSBCHTruong/ThemBCH"
import ThongTinCuaBan from "./components/DoanTruong/Info/BCH"
import DoiMatKhauCuaBan from "./components/DoanTruong/Info/DoiMatKhauBCH"

/* Chi đoàn */
import CDDanhSachDoanVien from "./components/ChiDoan/DSDoanVien/CD-DanhSachDoanVien";
import CDDoanVien from "./components/ChiDoan/DSDoanVien/CD-DoanVien";
import CDThemMoiDoanVien from "./components/ChiDoan/DSDoanVien/CD-ThemMoiDoanVien";
import CDDanhSachBCH from "./components/ChiDoan/DSBCH/CD-DanhSachBCH";
import CDBanChapHanh from "./components/ChiDoan/DSBCH/CD-BCH";
import CDSinhVienNamTot from "./components/ChiDoan/SinhVienNamTot/CD-SinhVienNamTot";
import CDTieuChi from "./components/ChiDoan/SinhVienNamTot/CD-TieuChi";
import CDDoanPhi from "./components/ChiDoan/DoanPhi/CD-DoanPhi";
import CDDSNopDoanPhi from "./components/ChiDoan/DoanPhi/CD-DSNopDoanPhi";
import CDHoatDong from "./components/ChiDoan/HoatDong/CD-DanhSachHD";
import CDDSDiemDanhHD from "./components/ChiDoan/HoatDong/CD-DSDiemDanh";
import CDChiTietHoatDong from "./components/ChiDoan/HoatDong/CD-ChiTietHoatDong";
import CDDanhGiaDoanVien from "./components/ChiDoan/XepLoaiChiDoan/CD-DanhGiaDoanVien";
import CDCNDanhGiaDoanVien from "./components/ChiDoan/XepLoaiChiDoan/CD-CapNhatDanhGiaDoanVien";
import ThongTinCaNhanLop from "./components/ChiDoan/Info/DoiThongTinCaNhan";
import DoiMatKhauLop from "./components/ChiDoan/Info/DoiMatKhau";
import TieuChiDanhGiaCD from "./components/ChiDoan/XepLoaiChiDoan/CD-TieuChiDanhGia";
import CDDiemDanhGuongMat from "./components/ChiDoan/HoatDong/CD-DiemDanhNDGM"

/* Doàn viên */
import DVDoanVienTrangChu from "./components/DoanVien/DV-DoanVienTrangChu";
import DVThongTinCaNhan from "./components/DoanVien/DV-DoanVien";
import DVHoatDong from "./components/DoanVien/DV-DanhSachHD";
import DVSinhVienNamTot from "./components/DoanVien/DV-SinhVienNamTot";
import DVDanhGiaDoanVien from "./components/DoanVien/DV-DanhGiaDoanVien";
import DVDoanPhi from "./components/DoanVien/DV-DanhSachDP";
import DVDoiMatKhau from "./components/DoanVien/DV-DoiMatKhau";
import DVCapNhatDiem from "./components/DoanVien/DV-XemDiem";
import DVAnhDiemDanh from "./components/DoanVien/AnhDiemDanh"
/* Not Found */
import NotFoundPage from "./NotFoundPage"
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <Routes>
        <Route index element={<DangNhap />} />

        <Route path="/DaiHocCanTho" element={<DHCT />}>
          <Route index element={<DanhSachTruong />} />
          <Route path="DoiMatKhau" element={<TruongDoiMatKhau />} />
          <Route path="ThongTinCaNhan" element={<TruongThongTinCaNhan />} />
          <Route path="ThemMoiTruong/Khoa" element={<ThemMoiTruong />} />
          <Route path="CapNhatTruongKhoa" element={<CapNhatTruongKhoa />} />
          <Route path="DoanTruong" element={<CTDSChiDoan />} />
          <Route path="ThemMoiNamHoc" element={<CTThemMoiNamHoc />} />

          <Route path="ThemMoi-ChiDoan" element={<CTThemMoiChiDoan />} />
          <Route path="ChiTiet" element={<CTCapNhatChiDoan />} />
          <Route path="ChiTietChiDoan" element={<CTDanhSachDoanVien />} />
          <Route path="ChiTietChiDoan/DoanVien" element={<CTDoanVien />} />
          <Route
            path="ThemMoiDoanVien/:IDLop"
            element={<CTThemMoiDoanVien />}
          />

          <Route path="DanhSachBCHTruong" element={<CTDanhSachBCH />} />
          <Route
            path="DanhSachBCHTruong/BanChapHanh"
            element={<CTBanChapHanh />}
          />

          <Route path="ThemMoiBanChapHanh" element={<ThemMoiBCH />} />

          <Route path="DoanPhi" element={<CTDoanPhi />} />
          <Route
            path="DoanPhi/ChiTietDoanPhi/:IDDoanPhi/:IDNamHoc"
            element={<CTDSNopDoanPhi />}
          />
          <Route path="HoatDong" element={<CTDanhSachHoatDong />} />
          <Route
            path="ChiTietHoatDong/:IDHoatDongDHCT"
            element={<CTChiTietHoatDong />}
          />
          <Route
            path="ChiTietHoatDong/DiemDanhBCHTruong/:IDHoatDongDHCT/:IDNamHoc"
            element={<CTDiemDanhBCHTruong />}
          />
          <Route path="DiemDanhGuongMat/:IDHoatDongDHCT/:IDNamHoc" element={<CTDiemDanhNDGM />} />
          <Route path="ThemMoiHoatDong" element={<CTThemMoiHoatDong />} />

          <Route path="SinhVienNamTot" element={<CTSinhVienNamTot />} />
          <Route path="TieuChi" element={<CTTieuChi />} />
          <Route path="CapNhatTieuChi" element={<CTCapNhatTieuChi />} />

          <Route path="DanhGiaTruong" element={<CTDanhGiaChiDoan />} />
          <Route
            path="TieuChiDanhGiaChiDoan"
            element={<CTTieuChiDanhGiaChiDoan />}
          />
          <Route
            path="CapNhatTieuChiDanhGiaChiDoan"
            element={<CTCapNhatTieuChiDanhGiaChiDoan />}
          />
          <Route
            path="CapNhatTieuChiDanhGiaDoanVien"
            element={<CTCapNhatTieuChiDanhGiaDoanVien />}
          />
          <Route
            path="DanhGiaChiDoan/ChiTietDanhGia"
            element={<CTChiTietDanhGia />}
          />
        </Route>

        <Route path="/BCH-DoanTruong" element={<App />}>
          <Route index element={<DanhSachChiDoan />} />
          <Route path="ThemMoi-ChiDoan" element={<ThemMoiChiDoan />} />

          <Route path="ChiTiet" element={<CapNhatChiDoan />} />
          <Route path="ChiTietChiDoan" element={<DanhSachDoanVien />} />
          <Route path="ChiTietChiDoan/DoanVien" element={<DoanVien />} />
          <Route path="ThemMoiDoanVien/:IDLop" element={<ThemMoiDoanVien />} />

          <Route path="DanhSachBCH" element={<DanhSachBCH />} />
          <Route path="DanhSachBCH/DoanVien" element={<BanChapHanh />} />

          <Route path="DoanPhi" element={<DoanPhi />} />
          <Route path="ThemMoi-DoanPhi" element={<ThemMoiDoanPhi />} />
          <Route
            path="DoanPhi/ChiTiet/:IDDoanPhi"
            element={<CapNhatDoanPhi />}
          />
          <Route
            path="DoanPhi/ChiTietDoanPhi/:IDDoanPhi/:IDNamHoc"
            element={<DSNopDoanPhi />}
          />

          <Route path="HoatDong" element={<DanhSachHoatDong />} />
          <Route path="ThemMoi" element={<ThemMoiHoatDong />} />
          <Route
            path="ChiTietHoatDong/:IDHoatDong"
            element={<ChiTietHoatDong />}
          />
          <Route
            path="ChiTietHoatDong/DiemDanhChiDoan/:IDHoatDong/:IDNamHoc"
            element={<DiemDanhChiDoan />}
          />
          <Route
            path="ChiTietHoatDong/DiemDanhChiDoan/:IDHoatDong/:IDNamHoc/DanhSachDiemDanhCuaChiDoan"
            element={<DiemDanhDoanVienChiDoan />}
          />
          <Route path="SinhVienNamTot" element={<SinhVienNamTot />} />
          <Route path="TieuChi" element={<TieuChi />} />
          <Route path="CapNhatTieuChi" element={<CapNhatTieuChi />} />

          <Route path="DanhGiaChiDoan" element={<DanhGiaChiDoan />} />
          <Route
            path="TieuChiDanhGiaChiDoan"
            element={<TieuChiDanhGiaChiDoan />}
          />
          <Route
            path="CapNhatTieuChiDanhGiaChiDoan"
            element={<CapNhatTieuChiDanhGiaChiDoan />}
          />
          <Route
            path="CapNhatTieuChiDanhGiaDoanVien"
            element={<CapNhatTieuChiDanhGiaDoanVien />}
          />

          <Route
            path="DanhGiaChiDoan/ChiTietDanhGia"
            element={<ChiTietDanhGia />}
          />
          <Route
            path="DanhGiaChiDoan/ChiTietDanhGia/DoanVien"
            element={<CapNhatDiemDoanVien />}
          />
          <Route path="DoiMatKhau" element={<DoiMatKhau />} />
          <Route path="ThongTinCaNhan" element={<ThongTinCaNhan />} />

          <Route path="ThongTinCuaBan" element={<ThongTinCuaBan />} />
          <Route path="DoiMatKhauCuaBan" element={<DoiMatKhauCuaBan />} />

          <Route path="DanhSachBCHTruong" element={<TruongDSBCH />} />
          <Route path="DanhSachBCHTruong/BCHTruong" element={<TruongBCH />} />
          <Route path="DanhSachBCHTruong/BCHTruong/AnhDiemDanh" element={<TruongAnhDiemDanhBCH />} />

          <Route path="ThemBCH" element={<TruongThemBCH />} />
        </Route>

        <Route path="/ChiDoan" element={<BCH />}>
          <Route index element={<CDDanhSachDoanVien />} />
          <Route path="ChiTietBanChapHanh" element={<CDBanChapHanh />} />

          <Route path=":IDDoanVien/:IDChiTietNamHoc" element={<CDDoanVien />} />
          <Route path="ThemMoi-DoanVien" element={<CDThemMoiDoanVien />} />
          <Route path="DanhSachBCH" element={<CDDanhSachBCH />} />

          <Route path="DoanPhi" element={<CDDoanPhi />} />
          <Route
            path="ChiTietDoanPhi/:IDDoanPhi/:IDNamHoc"
            element={<CDDSNopDoanPhi />}
          />

          <Route path="HoatDong" element={<CDHoatDong />} />
          <Route
            path="ChiTietDiemDanh/:IDHoatDong/:IDNamHoc"
            element={<CDDSDiemDanhHD />}
          />
          <Route
            path="ChiTietHoatDong/:IDHoatDong"
            element={<CDChiTietHoatDong />}
          />

          <Route path="DanhSachSinhVienNamTot" element={<CDSinhVienNamTot />} />
          <Route path="TieuChi" element={<CDTieuChi />} />

          <Route path="DanhGiaDoanVien" element={<CDDanhGiaDoanVien />} />
          <Route
            path="ChiTietDanhGia/DoanVien"
            element={<CDCNDanhGiaDoanVien />}
          />

          <Route path="DoiMatKhau" element={<DoiMatKhauLop />} />
          <Route path="ThongTinCaNhan" element={<ThongTinCaNhanLop />} />
          <Route path="TieuChiDanhGia" element={<TieuChiDanhGiaCD />} />
          <Route path="DiemDanhGuongMat/:IDHoatDong" element={<CDDiemDanhGuongMat />} />

        </Route>

        <Route path="/DoanVien" element={<DVDoanVien />}>
          <Route index element={<DVDoanVienTrangChu />} />
          <Route path="ThongTinCaNhan" element={<DVThongTinCaNhan />} />
          <Route path="HoatDong" element={<DVHoatDong />} />
          <Route path="DoanPhi" element={<DVDoanPhi />} />
          <Route path="SinhVienNamTot" element={<DVSinhVienNamTot />} />
          <Route path="DanhGiaDoanVien" element={<DVDanhGiaDoanVien />} />
          <Route path="DoiMatKhau" element={<DVDoiMatKhau />} />
          <Route path="CapNhatDiem" element={<DVCapNhatDiem />} />
          <Route path="AnhDiemDanh" element={<DVAnhDiemDanh />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
