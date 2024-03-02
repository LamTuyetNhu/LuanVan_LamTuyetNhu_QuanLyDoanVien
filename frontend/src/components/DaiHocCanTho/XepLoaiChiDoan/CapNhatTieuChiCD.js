import React, { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { faEdit, faBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalSuccess from "../../Modal/ModalSuccess";
import { layTieuChiChiDoan } from "../../../services/apiService";

function uploadAdapter(loader) {
  return loader.file.then((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (event) {
        resolve({ default: event.target.result });
      };

      reader.onerror = function (error) {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  });
}

function ThongTinDiemThi() {
  const [editorData, setEditorData] = useState("");
  const editorInstance = useRef(null);
  const navigate = useNavigate();
  const IDDGCD = localStorage.getItem("IDDGCD");
  const [showModal, setShowModal] = useState(false);
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    // Thêm logic kiểm tra hạn của token nếu cần
    return true;
  };
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/"); // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let res = await layTieuChiChiDoan();
      const ND = res.data.dataTC[0].NoiDungChiDoan;
      console.log(ND);
      setEditorData(ND);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu: ", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const update = await axios.post(
        `http://localhost:8080/api/LayMotTieuChiDGCD/${IDDGCD}`,
        {
          NoiDungChiDoan: editorData,
        }
      );

      // Hiển thị thông báo thành công
      if (update.status === 200) {
        setShowModal(true);
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu: ", error);
    }
  };

  return (
    <>
      <div className="tableCK">
        <CKEditor
          editor={ClassicEditor}
          onReady={(editor) => {
            editorInstance.current = editor;
            uploadPlugin(editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log("Editor Data:", data);
            setEditorData(data);
          }}
          data={editorData}
        />
        {/* <div className="margin-bottom"></div> */}
        <br />
        <div className="update row">
          <div className="btns">
            <button className="allcus-button" type="submit">
              <NavLink to={`/DaiHocCanTho/TieuChiDanhGiaChiDoan`} className="navlink">
                <FontAwesomeIcon icon={faBackward} />
              </NavLink>
            </button>
            <button className="allcus-button" onClick={handleUpdate}>
              <FontAwesomeIcon icon={faEdit} /> Lưu
            </button>
          </div>
        </div>
      </div>

      <br />

      <ModalSuccess show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
}

function uploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}

export default ThongTinDiemThi;
