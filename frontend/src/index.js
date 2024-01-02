import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DanhSachChiDoan from "./components/DoanTruong/DSChiDoan/DanhSachChiDoan";
import DanhSachBCH from "./components/DoanTruong//DSBCH/DanhSachBCH";
import DoanPhi from "./components/DoanTruong/DoanPhi/DoanPhi";
import DangNhap from "./components/DangNhap/DangNhap";
import DanhSachDoanVien from "./components/DSDoanVien/DanhSachDoanVien";
import DoanVien from "./components/DSDoanVien/DoanVien";
import ThemMoiChiDoan from "./components/DoanTruong/DSChiDoan/ThemChiDoan"
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

          <Route path="ChiTietChiDoan/:IDLop" element={<DanhSachDoanVien />} />
          <Route path="ChiTietChiDoan/:IDLop/:IDDoanVien" element={<DoanVien />} />

          <Route path="DanhSachBCH" element={<DanhSachBCH />} />
          <Route path="DoanPhi" element={<DoanPhi />} />
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

