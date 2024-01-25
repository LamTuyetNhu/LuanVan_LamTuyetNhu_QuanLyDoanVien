import express from "express";
import APIController from "../controller/APIController";
let router = express.Router();
const XLSX = require("xlsx");
const multer = require("multer");
import pool from "../configs/connectDB";
const { parse, format } = require("date-fns");
import { path } from "path";
var appRoot = require("app-root-path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      const [admin] = await pool.execute(
        "SELECT * FROM admin WHERE emailAdmin = ? and passAdmin = ?",
        [email, password]
      );

      if (admin.length > 0) {
        const token = generateToken(admin[0].email, "Admin");
        return res.json({ success: true, token });
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
          return res.json({ IDDoanVien: doanvien[0].IDDoanVien, success: true, token });
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
  router.get("/dschidoan/:page", APIController.getAllChiDoan);
  router.get("/dskhoa", APIController.getKhoa);
  router.post("/searchChiDoan", APIController.getSearchChiDoan);
  router.post("/ThemChiDoan", APIController.ThemChiDoan);
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

      if (existingRows1.length > 0) {
        const [existedNamHoc, existingNamHocFields1] = await pool.execute(
          "SELECT * FROM chitietnamhoc WHERE chitietnamhoc.IDDoanVien = ? and chitietnamhoc.idnamhoc = ?",
          [existingRows1[0].IDDoanVien, IDNamHoc]
        );

        if (existedNamHoc.length > 0) {
          console.log("Nam Hoc va MSSV da ton tai");
          res.status(500).json({ message: "Nam Hoc va MSSV da ton tai" });
          return;
        } else {
          await pool.execute(
            "INSERT INTO chitietnamhoc (IDDoanVien, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
            [existingRows1[0].IDDoanVien, IDChucVu, IDNamHoc]
          );
        }
      } else {
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
          "INSERT INTO chitietnamhoc (IDDoanVien, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
          [IDDoanVien, IDChucVu, IDNamHoc]
        );

        res.status(200).json({ message: "Thêm đoàn viên thành công!" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra" });
    }
  });

  router.post("/CapNhatDoanVien", upload.single("file"), async (req, res) => {
    let {
      Email,
      HoTen,
      MSSV,
      SoDT,
      QueQuan,
      GioiTinh,
      NgaySinh,
      NgayVaoDoan,
      IDDanToc,
      IDTonGiao,
      IDChucVu,
      IDNamHoc,
      IDChiTietNamHoc,
      IDDoanVien,
    } = req.body;

    console.log(req.body);
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

      // Cập nhật thông tin chi tiết năm học
      await pool.execute(
        "UPDATE chitietnamhoc SET IDChucVu = ?, IDNamHoc = ? WHERE IDChiTietNamHoc = ?",
        [IDChucVu, IDNamHoc, IDChiTietNamHoc]
      );

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
  router.get(
    "/laymotdoanvien/:IDLop/:IDDoanVien/:IDChiTietNamHoc",
    APIController.laymotdoanvien
  );
  router.post("/XoaDoanVien/:IDChiTietNamHoc", APIController.deleteDoanVien);

  router.get("/layDSHoatDong/:page/:idnamhoc", APIController.layDSHoatDong);
  router.post("/searchHoatDong", APIController.searchHoatDong);
  router.post("/TaoHoatDong", APIController.TaoHoatDong);
  router.get("/layMotHoatDong/:IDHoatDong", APIController.layMotHoatDong);
  router.post("/CapNhatHoatDong", APIController.capNhatHoatDong);
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

      // Parse IDLop to an integer
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

              // try {

              //   if (existedNamHoc.length == 0) {
              //     await pool.execute(
              //       "INSERT INTO chitietnamhoc (IDDoanVien, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
              //       [existingRows1[0].IDDoanVien, chucvu[0].IDChucVu, idnamhoc]
              //     );

              //   }
              // } catch (error) {
              //   console.error(error);
              //   res.status(500).json({ message: "Có lỗi xảy ra" });
              //   return;
              // }

              if (existedNamHoc.length > 0) {
                console.log("Nam Hoc va MSSV da ton tai");
                res.status(500).json({ message: "Nam Hoc va MSSV da ton tai" });
                return;
              } else {
                await pool.execute(
                  "INSERT INTO chitietnamhoc (IDDoanVien, IDChucVu, IDNamHoc) VALUES (?, ?, ?)",
                  [existingRows1[0].IDDoanVien, chucvu[0].IDChucVu, idnamhoc]
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

  router.get("/dsBCH/:page/:idnamhoc", APIController.getBCH);
  router.post("/searchBCH", APIController.getSearchBCH);
  router.post("/XoaBanChapHanh/:select", APIController.deleteBanChapHanh);

  router.get("/namhoc", APIController.namhoc);
  router.get("/namhoccuamotchidoan/:IDLop", APIController.namhoccuamotchidoan);

  router.post("/searchNamHoc", APIController.searchNamHoc);

  router.get("/dsdoanphi/:page/:idnamhoc", APIController.layDSDoanPhi);
  router.post("/XoaMotDoanPhi/:IDDoanPhi", APIController.XoaDoanPhi);
  router.post("/ThemDoanPhi", APIController.ThemDoanPhi);
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
    "/dsdoanphi/:idLop/:idnamhoc",
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

  return app.use("/api", router);
};

export default initAPIRoute;