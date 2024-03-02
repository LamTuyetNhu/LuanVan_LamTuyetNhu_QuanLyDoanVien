import "./App.scss";
import "./reponsive.css"
import Truong from "./components/Header/Truong";
import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
const DHCT = () => {
  return (
    <div className="app-container">
      <div className="header-container">
        <Truong />
      </div>
      <div className="main-container">
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DHCT;
