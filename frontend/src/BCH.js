import "./App.scss";
import BCH from "./components/Header/BCH";
import { Outlet, Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="app-container">
      <div className="header-container">
        <BCH />
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
