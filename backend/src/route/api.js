import express from "express";
import APIController from "../controller/APIController";
let router = express.Router();
const multer = require('multer');

const initAPIRoute = (app) => {
  /* Trường */
  router.get("/dschidoan/:page", APIController.getAllChiDoan)
  router.get("/dskhoa", APIController.getKhoa)
  router.post("/searchChiDoan", APIController.getSearchChiDoan)
  router.post("/ThemChiDoan", APIController.ThemChiDoan)
  router.get("/detailChiDoan/:IDLop/:page", APIController.getDetailChiDoan)

  
  router.get("/getChucVu", APIController.getChucVu)
  router.post("/searchDoanVien", APIController.getSearchDoanVien)
  router.get("/laymotdoanvien/:IDLop/:IDDoanVien", APIController.laymotdoanvien)
  router.post("/XoaDoanVien/:IDDoanVien", APIController.deleteDoanVien)


  router.get("/layDSHoatDong/:page", APIController.layDSHoatDong)
  router.post("/searchHoatDong", APIController.searchHoatDong)
  router.post("/TaoHoatDong", APIController.TaoHoatDong)
  router.get("/layMotHoatDong/:IDHoatDong", APIController.layMotHoatDong)
  router.post("/CapNhatHoatDong", APIController.capNhatHoatDong)
  router.post("/XoaHoatDong/:IDHoatDong", APIController.deleteHoatDong)

  // router.post("/insertDoanVienExcel", APIController.insertDataFromExcel)
  
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });
  
  let insertDataFromExcel = async (fileBuffer) => {
    const MaLop = "DI20Z6A1"
    try {
      const workbook = XLSX.readFile(fileBuffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
      // Lấy danh sách các ô (cột) trong header
      const header = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
  
      // Lấy dữ liệu từ file Excel và chèn vào cơ sở dữ liệu
      const data = XLSX.utils.sheet_to_json(sheet, { header: header });
      for (const row of data) {
        const { MSSV, HoTen, Email, SoDT, GioiTinh, QueQuan, DanToc, TonGiao, NgaySinh, NgayVaoDoan } = row;
  
        if (GioiTinh === "Nam") {
          GioiTinh = 1
        } else if (GioiTinh === "Nữ") {
          GioiTinh = 0
        } else {
          GioiTinh = 2
        }
  
        DanToc = 1
        TonGiao = 1
  
        // Thực hiện truy vấn SQL để chèn dữ liệu vào cơ sở dữ liệu
        const sql = `INSERT INTO TenBang (MaLop, MSSV, HoTen, Email, SoDT, GioiTinh, QueQuan, DanToc, TonGiao, NgaySinh, NgayVaoDoan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await pool.execute(sql, [MaLop, MSSV, HoTen, Email, SoDT, GioiTinh, QueQuan, DanToc, TonGiao, NgaySinh, NgayVaoDoan]);
      }
  
      console.log('Dữ liệu đã được chèn thành công từ file Excel');
    } catch (error) {
      console.error('Lỗi khi chèn dữ liệu từ file Excel: ', error);
    }
  };
  app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.buffer; // Assuming you're passing the file as a buffer
  
    // Call the insertDataFromExcel function
    await insertDataFromExcel(filePath);
  
    // Respond to the client
    res.json({ success: true });
  });

  router.get("/dsBCH/:page", APIController.getBCH)
  router.post("/searchBCH", APIController.getSearchBCH)

  return app.use("/api", router);
};

// module.exports = initWebRoute;
export default initAPIRoute;

/* */
// Danh sach Chi Doan: Cap nhat, xoa
// Danh sach doan vien" tai danh sách lên
// BCH: xem chi tiết
//