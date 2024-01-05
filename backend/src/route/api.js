import express from "express";
import APIController from "../controller/APIController";
let router = express.Router();
const multer = require('multer');
import pool from "../configs/connectDB";
 

const initAPIRoute = (app) => {
  /* Trường */
  router.get("/dschidoan/:page", APIController.getAllChiDoan)
  router.get("/dskhoa", APIController.getKhoa)
  router.post("/searchChiDoan", APIController.getSearchChiDoan)
  router.post("/ThemChiDoan", APIController.ThemChiDoan)
  router.get("/detailChiDoan/:IDLop/:page", APIController.getDetailChiDoan)
  router.post("/XoaChiDoan/:selectedIDLop", APIController.XoaChiDoan)
  router.get("/LayMotChiDoan/:IDLop", APIController.laymotchidoan)
  router.post("/CapNhatChiDoan", APIController.CapNhatChiDoan)

  var filename = ''
    const upload = multer({
        storage: multer.diskStorage({
            destination: './src/public/ungtuyen',
            filename: (req, file, cb) => {
                // tạo tên file duy nhất
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const originalName = file.originalname;
                const extension = originalName.split('.').pop();
                cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
                filename = file.fieldname + '-' + uniqueSuffix + '.' + extension
            }
        })
    });

    router.post('/themgv', upload.single('file'), async (req, res) => {

        let { tenGV, email, sdt, ngaysinh, gioitinh } = req.body
        console.log(req.body)
        try {
            // Thêm giảng viên vào bảng giang_vien
            await pool.execute(
                "INSERT INTO giang_vien (tenGV, email, sdt, ngaysinh, gioitinh) VALUES (?, ?, ?, ?, ?)",
                [tenGV, email, sdt, ngaysinh, gioitinh]
            );

            // Lấy giảng viên vừa thêm
            const [newGiangVien] = await pool.execute("SELECT * FROM giang_vien WHERE email = ?", [email]);

            // Thêm ảnh vào bảng hinh_anh
            await pool.execute(
                "INSERT INTO hinh_anh (tenHA, maGV) VALUES (?, ?)",
                [filename, newGiangVien[0].maGV]
            );
            res.status(200).json({ message: 'Upload thành công' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    });

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
  
  // const storage = multer.memoryStorage();
  // const upload = multer({ storage: storage });
  
  // let insertDataFromExcel = async (fileBuffer) => {
  //   const MaLop = "DI20Z6A1"
  //   try {
  //     const workbook = XLSX.readFile(fileBuffer, { type: 'buffer' });
  //     const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
  //     // Lấy danh sách các ô (cột) trong header
  //     const header = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
  
  //     // Lấy dữ liệu từ file Excel và chèn vào cơ sở dữ liệu
  //     const data = XLSX.utils.sheet_to_json(sheet, { header: header });
  //     for (const row of data) {
  //       const { MSSV, HoTen, Email, SoDT, GioiTinh, QueQuan, DanToc, TonGiao, NgaySinh, NgayVaoDoan } = row;
  
  //       if (GioiTinh === "Nam") {
  //         GioiTinh = 1
  //       } else if (GioiTinh === "Nữ") {
  //         GioiTinh = 0
  //       } else {
  //         GioiTinh = 2
  //       }
  
  //       DanToc = 1
  //       TonGiao = 1
  
  //       // Thực hiện truy vấn SQL để chèn dữ liệu vào cơ sở dữ liệu
  //       const sql = `INSERT INTO TenBang (MaLop, MSSV, HoTen, Email, SoDT, GioiTinh, QueQuan, DanToc, TonGiao, NgaySinh, NgayVaoDoan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  //       await pool.execute(sql, [MaLop, MSSV, HoTen, Email, SoDT, GioiTinh, QueQuan, DanToc, TonGiao, NgaySinh, NgayVaoDoan]);
  //     }
  
  //     console.log('Dữ liệu đã được chèn thành công từ file Excel');
  //   } catch (error) {
  //     console.error('Lỗi khi chèn dữ liệu từ file Excel: ', error);
  //   }
  // };

  app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.buffer; // Assuming you're passing the file as a buffer
  
    // Call the insertDataFromExcel function
    await insertDataFromExcel(filePath);
  
    // Respond to the client
    res.json({ success: true });
  });

  router.get("/dsBCH/:page", APIController.getBCH)
  router.post("/searchBCH", APIController.getSearchBCH)

  router.get("/namhoc", APIController.namhoc)
  router.post("/searchNamHoc", APIController.searchNamHoc)

  router.get("/dsdoanphi/:page", APIController.layDSDoanPhi)
  router.post("/XoaMotDoanPhi/:IDDoanPhi", APIController.XoaDoanPhi)
  router.post("/ThemDoanPhi", APIController.ThemDoanPhi)
  router.get("/LayMotDoanPhi/:IDDoanPhi", APIController.LayMotDoanPhi)
  router.post("/CapNhatDoanPhi", APIController.CapNhatDoanPhi)

  
  return app.use("/api", router);
};


export default initAPIRoute;
