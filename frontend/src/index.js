import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import BCH from "./BCH"
import DVDoanVien from "./DoanVien";

import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DanhSachChiDoan from "./components/DoanTruong/DSChiDoan/DanhSachChiDoan";
import CapNhatChiDoan from "./components/DoanTruong/DSChiDoan/CapNhatChiDoan";
import ThemMoiChiDoan from "./components/DoanTruong/DSChiDoan/ThemChiDoan"

import DanhSachBCH from "./components/DoanTruong//DSBCH/DanhSachBCH";
import BanChapHanh from "./components/DoanTruong/DSBCH/BCH";

import DoanPhi from "./components/DoanTruong/DoanPhi/DoanPhi";
import ThemMoiDoanPhi from "./components/DoanTruong/DoanPhi/ThemDoanPhi";
import CapNhatDoanPhi from "./components/DoanTruong/DoanPhi/CapNhapDoanPhi";
import DSNopDoanPhi from "./components/DoanTruong/DoanPhi/DSNopDoanPhi"

import DangNhap from "./components/DangNhap/DangNhap";

import DanhSachDoanVien from "./components/DoanTruong/DSDoanVien/DanhSachDoanVien";
import DoanVien from "./components/DoanTruong/DSDoanVien/DoanVien";
import ThemMoiDoanVien from "./components/DoanTruong/DSDoanVien/ThemMoiDoanVien";

import DanhSachHoatDong from "./components/DoanTruong/HoatDong/DanhSachHD";
import ThemMoiHoatDong from "./components/DoanTruong/HoatDong/ThemMoiHD";
import ChiTietHoatDong from "./components/DoanTruong/HoatDong/ChiTietHoatDong";
import DiemDanhChiDoan from "./components/DoanTruong/HoatDong/DSDiemDanh"

import SinhVienNamTot from "./components/DoanTruong/SinhVienNamTot/DanhSachDoanVien"

/* Chi đoàn */
import CDDanhSachDoanVien from "./components/ChiDoan/DSDoanVien/CD-DanhSachDoanVien"
import CDDoanVien from "./components/ChiDoan/DSDoanVien/CD-DoanVien"
import CDThemMoiDoanVien from "./components/ChiDoan/DSDoanVien/CD-ThemMoiDoanVien"
import CDDanhSachBCH from "./components/ChiDoan/DSBCH/CD-DanhSachBCH"
import CDBanChapHanh from "./components/ChiDoan/DSBCH/CD-BCH"

import CDSinhVienNamTot from "./components/ChiDoan/SinhVienNamTot/CD-SinhVienNamTot"

import CDDoanPhi from "./components/ChiDoan/DoanPhi/CD-DoanPhi"
import CDDSNopDoanPhi from "./components/ChiDoan/DoanPhi/CD-DSNopDoanPhi"

import CDHoatDong from "./components/ChiDoan/HoatDong/CD-DanhSachHD"
import CDDSDiemDanhHD from "./components/ChiDoan/HoatDong/CD-DSDiemDanh"
import CDChiTietHoatDong from "./components/ChiDoan/HoatDong/CD-ChiTietHoatDong";

/* Doàn viên */
import DVDoanVienTrangChu from "./components/DoanVien/DV-DoanVienTrangChu"
import DVThongTinCaNhan from "./components/DoanVien/DV-DoanVien"
import DVHoatDong from "./components/DoanVien/DV-DanhSachHD"
import DVSinhVienNamTot from "./components/DoanVien/DV-SinhVienNamTot"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <Routes>
        <Route index element={<DangNhap />} />

        <Route path="/BCH-DoanTruong" element={<App />}>
          <Route index element={<DanhSachChiDoan />} />
          <Route path="ThemMoi-ChiDoan" element={<ThemMoiChiDoan />} />

          <Route path="ChiTiet/:IDLop" element={<CapNhatChiDoan />} />
          <Route path="ChiTietChiDoan/:IDLop" element={<DanhSachDoanVien />} />
          <Route path="ThemMoi-DoanVien/:IDLop" element={<ThemMoiDoanVien />} />

          <Route path="ChiTietChiDoan/:IDLop/:IDDoanVien/:IDChiTietNamHoc" element={<DoanVien />} />

          <Route path="DanhSachBCH" element={<DanhSachBCH />} />
          <Route path="DanhSachBCH/:IDLop/:IDDoanVien/:IDChiTietNamHoc" element={<BanChapHanh />} />

          <Route path="DoanPhi" element={<DoanPhi />} />
          <Route path="ThemMoi-DoanPhi" element={<ThemMoiDoanPhi />} />
          <Route path="DoanPhi/ChiTiet/:IDDoanPhi" element={<CapNhatDoanPhi />} />
          <Route path="DoanPhi/ChiTietDoanPhi/:IDDoanPhi/:IDNamHoc" element={<DSNopDoanPhi />} />

          <Route path="HoatDong" element={<DanhSachHoatDong />} />
          <Route path="ThemMoi" element={<ThemMoiHoatDong />} />
          <Route path="ChiTietHoatDong/:IDHoatDong" element={<ChiTietHoatDong />} />
          <Route path="ChiTietHoatDong/DiemDanhChiDoan/:IDHoatDong/:IDNamHoc" element={<DiemDanhChiDoan />} />

          <Route path="SinhVienNamTot" element={<SinhVienNamTot />} />
          
        </Route>

        <Route path="/ChiDoan/:IDLop" element={<BCH />}>
          <Route index element={<CDDanhSachDoanVien />} />
          <Route path=":IDDoanVien/:IDChiTietNamHoc" element={<CDDoanVien />} />
          <Route path="ThemMoi-DoanVien" element={<CDThemMoiDoanVien />} />
          <Route path="DanhSachBCH" element={<CDDanhSachBCH />} />
          <Route path="DanhSachBCH/:IDDoanVien/:IDChiTietNamHoc" element={<CDBanChapHanh />} />

          <Route path="DoanPhi" element={<CDDoanPhi />} />
          <Route path="ChiTietDoanPhi/:IDDoanPhi/:IDNamHoc" element={<CDDSNopDoanPhi />} />

          <Route path="HoatDong" element={<CDHoatDong />} />
          <Route path="ChiTietDiemDanh/:IDHoatDong/:IDNamHoc" element={<CDDSDiemDanhHD />} />
          <Route path="ChiTietHoatDong/:IDHoatDong" element={<CDChiTietHoatDong />} />

          <Route path="DanhSachSinhVienNamTot" element={<CDSinhVienNamTot />} />

          

        </Route>

        <Route path="/DoanVien" element={<DVDoanVien />}>
          <Route index element={<DVDoanVienTrangChu />} />
          <Route path="ThongTinCaNhan" element={<DVThongTinCaNhan />} />
          <Route path="HoatDong" element={<DVHoatDong />} />
          <Route path="SinhVienNamTot" element={<DVSinhVienNamTot />} />
        </Route>
      </Routes>
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </Provider>
);

reportWebVitals();

