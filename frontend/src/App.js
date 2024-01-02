import "./App.scss";
import Header from "./components/Header/Header";
import { Outlet, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="app-container">
      <div className="header-container">
        <Header />
      </div>
      <div className="main-container">
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
