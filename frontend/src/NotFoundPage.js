import "./App.scss";
import "./reponsive.css"
import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import notfound from "./assets/notfound.webp"
const DHCT = () => {
  return (
    <div className="app-container notfound">
      <img className="notfound" src={notfound} />
    </div>
  );
};

export default DHCT;
