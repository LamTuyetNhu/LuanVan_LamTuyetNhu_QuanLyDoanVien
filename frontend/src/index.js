import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
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

import DanhSachDoanVien from "./components/DSDoanVien/DanhSachDoanVien";
import DoanVien from "./components/DSDoanVien/DoanVien";
import ThemMoiDoanVien from "./components/DSDoanVien/ThemMoiDoanVien";

import DanhSachHoatDong from "./components/DoanTruong/HoatDong/DanhSachHD";
import ThemMoiHoatDong from "./components/DoanTruong/HoatDong/ThemMoiHD";
import ChiTietHoatDong from "./components/DoanTruong/HoatDong/ChiTietHoatDong";

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
          <Route path="DoanPhi/ChiTietDoanPhi/:IDDoanPhi" element={<DSNopDoanPhi />} />

          <Route path="HoatDong" element={<DanhSachHoatDong />} />
          <Route path="ChiTietHoatDong/:IDHoatDong" element={<ChiTietHoatDong />} />
          <Route path="ThemMoi" element={<ThemMoiHoatDong />} />
        </Route>
      </Routes>
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </Provider>
);

reportWebVitals();

