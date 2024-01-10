import express from "express";
import APIController from "../controller/APIController";
let router = express.Router();
const multer = require("multer");
import pool from "../configs/connectDB";
// const formidable = require('formidable');
import { path } from "path";
var appRoot = require("app-root-path");

const initAPIRoute = (app) => {
  /* Trường */
  router.get("/dschidoan/:page", APIController.getAllChiDoan);
  router.get("/dskhoa", APIController.getKhoa);
  router.post("/searchChiDoan", APIController.getSearchChiDoan);
  router.post("/ThemChiDoan", APIController.ThemChiDoan);
  router.get("/detailChiDoan/:IDLop/:page", APIController.getDetailChiDoan);
  router.post("/XoaChiDoan/:selectedIDLop", APIController.XoaChiDoan);
  router.get("/LayMotChiDoan/:IDLop", APIController.laymotchidoan);
  router.post("/CapNhatChiDoan", APIController.CapNhatChiDoan);

  var filename = "";
  const upload = multer({
    storage: multer.diskStorage({
      destination: "./src/public/images",
      filename: (req, file, cb) => {
        // tạo tên file duy nhất
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const originalName = file.originalname;
        const extension = originalName.split(".").pop();

        console.log("File Type:", file.mimetype);
        
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
        filename = file.fieldname + "-" + uniqueSuffix + "." + extension;
      },
    }),
  });

  router.post("/ThemMoiDoanVien", upload.single("file"), async (req, res) => {
    let {
      IDLop,
      MSSV,
      HoTen,
      Email,
      SoDT,
      GioiTinh,
      Province,
      District,
      Ward,
      IDDanToc,
      IDTonGiao,
      NgaySinh,
      NgayVaoDoan,
      IDChucVu,
      IDNamHoc,
    } = req.body;

    console.log(req.body);

    const QueQuan = `${Ward}, ${District}, ${Province}`;

    try {
      const [existingRows, existingFields] = await pool.execute(
        "SELECT * FROM doanvien WHERE doanvien.Email = ?",
        [Email]
      );

      if (existingRows.length > 0) {
        return res.status(200).json({
          Message: "Email đã tồn tại",
        });
      }

      const [existingRows1, existingFields1] = await pool.execute(
        "SELECT * FROM doanvien WHERE doanvien.MSSV = ?",
        [MSSV]
      );

      if (existingRows1.length > 0) {
        return res.status(200).json({
          Message: "MSSV đã tồn tại",
        });
      }

      await pool.execute(
        "INSERT INTO doanvien (IDLop, MSSV, HoTen, Email, SoDT, GioiTinh, QueQuan, IDDanToc, IDTonGiao, NgaySinh, NgayVaoDoan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          IDLop,
          MSSV,
          HoTen,
          Email,
          SoDT,
          GioiTinh,
          QueQuan,
          IDDanToc,
          IDTonGiao,
          NgaySinh,
          NgayVaoDoan,
        ]
      );

      const [newDoanVien] = await pool.execute(
        "SELECT * FROM DoanVien WHERE MSSV = ?",
        [MSSV]
      );

      if (filename === undefined || filename === "" || filename === null) {
        await pool.execute("INSERT INTO anh (IDDoanVien) VALUES (?)", [
          newDoanVien[0].IDDoanVien,
        ]);
      } else {
        await pool.execute(
          "INSERT INTO anh (TenAnh, IDDoanVien) VALUES (?, ?)",
          [filename, newDoanVien[0].IDDoanVien]
        );
      }

      await pool.execute(
        "INSERT INTO chitietnamhoc (IDDoanVien, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
        [newDoanVien[0].IDDoanVien, IDChucVu, IDNamHoc]
      );

      res.status(200).json({ message: "Thêm đoàn viên thành công!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra" });
    }
  });

  router.get("/getChucVu", APIController.getChucVu);
  router.post("/searchDoanVien", APIController.getSearchDoanVien);
  router.get(
    "/laymotdoanvien/:IDLop/:IDDoanVien/:IDChiTietNamHoc",
    APIController.laymotdoanvien
  );
  router.post("/XoaDoanVien/:IDChiTietNamHoc", APIController.deleteDoanVien);
  router.post("/CapNhatDoanVien", APIController.CapNhatDoanVien);

  router.get("/layDSHoatDong/:page", APIController.layDSHoatDong);
  router.post("/searchHoatDong", APIController.searchHoatDong);
  router.post("/TaoHoatDong", APIController.TaoHoatDong);
  router.get("/layMotHoatDong/:IDHoatDong", APIController.layMotHoatDong);
  router.post("/CapNhatHoatDong", APIController.capNhatHoatDong);
  router.post("/XoaHoatDong/:IDHoatDong", APIController.deleteHoatDong);

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

  //   app.post('/upload', upload.single('file'), async (req, res) => {
  //     const filePath = req.file.buffer; // Assuming you're passing the file as a buffer

  //     // Call the insertDataFromExcel function
  //     await insertDataFromExcel(filePath);

  //     // Respond to the client
  //     res.json({ success: true });
  //   });
  router.get("/LayTonGiao", APIController.LayTonGiao);
  router.get("/LayDanToc", APIController.LayDanToc);

  router.get("/dsBCH/:page", APIController.getBCH);
  router.post("/searchBCH", APIController.getSearchBCH);
  router.post("/XoaBanChapHanh/:select", APIController.deleteBanChapHanh);

  router.get("/namhoc", APIController.namhoc);
  router.post("/searchNamHoc", APIController.searchNamHoc);

  router.get("/dsdoanphi/:page", APIController.layDSDoanPhi);
  router.post("/XoaMotDoanPhi/:IDDoanPhi", APIController.XoaDoanPhi);
  router.post("/ThemDoanPhi", APIController.ThemDoanPhi);
  router.get("/LayMotDoanPhi/:IDDoanPhi", APIController.LayMotDoanPhi);
  router.post("/CapNhatDoanPhi", APIController.CapNhatDoanPhi);

  return app.use("/api", router);
};

export default initAPIRoute;
