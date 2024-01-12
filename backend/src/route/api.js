import express from "express";
import APIController from "../controller/APIController";
let router = express.Router();
const XLSX = require("xlsx");
const multer = require("multer");
import pool from "../configs/connectDB";
const { parse, format } = require("date-fns");
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
        filename = "logo.jpg";
      }

      await pool.execute("INSERT INTO anh (TenAnh, IDDoanVien) VALUES (?, ?)", [
        filename,
        newDoanVien[0].IDDoanVien,
      ]);

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

  const storage = multer.memoryStorage();
  const upload1 = multer({ storage: storage });

  router.post(
    "/ThemDoanVienExcel",
    upload1.single("file"),
    async (req, res) => {
      let { IDLop } = req.body;
      console.log(req.body);

      // Parse IDLop to an integer
      IDLop = parseInt(IDLop, 10); // Assuming base 10

      // Ensure that IDLop is a valid integer
      if (isNaN(IDLop)) {
        console.error("Invalid IDLop:", req.body.IDLop);
        res.status(400).json({ message: "Invalid IDLop" });
        return;
      }

      try {
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        for (const row of data) {
          const {
            MSSV,
            HoTen,
            Email,
            SoDienThoai,
            GioiTinh: GioiTinhFromRow,
            QueQuan,
            DanToc,
            TonGiao,
            NgaySinh,
            NgayVaoDoan,
            ChucVu,
          } = row;

          const trimmedMSSV = String(MSSV).trim();
          const trimmedHoTen = String(HoTen).trim();
          const trimmedEmail = String(Email).trim();
          const trimmedSoDienThoai = String(SoDienThoai).trim();
          const trimmedGioiTinhFromRow = String(GioiTinhFromRow).trim();
          const trimmedQueQuan = String(QueQuan).trim();
          const trimmedDanToc = String(DanToc).trim();
          const trimmedTonGiao = String(TonGiao).trim();
          const trimmedChucVu = String(ChucVu).trim();

          const parsedNgaySinh = format(
            parse(NgaySinh, "dd/MM/yyyy", new Date()),
            "yyyy/MM/dd"
          );
          const parsedNgayVaoDoan = format(
            parse(NgayVaoDoan, "dd/MM/yyyy", new Date()),
            "yyyy/MM/dd"
          );

          console.log(row);
          try {
            let GioiTinh;

            if (trimmedGioiTinhFromRow === "Nữ") {
              GioiTinh = 0;
            } else if (trimmedGioiTinhFromRow === "Nam") {
              GioiTinh = 1;
            } else {
              GioiTinh = 2;
            } 

            const [dantoc, fieldsdantoc] = await pool.execute(
              "SELECT * FROM dantoc WHERE dantoc.tendantoc like ?",
              ["%" + trimmedDanToc + "%"]
            );

            const [tongiao, fieldsTongiao] = await pool.execute(
              "SELECT * FROM tongiao WHERE tongiao.tentongiao like ?",
              ["%" + trimmedTonGiao + "%"]
            );

            const [chucvu, fieldsChucvu] = await pool.execute(
              "SELECT * FROM chucvu WHERE chucvu.tencv like ?",
              ["%" + trimmedChucVu + "%"]
            );

            const [existingDoanVien, fieldsDoanVien] = await pool.execute(
              "SELECT * FROM DoanVien WHERE MSSV = ?",
              [trimmedMSSV]
          );
  
          if (existingDoanVien.length > 0) {
              // Update the existing record
              await pool.execute(
                  "UPDATE doanvien SET HoTen = ?, Email = ?, SoDT = ?, GioiTinh = ?, QueQuan = ?, IDDanToc = ?, IDTonGiao = ?, NgaySinh = ?, NgayVaoDoan = ? WHERE MSSV = ?",
                  [
                      trimmedHoTen,
                      trimmedEmail,
                      trimmedSoDienThoai,
                      GioiTinh,
                      trimmedQueQuan,
                      dantoc[0]?.IDDanToc || null,
                      tongiao[0]?.IDTonGiao || null,
                      parsedNgaySinh,
                      parsedNgayVaoDoan,
                      trimmedMSSV,
                  ]
              );
          } else {

            await pool.execute(
              "INSERT INTO doanvien (IDLop, MSSV, HoTen, Email, SoDT, GioiTinh, QueQuan, IDDanToc, IDTonGiao, NgaySinh, NgayVaoDoan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                IDLop,
                trimmedMSSV,
                trimmedHoTen,
                trimmedEmail,
                trimmedSoDienThoai,
                GioiTinh,
                trimmedQueQuan,
                dantoc[0].IDDanToc,
                tongiao[0].IDTonGiao,
                parsedNgaySinh,
                parsedNgayVaoDoan,
              ]
            );

            const [newDoanVien] = await pool.execute(
              "SELECT * FROM DoanVien WHERE MSSV = ?",
              [MSSV]
            );

            await pool.execute(
              "INSERT INTO chitietnamhoc (IDDoanVien, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
              [newDoanVien[0].IDDoanVien, chucvu[0].IDChucVu, 1]
            );

            await pool.execute(
              "INSERT INTO anh (TenAnh, IDDoanVien) VALUES (?, ?)",
              ["logo.jpg", newDoanVien[0].IDDoanVien]
            );

            console.log("them thanh cong");
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Có lỗi xảy ra" });
            return;
          }
        }

        res.status(200).json({ message: "Thêm nhiều đoàn viên thành công!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Có lỗi xảy ra" });
      }
    }
  );

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
  router.get("/LayDSNopDoanPhi/:IDDoanPhi", APIController.LayDSNopDoanPhi);
  router.post("/saveCheckboxStates", APIController.SaveCheckboxStates);
  
  return app.use("/api", router);
};

export default initAPIRoute;
