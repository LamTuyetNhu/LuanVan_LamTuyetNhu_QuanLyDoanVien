import express from "express";
import APIController from "../controller/APIController";
let router = express.Router();
const XLSX = require("xlsx");
const multer = require("multer");
const fs = require("fs");
import pool from "../configs/connectDB";
const { parse, format } = require("date-fns");
const path = require("path");
const util = require("util");
const readdir = util.promisify(fs.readdir);
var appRoot = require("app-root-path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
import {
  authDoanTruong,
  authChiDoan,
  authDoanVien,
} from "../middleware/auther";

const logTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization || req.body.token || req.query.token;
  console.log("Token:", token);
  next(); // Pass control to the next middleware or route handler
};

const initAPIRoute = (app) => {
  /* Đăng nhập */
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
      const [dhct] = await pool.execute(
        "SELECT * FROM dhct WHERE EmailDH = ?",
        [email]
      );

      console.log(dhct);

      if (dhct.length > 0) {
        const passwordHash = dhct[0].PassDH;
        const passwordMatch = await bcrypt.compare(password, passwordHash);

        if (passwordHash) {
          const token = generateToken(dhct[0].emailDH, "DHCT");
          return res.json({ IDDHCT: dhct[0].IDDHCT, success: true, token });
        }
      }

      const [admin] = await pool.execute(
        "SELECT * FROM admin WHERE EmailTruong = ?",
        [email]
      );
      console.log(admin);

      const [bchtruong] = await pool.execute(
        "SELECT * FROM bchtruong, admin WHERE bchtruong.IDTruong = admin.IDTruong and bchtruong.EmailBCH = ?",
        [email]
      );

      console.log(bchtruong);
      if (bchtruong.length > 0 && admin.length === 0) {
        const passwordHash = bchtruong[0].PassBCH;
        const passwordMatch = await bcrypt.compare(password, passwordHash);

        console.log(passwordMatch);
        if (passwordMatch) {
          const token = generateToken(bchtruong[0].EmailTruong, "Admin");
          return res.json({
            IDTruong: bchtruong[0].IDTruong,
            IDBCH: bchtruong[0].IDBCH,
            success: true,
            token,
          });
        }
      }

      if (admin.length > 0 && bchtruong.length === 0) {
        const passwordHash = admin[0].PassTruong;
        const passwordMatch = await bcrypt.compare(password, passwordHash);

        if (passwordMatch) {
          const token = generateToken(admin[0].emailTruong, "Admin");
          return res.json({
            IDTruong: admin[0].IDTruong,
            success: true,
            token,
          });
        }
      }

      const [BCHChiDoan] = await pool.execute(
        "SELECT * FROM lop WHERE EmailLop = ?",
        [email]
      );

      if (BCHChiDoan.length > 0) {
        const passwordHash = BCHChiDoan[0].PassLop;
        const passwordMatch = await bcrypt.compare(password, passwordHash);

        if (passwordMatch) {
          const token = generateToken(BCHChiDoan[0].email, "BCHChiDoan");
          return res.json({ IDLop: BCHChiDoan[0].IDLop, success: true, token });
        }
      }

      // Check if the user is DoanVien
      const [doanvien] = await pool.execute(
        "SELECT * FROM doanvien WHERE email = ?",
        [email]
      );

      console.log(doanvien);

      if (doanvien.length > 0) {
        // Check the password
        const passwordHash = doanvien[0].Password;
        const passwordMatch = await bcrypt.compare(password, passwordHash);

        if (passwordMatch) {
          // Redirect to DoanVien page
          const token = generateToken(doanvien[0].email, "DoanVien");
          return res.json({
            IDDoanVien: doanvien[0].IDDoanVien,
            success: true,
            token,
          });
        }
      }

      // If none of the above conditions match, the login is unsuccessful
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  });

  function generateToken(email, role) {
    const secretKey = "yourSecretKey"; // Replace with your actual secret key
    const token = jwt.sign({ email, role }, secretKey, { expiresIn: "1h" });
    return token;
  }

  /* Trường */
  // router.use(verifyToken);
  router.get("/dschidoan/:page/:khoa", APIController.getAllChiDoan);
  router.get("/dskhoa", APIController.getKhoa);
  router.post("/searchChiDoan", APIController.getSearchChiDoan);
  // router.post("/searchChiDoanXepLoai", APIController.getSearchChiDoanXepLoai);

  router.post("/searchManyChiDoan", APIController.getSearchManyChiDoan);
  router.post("/searchManyHoatDong", APIController.getSearchManyHoatDong);

  router.post("/ThemChiDoan/:IDTruong", APIController.ThemChiDoan);
  router.get(
    "/detailChiDoan/:IDLop/:page/:idnamhoc",
    APIController.getDetailChiDoan
  );
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

    const password = MSSV;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      const [existingRows1, existingFields1] = await pool.execute(
        "SELECT * FROM doanvien WHERE doanvien.MSSV = ?",
        [MSSV]
      );
      
      if (existingRows1.length > 0 ) {
        if(Email !== existingRows1[0].Email) {
          return res.status(200).json({ message: "Email không khớp với đoàn viên này!"});
        } 

        const [existedNamHoc, existingNamHocFields1] = await pool.execute(
          "SELECT * FROM chitietnamhoc, namhoc WHERE chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and chitietnamhoc.IDDoanVien = ? and chitietnamhoc.idnamhoc = ?",
          [existingRows1[0].IDDoanVien, IDNamHoc]
        );

        if(existedNamHoc.length > 0) {
          console.log("MSSV đã tồn tại trong năm học này!");
          return res.status(200).json({ message: "MSSV đã tồn tại trong năm học\n" + existedNamHoc[0].TenNamHoc});
        } else {
          await pool.execute(
            "INSERT INTO chitietnamhoc (IDDoanVien, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
            [existingRows1[0].IDDoanVien, IDChucVu, IDNamHoc]
          );
          return res.status(200).json({ message: "Thêm đoàn viên thành công!" });
        };
      }  else {
        const [existingEmail, existingEmailField] = await pool.execute(
          "SELECT * FROM doanvien WHERE doanvien.Email = ?",
          [Email]
        );

        if(existingEmail.length === 0) {
          let [resultDoanVien] = await pool.execute(
            "INSERT INTO doanvien (IDLop, MSSV, HoTen, Email, Password, SoDT, GioiTinh, QueQuan, IDDanToc, IDTonGiao, NgaySinh, NgayVaoDoan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              IDLop,
              MSSV,
              HoTen,
              Email,
              hashedPassword,
              SoDT,
              GioiTinh,
              QueQuan,
              IDDanToc,
              IDTonGiao,
              NgaySinh,
              NgayVaoDoan,
            ]
          );
  
          let IDDoanVien = resultDoanVien.insertId;
  
          if (filename === undefined || filename === "" || filename === null) {
            filename = "logo.jpg";
          }
  
          await pool.execute(
            "INSERT INTO anh (TenAnh, IDDoanVien) VALUES (?, ?)",
            [filename, IDDoanVien]
          );
  
          await pool.execute(
            "INSERT INTO danhgiadoanvien (IDDoanVien, IDNamHoc) VALUES (?, ?)",
            [IDDoanVien, IDNamHoc]
          );
  
          await pool.execute(
            "INSERT INTO chitietnamhoc (IDDoanVien, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
            [IDDoanVien, IDChucVu, IDNamHoc]
          );
  
          return res.status(200).json({ message: "Thêm đoàn viên thành công!" });
        } else {
          return res.status(200).json({ message: "Eamil đã tồn tại!" });
        }
   
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Có lỗi xảy ra" });
    }
  });

  router.post("/CapNhatDoanVien", upload.single("file"), async (req, res) => {
    let {
      MSSV,
      HoTen,
      Email,
      SoDT,
      GioiTinh,
      NgaySinh,
      NgayVaoDoan,
      IDDanToc,
      IDTonGiao,
      QueQuan,
      IDDoanVien,
      listIDChucVu,
    } = req.body;

    // Parse listIDChucVu into an array of numbers
    listIDChucVu = JSON.parse(listIDChucVu).map((value) =>
      value !== null ? Number(value) : null
    );

    console.log("abc===================");
    console.log(req.body);
    console.log(listIDChucVu);

    const { file } = req; // Lấy thông tin về file từ request
    let filename = file ? file.filename : undefined;
    console.log(NgaySinh);

    const convertDateFormat = (dateString, originalFormat, targetFormat) => {
      return format(
        parse(dateString, originalFormat, new Date()),
        targetFormat
      );
    };

    const parsedNgaySinh = convertDateFormat(
      NgaySinh,
      "dd/MM/yyyy",
      "yyyy/MM/dd"
    );
    const parsedNgayVaoDoan = convertDateFormat(
      NgayVaoDoan,
      "dd/MM/yyyy",
      "yyyy/MM/dd"
    );

    try {
      // Kiểm tra xem file có tồn tại không và có thay đổi không
      let filename = "";
      if (file && file.filename) {
        filename = file.filename;
      }

      // Cập nhật thông tin đoàn viên
      await pool.execute(
        "UPDATE doanvien SET Email = ?, HoTen = ?, MSSV = ?, SoDT = ?, QueQuan = ?, GioiTinh = ?, NgaySinh = ?, NgayVaoDoan = ?, IDDanToc = ?, IDTonGiao = ? WHERE IDDoanVien = ?",
        [
          Email,
          HoTen,
          MSSV,
          SoDT,
          QueQuan,
          GioiTinh,
          parsedNgaySinh,
          parsedNgayVaoDoan,
          IDDanToc,
          IDTonGiao,
          IDDoanVien,
        ]
      );

      const [chitietnamhocRows] = await pool.execute(
        "SELECT * FROM chitietnamhoc WHERE IDDoanVien = ? and ttChiTietNH = 1",
        [IDDoanVien]
      );

      console.log(chitietnamhocRows);

      for (let i = 0; i < chitietnamhocRows.length; i++) {
        const chitietnamhocRow = chitietnamhocRows[i];
        console.log(chitietnamhocRow);
        const newIDChucVu = listIDChucVu[i];
        console.log(newIDChucVu);

        await pool.execute(
          "UPDATE chitietnamhoc SET IDChucVu = ? WHERE IDChiTietNamHoc = ?",
          [newIDChucVu, chitietnamhocRow.IDChiTietNamHoc]
        );
      }

      if (file && file.filename) {
        filename = file.filename;

        // Cập nhật tên ảnh trong bảng 'anh'
        await pool.execute("UPDATE anh SET TenAnh = ? WHERE IDDoanVien = ?", [
          filename,
          IDDoanVien,
        ]);
      }

      return res.status(200).json({
        message: "Cập nhật thành công!",
      });
    } catch (error) {
      console.log("Không cập nhật được!", error);
      return res.status(500).json({ error: "Không hiển thị được!" });
    }
  });

  router.get("/getChucVu", APIController.getChucVu);
  router.post("/searchDoanVien", APIController.getSearchDoanVien);
  router.post("/searchDGDoanVien", APIController.getSearchDGDoanVien);

  router.post("/searchManyDoanVien", APIController.getSearchManyDoanVien);

  router.get(
    "/laymotdoanvien/:IDLop/:IDDoanVien/:IDChiTietNamHoc",
    APIController.laymotdoanvien
  );
  router.post("/XoaDoanVien/:IDDoanVien", APIController.deleteDoanVien);
  router.post(
    "/XoaChiTietDoanVien/:IDChiTietNamHoc/:IDDanhGia",
    APIController.XoaChiTietDoanVien
  );

  router.get(
    "/layDSHoatDong/:page/:idnamhoc/:IDTruong",
    APIController.layDSHoatDong
  );
  router.post("/searchHoatDong", APIController.searchHoatDong);
  router.post("/TaoHoatDong", APIController.TaoHoatDong);
  router.get("/layMotHoatDong/:IDHoatDong", APIController.layMotHoatDong);
  router.post("/CapNhatHoatDong/:IDHoatDong", APIController.capNhatHoatDong);
  router.post("/XoaHoatDong/:IDHoatDong", APIController.deleteHoatDong);
  router.get(
    "/LayDSDiemDanh/:IDHoatDong/:IDNamHoc",
    APIController.LayDSDiemDanh
  );
  router.post(
    "/saveCheckboxStatesDiemDanh",
    APIController.SaveCheckboxStatesDiemDanh
  );

  const storage = multer.memoryStorage();
  const upload1 = multer({ storage: storage });

  router.post(
    "/ThemDoanVienExcel",
    upload1.single("file"),
    async (req, res) => {
      let { IDLop, idnamhoc } = req.body;
      console.log(req.body);

      IDLop = parseInt(IDLop, 10); // Assuming base 10
      idnamhoc = parseInt(idnamhoc, 10); // Assuming base 10

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

          console.log(row);

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

            const [existingRows1, existingFields1] = await pool.execute(
              "SELECT * FROM doanvien WHERE doanvien.MSSV = ?",
              [trimmedMSSV]
            );

            if (existingRows1.length > 0) {
              const [existedNamHoc, existingNamHocFields1] = await pool.execute(
                "SELECT * FROM chitietnamhoc WHERE chitietnamhoc.IDDoanVien = ? and chitietnamhoc.idnamhoc = ?",
                [existingRows1[0].IDDoanVien, idnamhoc]
              );

              if (existedNamHoc.length > 0) {
                console.log("Nam Hoc va MSSV da ton tai");
                res.status(500).json({ message: "Nam Hoc va MSSV da ton tai" });
                continue;
              } else {
                await pool.execute(
                  "INSERT INTO chitietnamhoc (IDDoanVien, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
                  [existingRows1[0].IDDoanVien, chucvu[0].IDChucVu, idnamhoc]
                );
              }

              const [existedDanhGiaNamHoc, existingDanhGiaNamHocFields1] =
                await pool.execute(
                  "SELECT * FROM danhgiadoanvien WHERE danhgiadoanvien.IDDoanVien = ? and danhgiadoanvien.IDNamHoc = ?",
                  [existingRows1[0].IDDoanVien, idnamhoc]
                );

              if (existedDanhGiaNamHoc.length > 0) {
                console.log("Nam Hoc va MSSV da ton tai");
                res.status(500).json({ message: "Nam Hoc va MSSV da ton tai" });
                continue;
              } else {
                await pool.execute(
                  "INSERT INTO danhgiadoanvien (IDDoanVien, IDNamHoc) VALUES (?, ?)",
                  [existingRows1[0].IDDoanVien, idnamhoc]
                );
              }
            } else {
              const password = trimmedMSSV;
              const saltRounds = 10;
              const hashedPassword = await bcrypt.hash(password, saltRounds);

              const [resultDoanVien] = await pool.execute(
                "INSERT INTO doanvien (IDLop, MSSV, HoTen, Email, Password, SoDT, GioiTinh, QueQuan, IDDanToc, IDTonGiao, NgaySinh, NgayVaoDoan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  IDLop,
                  trimmedMSSV,
                  trimmedHoTen,
                  trimmedEmail,
                  hashedPassword,
                  trimmedSoDienThoai,
                  GioiTinh,
                  trimmedQueQuan,
                  dantoc[0].IDDanToc,
                  tongiao[0].IDTonGiao,
                  parsedNgaySinh,
                  parsedNgayVaoDoan,
                ]
              );

              let IDDoanVien = resultDoanVien.insertId;

              await pool.execute(
                "INSERT INTO chitietnamhoc (IDDoanVien, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
                [IDDoanVien, chucvu[0].IDChucVu, idnamhoc]
              );

              await pool.execute(
                "INSERT INTO danhgiadoanvien (IDDoanVien, IDNamHoc, hk1, hk2, rl1, rl2, PhanLoai) VALUES (?, ?, 0, 0, 0, 0, 0)",
                [IDDoanVien, idnamhoc]
              );

              await pool.execute(
                "INSERT INTO anh (TenAnh, IDDoanVien) VALUES (?, ?)",
                ["logo.jpg", IDDoanVien]
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

  router.get("/dsBCH/:page/:idnamhoc/:khoa/:IDTruong", APIController.getBCH);
  router.post("/searchBCH", APIController.getSearchBCH);
  router.post("/searchManyDoanVienBCH", APIController.searchManyDoanVienBCH);

  router.post("/XoaBanChapHanh/:select", APIController.deleteBanChapHanh);

  router.get("/namhoc", APIController.namhoc);
  router.get("/namhoccuamotchidoan/:IDLop", APIController.namhoccuamotchidoan);
  router.get("/namhoccuakhoa/:Khoa", APIController.namhoccuamotkhoa);
  router.get("/namhoccuaxeploai", APIController.namhoccuaxeploai);

  router.post("/searchNamHoc", APIController.searchNamHoc);

  router.get("/dsdoanphi/:IDTruong/:idnamhoc", APIController.layDSDoanPhi);
  // router.get("/dsdoanphicualop/:IDLop/:idnamhoc", APIController.layDSDoanPhiCuaDoanVien);

  router.post("/XoaMotDoanPhi/:IDDoanPhi", APIController.XoaDoanPhi);
  router.post("/ThemDoanPhi/:IDTruong", APIController.ThemDoanPhi);
  router.get("/LayMotDoanPhi/:IDDoanPhi", APIController.LayMotDoanPhi);
  router.post("/CapNhatDoanPhi", APIController.CapNhatDoanPhi);
  router.get(
    "/LayDSNopDoanPhi/:IDDoanPhi/:IDNamHoc",
    APIController.LayDSNopDoanPhi
  );
  router.post("/saveCheckboxStates", APIController.SaveCheckboxStates);

  router.get("/laytenlop/:IDLop", APIController.laytenlop);
  router.get("/dsachBCH/:IDLop/:idnamhoc", APIController.getBCHMotLop);
  router.get(
    "/dsdoanphicualop/:IDLop/:idnamhoc",
    APIController.layDSDoanPhiCuaMotLop
  );
  router.get(
    "/LayDSNopDoanPhi/:IDLop/:IDDoanPhi/:IDNamHoc",
    APIController.LayDSNopDoanPhiCuaMotLop
  );
  router.post(
    "/SaveCheckboxStatesCuaMotLop",
    APIController.SaveCheckboxStatesCuaMotLop
  );
  router.get(
    "/layDSHoatDongCuaLop/:IDLop/:idnamhoc",
    APIController.layDSHoatDongCuaLop
  );
  router.get(
    "/LayDSDiemDanhCuaLop/:IDLop/:IDHoatDong/:IDNamHoc",
    APIController.LayDSDiemDanhCuaLop
  );
  router.post(
    "/saveCheckboxStatesDiemDanhCuaLop",
    APIController.SaveCheckboxStatesDiemDanhCuaLop
  );

  router.get("/laytendoanvien/:IDDoanVien", APIController.laytendoanvien);
  router.get(
    "/layDSChucVuDoanVien/:IDDoanVien",
    APIController.layDSChucVuDoanVien
  );
  router.get(
    "/layDSDanhGiaDoanVien/:IDDoanVien",
    APIController.layDSDanhGiaDoanVien
  );

  router.get(
    "/laydshoatdongcuadoanvien/:IDDoanVien/:IDNamHoc",
    APIController.layDSHoatDongCuaDoanVien
  );

  var filename = "";
  const uploadPFD = multer({
    storage: multer.diskStorage({
      destination: "./src/public/files",
      filename: (req, file, cb) => {
        // tạo tên file duy nhất
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const originalName = file.originalname;
        const extension = originalName.split(".").pop();
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
        filename = file.fieldname + "-" + uniqueSuffix + "." + extension;
      },
    }),
  });

  router.post("/ungtuyen", uploadPFD.single("file"), async (req, res) => {
    console.log(req.body);
    let { IDDoanVien, idnamhoc } = req.body;
    console.log(IDDoanVien);
    console.log(idnamhoc);

    try {
      // thêm vào CSDL
      await pool.execute(
        "INSERT INTO ungtuyen(IDDoanVien, IDNamHoc, FileUngTuyen, NgayUngTuyen) VALUES(?, ?, ?, NOW())",
        [IDDoanVien, idnamhoc, filename]
      );

      res.status(200).json({ message: "Upload thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  router.get("/DanhSachUngTuyen/:IDNamHoc", APIController.DanhSachUngTuyen);

  router.get(
    "/DanhSachUngTuyenCuaLop/:IDNamHoc/:IDLop",
    APIController.DanhSachUngTuyenCuaLop
  );
  router.get(
    "/DanhSachUngTuyenCuaDV/:IDDoanVien",
    APIController.DanhSachUngTuyenCuaDV
  );
  router.post(
    "/CapNhatUngTuyenCuaDV/:IDUngTuyen/:TTUngTuyen",
    APIController.CapNhatUngTuyenCuaDV
  );
  router.get("/MauUngTuyen", APIController.MauUngTuyen);
  router.post("/searchManySVNT", APIController.getSearchSVNT);

  router.post("/DiemCuaMotDoanVien", APIController.DiemCuaMotDoanVien);
  router.get(
    "/LayDiemCuaMotDoanVien/:IDDoanVien/:IDNamHoc",
    APIController.LayDiemCuaMotDoanVien
  );

  router.get(
    "/KetQuaCuaMotDoanVien/:IDDoanVien",
    APIController.KetQuaCuaMotDoanVien
  );
  router.get(
    "/laydsdoanphicuadoanvien/:IDDoanVien/:IDNamHoc",
    APIController.layDSDoanPhiCuaDoanVien
  );
  router.post(
    "/doimatkhaudoanvien/:IDDoanVien",
    APIController.DoiMatKhauDoanVien
  );
  router.get(
    "/DanhSachDanhGiaDoanVienCuaLop/:page/:IDLop/:idnamhoc",
    APIController.DanhSachDanhGiaDoanVienCuaLop
  );

  router.get(
    "/DanhGiaChiDoan/:idnamhoc/:khoa/:IDTruong",
    APIController.DanhGiaChiDoan
  );

  router.get(
    "/DanhGiaTungChiDoan/:IDLop/:idnamhoc",
    APIController.DanhGiaCuaTungChiDoan
  );

  const upload2 = multer({ storage: storage });
  router.post(
    "/DanhGiaDoanVienExcel",
    upload2.single("file"),
    async (req, res) => {
      let { IDLop, idnamhoc } = req.body;
      console.log(req.body);

      // // Parse IDLop to an integer
      IDLop = parseInt(IDLop, 10); // Assuming base 10
      idnamhoc = parseInt(idnamhoc, 10); // Assuming base 10

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

        for (let row of data) {
          let { MSSV, hk1, hk2, rl1, rl2 } = row;

          console.log(row);

          let trimmedMSSV = String(MSSV).trim();
          console.log(trimmedMSSV);
          hk1 = parseFloat(hk1);
          hk2 = parseFloat(hk2);
          rl1 = parseInt(rl1);
          rl2 = parseInt(rl2);

          let PhanLoai = 0;
          // Kiểm tra các điều kiện và phân loại
          if (
            hk1 >= 2.5 &&
            hk2 >= 2.5 &&
            (rl1 + rl2) / 2 >= 80 &&
            rl1 >= 70 &&
            rl2 >= 70
          ) {
            PhanLoai = 1;
          } else if (
            (hk1 + hk2) / 2 >= 2.0 &&
            hk2 >= 1.5 &&
            hk1 >= 1.5 &&
            (rl1 + rl2) / 2 >= 70 &&
            rl1 >= 60 &&
            rl2 >= 60
          ) {
            PhanLoai = 2;
          } else if (
            (hk1 + hk2) / 2 >= 1.5 &&
            hk1 >= 1.0 &&
            hk2 >= 1.0 &&
            rl1 >= 50 &&
            rl2 >= 50
          ) {
            PhanLoai = 3;
          } else if (
            (hk1 + hk2) / 2 < 1.5 ||
            hk1 < 1.0 ||
            hk2 < 1.0 ||
            ((rl1 < 50 || rl2 < 50) && (rl1 + rl2) / 2 < 50)
          ) {
            PhanLoai = 4;
          }
          console.log(row);
          try {
            let [rowsMSSV, fieldsMSSV] = await pool.execute(
              "SELECT * from doanvien, danhgiadoanvien where danhgiadoanvien.IDDoanVien = doanvien.IDDoanVien and doanvien.IDLop = ? and doanvien.MSSV = ? and danhgiadoanvien.IDNamHoc = ?",
              [IDLop, trimmedMSSV, idnamhoc]
            );

            console.log("ABC: ", rowsMSSV);

            if (rowsMSSV.length === 0) {
              console.log(
                `MSSV ${trimmedMSSV} không tồn tại, tiếp tục với row tiếp theo.`
              );
              continue; // Bỏ qua row hiện tại và chuyển đến row tiếp theo trong vòng lặp
            }

            const IDDoanVien = rowsMSSV[0].IDDoanVien;
            console.log("IDDoanvien:", IDDoanVien);

            let [rows, fields] = await pool.execute(
              "update danhgiadoanvien set hk1 = ?, hk2 = ?, rl1 = ?, rl2 = ?, PhanLoai = ? where IDNamHoc = ? and IDDoanVien = ?",
              [hk1, hk2, rl1, rl2, PhanLoai, idnamhoc, IDDoanVien]
            );
            console.log(rows);
          } catch (error) {
            console.error("Lỗi truy vấn:", error);
            return res
              .status(500)
              .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
          }
        }

        res.status(200).json({ message: "Thêm nhiều đoàn viên thành công!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Có lỗi xảy ra" });
      }
    }
  );

  router.get("/laytentruong/:IDTruong", APIController.laytentruong);
  router.post(
    "/doimatkhaudoantruong/:IDTruong",
    APIController.DoiMatKhauDoanTruong
  );
  router.post(
    "/CapNhatThongTinDoanTruong",
    APIController.CapNhatThongTinDoanTruong
  );
  router.post("/CapNhatThongTinLop", APIController.CapNhatThongTinLop);
  router.post("/doimatkhaulop/:IDLop", APIController.DoiMatKhauLop);
  router.post("/guiMaXacNhan", APIController.guiMaXacNhan);
  router.get("/LayTieuChi", APIController.LayTieuChi);
  router.get("/LayMotTieuChi/:IDTieuChi", APIController.LayMotTieuChi);
  router.post("/CapNhatMotTieuChi/:IDTieuChi", APIController.CapNhatMotTieuChi);
  router.get("/LayTieuChiChiDoan", APIController.LayTieuChiChiDoan);
  router.post("/LayMotTieuChiDGCD/:IDDGCD", APIController.CapNhatMotTieuChiCD);
  router.get("/LayTieuChiDoanVien", APIController.LayTieuChiDoanVien);
  router.post(
    "/CapNhatTieuChiDoanVien/:IDTieuChiDV",
    APIController.CapNhatTieuChiDoanVien
  );
  router.post(
    "/CapNhatMauUngTuyen",
    uploadPFD.single("file"),
    async (req, res) => {
      console.log(req.body);

      try {
        // thêm vào CSDL
        await pool.execute(
          "update dieukiensinhviennamtot set TenFile = ? where IDFile = 1",
          [filename]
        );

        res.status(200).json({ message: "Upload thành công" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
      }
    }
  );

  /* DHCT */
  router.get("/laytentruongdh/:IDDHCT", APIController.laytentruongdh);
  router.get("/dstruong/:page", APIController.getAllTruong);
  router.post("/ThemTruong", APIController.ThemTruong);
  router.post("/searchManyTenTruong", APIController.searchManyTenTruong);
  router.post("/XoaTruong/:selectedIDLop", APIController.XoaTruong);
  router.get("/LayMotTruong/:IDTruong", APIController.LayMotTruong);
  router.post("/CapNhatTruong/:IDTruong", APIController.CapNhatTruong);
  router.get("/dschidoan/:IDTruong/:page/:khoa", APIController.getAllChiDoanCT);
  router.post("/ThemChiDoan/:IDTruong", APIController.ThemChiDoanCT);
  router.get("/laytatcatruong/", APIController.laytatcatruong);
  router.get(
    "/DanhSachUngTuyenCT/:IDNamHoc/:IDTruong/:page",
    APIController.DanhSachUngTuyenCT
  );
  router.get(
    "/BCHTruong/:page/:idnamhoc/:IDTruong",
    APIController.getBCHTruong
  );
  router.get("/namhoccuabch", APIController.namhoccuabch);
  router.post("/ThemMoiBCH", upload.single("file"), async (req, res) => {
    let {
      IDTruong,
      MaBCH,
      TenBCH,
      GioiTinhBCH,
      EmailBCH,
      SoDTBCH,
      IDDanToc,
      IDTonGiao,
      NgaySinhBCH,
      NgayVaoDoanBCH,
      IDChucVu,
      IDNamHoc,
      Province,
      District,
      Ward,
    } = req.body;

    console.log(req.body);

    const QueQuan = `${Ward}, ${District}, ${Province}`;

    const password = MaBCH;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      const [existingRows1, existingFields1] = await pool.execute(
        "SELECT * FROM bchtruong WHERE bchtruong.MaBCH = ?",
        [MaBCH]
      );

      if (existingRows1.length > 0) {
        const [existedNamHoc, existingNamHocFields1] = await pool.execute(
          "SELECT * FROM chitietbch WHERE chitietbch.IDBCH = ? and chitietbch.idnamhoc = ?",
          [existingRows1[0].IDBCH, IDNamHoc]
        );

        if (existedNamHoc.length > 0) {
          console.log("MaBCH đã tồn tại");
          return res.status(200).json({ message: "Mã cán bộ đã tồn tại" });
        } else {
          await pool.execute(
            "INSERT INTO chitietbch (IDBCH, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
            [existingRows1[0].IDBCH, IDChucVu, IDNamHoc]
          );
          return res.status(200).json({ message: "Thêm cán bộ thành công!" });
        }
      } else {
        let [resultDoanVien] = await pool.execute(
          "INSERT INTO bchtruong (IDTruong, MaBCH, TenBCH, EmailBCH, PassBCH, SoDTBCH, GioiTinhBCH, QueQuanBCH, IDDanToc, IDTonGiao, NgaySinhBCH, NgayVaoDoanBCH) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            IDTruong,
            MaBCH,
            TenBCH,
            EmailBCH,
            hashedPassword,
            SoDTBCH,
            GioiTinhBCH,
            QueQuan,
            IDDanToc,
            IDTonGiao,
            NgaySinhBCH,
            NgayVaoDoanBCH,
          ]
        );

        let IDDoanVien = resultDoanVien.insertId;

        if (filename === undefined || filename === "" || filename === null) {
          filename = "logo.jpg";
        }

        await pool.execute(
          "INSERT INTO anhbch (TenAnhBCH, IDBCH) VALUES (?, ?)",
          [filename, IDDoanVien]
        );

        await pool.execute(
          "INSERT INTO chitietbch (IDBCH, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
          [IDDoanVien, IDChucVu, IDNamHoc]
        );

        return res.status(200).json({ message: "Thêm cán bộ thành công!" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra" });
    }
  });
  router.get("/laytenBCH/:IDBCH", APIController.laytenBCH);
  router.get("/layDSChucVuBCH/:IDBCH", APIController.layDSChucVuBCH);
  router.post(
    "/CapNhatBanChapHanh",
    upload.single("file"),
    async (req, res) => {
      let {
        MaBCH,
        TenBCH,
        EmailBCH,
        SoDTBCH,
        GioiTinhBCH,
        NgaySinhBCH,
        NgayVaoDoanBCH,
        IDDanToc,
        IDTonGiao,
        IDBCH,
        listIDChucVu,
        QueQuanBCH,
      } = req.body;

      // Parse listIDChucVu into an array of numbers
      listIDChucVu = JSON.parse(listIDChucVu).map((value) =>
        value !== null ? Number(value) : null
      );

      console.log("abc===================");
      console.log(req.body);
      console.log(listIDChucVu);

      const { file } = req; // Lấy thông tin về file từ request
      let filename = file ? file.filename : undefined;
      console.log(NgaySinhBCH);

      const convertDateFormat = (dateString, originalFormat, targetFormat) => {
        return format(
          parse(dateString, originalFormat, new Date()),
          targetFormat
        );
      };

      const parsedNgaySinh = convertDateFormat(
        NgaySinhBCH,
        "dd/MM/yyyy",
        "yyyy/MM/dd"
      );

      console.log(parsedNgaySinh);
      const parsedNgayVaoDoan = convertDateFormat(
        NgayVaoDoanBCH,
        "dd/MM/yyyy",
        "yyyy/MM/dd"
      );
      console.log(parsedNgayVaoDoan);

      try {
        // Kiểm tra xem file có tồn tại không và có thay đổi không
        let filename = "";
        if (file && file.filename) {
          filename = file.filename;
        }

        // Cập nhật thông tin đoàn viên
        await pool.execute(
          "UPDATE bchtruong SET EmailBCH = ?, TenBCH = ?, MaBCH = ?, SoDTBCH = ?, QueQuanBCH = ?, GioiTinhBCH = ?, NgaySinhBCH = ?, NgayVaoDoanBCH = ?, IDDanToc = ?, IDTonGiao = ? WHERE IDBCH = ?",
          [
            EmailBCH,
            TenBCH,
            MaBCH,
            SoDTBCH,
            QueQuanBCH,
            GioiTinhBCH,
            parsedNgaySinh,
            parsedNgayVaoDoan,
            IDDanToc,
            IDTonGiao,
            IDBCH,
          ]
        );

        console.log("Update Info bchtruong");

        const [chitietnamhocRows] = await pool.execute(
          "SELECT * FROM chitietbch WHERE IDBCH = ? and ttChiTietBCH = 1",
          [IDBCH]
        );

        console.log(chitietnamhocRows);

        for (let i = 0; i < chitietnamhocRows.length; i++) {
          const chitietnamhocRow = chitietnamhocRows[i];
          console.log(chitietnamhocRow);
          const newIDChucVu = listIDChucVu[i];
          console.log(newIDChucVu);

          await pool.execute(
            "UPDATE chitietbch SET IDChucVu = ? WHERE IDChiTietBCH = ?",
            [newIDChucVu, chitietnamhocRow.IDChiTietBCH]
          );

          console.log("Update Info chitietbch");
        }

        if (file && file.filename) {
          filename = file.filename;

          // Cập nhật tên ảnh trong bảng 'anh'
          await pool.execute(
            "UPDATE anhbch SET TenAnhBCH = ? WHERE IDBCH = ?",
            [filename, IDBCH]
          );

          console.log("Update Info anh");
        }

        return res.status(200).json({
          message: "Cập nhật thành công!",
        });
      } catch (error) {
        console.log("Không cập nhật được!", error);
        return res.status(500).json({ error: "Không hiển thị được!" });
      }
    }
  );
  router.post("/searchBCHTruong", APIController.searchBCHTruong);
  router.post("/searchManyBCH", APIController.searchManyBCH);
  router.post("/ThemBCHExcel", upload1.single("file"), async (req, res) => {
    let { IDTruong, idnamhoc } = req.body;
    console.log(req.body);

    IDTruong = parseInt(IDTruong, 10); // Assuming base 10
    idnamhoc = parseInt(idnamhoc, 10); // Assuming base 10

    if (isNaN(IDTruong)) {
      console.error("Invalid IDTruong:", req.body.IDTruong);
      res.status(400).json({ message: "Invalid IDTruong" });
      return;
    }

    try {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      for (const row of data) {
        const {
          MaBCH,
          TenBCH,
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

        console.log(row);

        const trimmedMSSV = String(MaBCH).trim();
        const trimmedHoTen = String(TenBCH).trim();
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
            "SELECT * FROM chucvu WHERE chucvu.TenCV like ?",
            ["%" + trimmedChucVu + "%"]
          );

          const [existingRows1, existingFields1] = await pool.execute(
            "SELECT * FROM bchtruong WHERE bchtruong.MaBCH = ?",
            [trimmedMSSV]
          );

          if (existingRows1.length > 0) {
            const [existedNamHoc, existingNamHocFields1] = await pool.execute(
              "SELECT * FROM chitietbch WHERE chitietbch.IDBCH = ? and chitietbch.IDNamHoc = ?",
              [existingRows1[0].IDBCH, idnamhoc]
            );

            if (existedNamHoc.length > 0) {
              console.log("Nam Hoc va MSSV da ton tai");
              res.status(500).json({ message: "Nam Hoc va MSSV da ton tai" });
              continue;
            } else {
              await pool.execute(
                "INSERT INTO chitietbch (IDBCH, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
                [existingRows1[0].IDBCH, chucvu[0].IDChucVu, idnamhoc]
              );
            }
          } else {
            const password = trimmedMSSV;
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const [resultDoanVien] = await pool.execute(
              "INSERT INTO bchtruong (IDTruong, MaBCH, TenBCH, EmailBCH, PassBCH, SoDTBCH, GioiTinhBCH, QueQuanBCH, IDDanToc, IDTonGiao, NgaySinhBCH, NgayVaoDoanBCH) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                IDTruong,
                trimmedMSSV,
                trimmedHoTen,
                trimmedEmail,
                hashedPassword,
                trimmedSoDienThoai,
                GioiTinh,
                trimmedQueQuan,
                dantoc[0].IDDanToc,
                tongiao[0].IDTonGiao,
                parsedNgaySinh,
                parsedNgayVaoDoan,
              ]
            );

            let IDDoanVien = resultDoanVien.insertId;

            await pool.execute(
              "INSERT INTO chitietbch (IDBCH, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
              [IDDoanVien, chucvu[0].IDChucVu, idnamhoc]
            );

            await pool.execute(
              "INSERT INTO anhbch (TenAnhBCH, IDBCH) VALUES (?, ?)",
              ["logo.jpg", IDDoanVien]
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
  });
  router.post("/XoaBCHTruong/:IDBCH", APIController.XoaBCHTruong);
  router.post(
    "/XoaChiTietBCHTruong/:IDChiTietBCH",
    APIController.XoaChiTietBCH
  );
  router.post("/CapNhatThongTinDHCT", APIController.CapNhatThongTinDHCT);
  router.post("/doimatkhaudaihocct/:IDDHCT", APIController.DoiMatKhauDHCT);
  router.get(
    "/laytenBCHTruong/:IDBCH/:IDTruong",
    APIController.laytenBCHTruong
  );
  router.post("/doimatkhaubchtruong/:IDBCH", APIController.doimatkhaubch);
  const storageMulter = multer.diskStorage({
    destination: async (req, file, cb) => {
      const IDDoanVien = req.params.IDDoanVien;

      let [rows, fields] = await pool.execute(
        "select MSSV, MaLop from doanvien, lop where doanvien.IDDoanVien = ? and doanvien.IDLop = lop.IDLop",
        [IDDoanVien]
      );

      const MSSV = rows[0].MSSV;
      const MaLop = rows[0].MaLop;

      const dest = `./src/public/DiemDanh/${MaLop}/${MSSV}`;
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    },
  });
  const upload3 = multer({ storage: storageMulter });
  router.post(
    "/AnhDiemDanh/:IDDoanVien",
    upload3.array("file"),
    async (req, res) => {
      try {
        const files = req.files;
        const IDDoanVien = req.params.IDDoanVien;
        console.log("ID doan vien", IDDoanVien);
        await Promise.all(
          files.map((file) => {
            const filename = file.filename;
            return pool.execute(
              "INSERT INTO anhdiemdanh (DDTenAnh, IDDoanVien) VALUES (?, ?)",
              [filename, IDDoanVien]
            );
          })
        );

        res.status(200).json({ success: "Thêm ảnh thành công!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Có lỗi xảy ra" });
      }
    }
  );
  router.get("/LayAnhDiemDanh/:IDDoanVien", APIController.LayAnhDiemDanh);
 
  router.get("/TimBangMSSV/:MSSV", APIController.timbangmssv);
  router.post("/SaveIDDoanVienDiemDanhCuaLop", APIController.SaveIDDoanVienDiemDanhCuaLop);

  
  router.get(
    "/layDSHoatDongDHCT/:page/:idnamhoc",
    APIController.layDSHoatDongDHCT
  );
  router.post("/searchHoatDongDHCT", APIController.searchHoatDongDHCT);
  router.post("/searchManyInfoHDdhct", APIController.searchManyInfoHDdhct);

  router.post("/TaoHoatDongDHCT", APIController.TaoHoatDongDHCT);
  router.get("/layMotHoatDongDHCT/:IDHoatDongDHCT", APIController.layMotHoatDongDHCT);
  router.post("/CapNhatHoatDongDHCT", APIController.capNhatHoatDongDHCT);
  router.post("/XoaHoatDongDHCT/:IDHoatDongDHCT", APIController.deleteHoatDongDHCT);
  router.get(
    "/LayDSDiemDanhDHCT/:IDHoatDongDHCT/:IDNamHoc/:IDTruong",
    APIController.LayDSDiemDanhDHCT
  );
  router.post(
    "/saveCheckboxStatesDiemDanhDHCT",
    APIController.SaveCheckboxStatesDiemDanhDHCT
  );

  router.get("/layMaBCH/:MaBCH", APIController.layMaBCH);
  router.post("/SaveIDBCH", APIController.SaveIDBCH);
  
  const storageMulter1 = multer.diskStorage({
    destination: async (req, file, cb) => {
      const IDBCH = req.params.IDBCH;

      let [rows, fields] = await pool.execute(
        "select MaBCH from bchtruong where bchtruong.IDBCH = ?",
        [IDBCH]
      );

      const MaBCH = rows[0].MaBCH;

      const dest = `./src/public/DiemDanh/GiangVien/${MaBCH}`;
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    },
  });
  const upload4 = multer({ storage: storageMulter1 });
  router.post(
    "/AnhDiemDanhBCH/:IDBCH",
    upload4.array("file"),
    async (req, res) => {
      try {
        const files = req.files;
        const IDBCH = req.params.IDBCH;
        console.log("ID doan vien", IDBCH);
        await Promise.all(
          files.map((file) => {
            const filename = file.filename;
            return pool.execute(
              "INSERT INTO anhdiemdanhbch (DDTenAnhBCH, IDBCH) VALUES (?, ?)",
              [filename, IDBCH]
            );
          })
        );

        res.status(200).json({ success: "Thêm ảnh thành công!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Có lỗi xảy ra" });
      }
    }
  );
  router.post("/ThemNamHoc", APIController.ThemNamHoc);
  router.post("/XoaNamHoc/:IDNamHoc", APIController.XoaNamHoc);
  router.post("/deleteSVNT", APIController.deleteSVNT);

  return app.use("/api", router);
};

export default initAPIRoute;
