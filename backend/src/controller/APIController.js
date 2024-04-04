import bodyParser from "body-parser";
import pool from "../configs/connectDB";
const XLSX = require("xlsx");
const { parse, format } = require("date-fns");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
//Lấy danh sách chi đoàn
let getAllChiDoan = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5

    const offset = (page - 1) * pageSize;
    const khoa = req.params.khoa; // Lấy trang từ query parameters, mặc định là trang 1

    const [sotrang, fields1] = await pool.execute(
      "SELECT * FROM lop where (lop.ttLop = 0 or lop.ttLop = 1) and Khoa = ?",
      [khoa]
    );

    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop where (lop.ttLop = 0 or lop.ttLop = 1) and Khoa = ? ORDER BY MaLop ASC LIMIT ? OFFSET ?",
      [khoa, pageSize, offset]
    );
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCD: rows,
        totalPages: Math.ceil(sotrang.length / pageSize),
        currentPage: page,
      });
    } else {
      return res.status(200).json({
        dataCD: [],
        totalPages: 0,
        currentPage: 1,
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let laytenlop = async (req, res) => {
  const IDLop = req.params.IDLop;

  try {
    const [rows, fields1] = await pool.execute(
      "SELECT * FROM lop where IDLop = ?",
      [IDLop]
    );

    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCD: rows[0],
      });
    } else {
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

//Tìm kiếm chi đoàn theo tên và mã lớp
let getSearchChiDoan = async (req, res) => {
  let { IDTruong, MaLop, TenLop, Khoa, ttLop } = req.body;

  try {
    if (MaLop !== undefined && TenLop === "" && ttLop === "") {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM lop where Khoa = ? and MaLop LIKE ? and IDTruong = ? and ttLop != 2",
        [Khoa, "%" + MaLop + "%", IDTruong]
      );

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else if (MaLop === "" && TenLop !== undefined && ttLop === "") {
      const [rowsTenLop, fields] = await pool.execute(
        "SELECT * FROM lop where Khoa = ? and TenLop LIKE ? and IDTruong = ? and ttLop != 2",
        [Khoa, "%" + TenLop + "%", IDTruong]
      );

      return res.status(200).json({
        dataCD: rowsTenLop,
      });
    } else if (MaLop === "" && TenLop === "" && ttLop !== undefined) {
      const [rowsTrangThai, fields] = await pool.execute(
        "SELECT * FROM lop where Khoa = ? and ttLop = ? and IDTruong = ? and ttLop != 2",
        [Khoa, ttLop, IDTruong]
      );

      return res.status(200).json({
        dataCD: rowsTrangThai,
      });
    } else if (MaLop !== undefined && TenLop !== undefined && ttLop === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where Khoa = ? and (TenLop LIKE ? and MaLop LIKE ?) and IDTruong = ? and ttLop != 2",
        [Khoa, "%" + TenLop + "%", "%" + MaLop + "%", IDTruong]
      );

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MaLop !== undefined && TenLop === "" && ttLop !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where Khoa = ? and (ttLop = ?  and ttLop != 2 and MaLop LIKE ?) and IDTruong = ?",
        [Khoa, ttLop, "%" + MaLop + "%", IDTruong]
      );

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MaLop === "" && TenLop !== undefined && ttLop !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where Khoa = ? and (ttLop = ? and TenLop LIKE ?) and IDTruong = ?  and ttLop != 2",
        [Khoa, ttLop, "%" + TenLop + "%", IDTruong]
      );

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop !== undefined &&
      TenLop !== undefined &&
      ttLop !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where Khoa = ? and (ttLop = ? and TenLop LIKE ? and MaLop LIKE ?) and IDTruong = ? and ttLop != 2",
        [Khoa, ttLop, "%" + TenLop + "%", "%" + MaLop + "%", IDTruong]
      );

      return res.status(200).json({
        dataCD: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let getSearchManyChiDoan = async (req, res) => {
  let { trimmedInfo, IDTruong } = req.body;
  console.log(req.body);
  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM lop where (MaLop LIKE ? or TenLop LIKE ? or Khoa = ?) and IDTruong = ? and ttLop != 2",
        [
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          trimmedInfo,
          IDTruong,
        ]
      );

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let ThemChiDoan = async (req, res) => {
  let { MaLop, TenLop, Khoa, Email } = req.body;
  let IDTruong = req.params.IDTruong;
  try {
    const passLop = MaLop;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passLop, saltRounds);

    let [rows, fields] = await pool.execute(
      "insert into lop(MaLop, TenLop, Khoa, EmailLop, PassLop, IDTruong) values (?, ?, ?, ?, ?, ?)",
      [MaLop, TenLop, Khoa, Email, hashedPassword, IDTruong]
    );

    return res.status(200).json({
      dataCD: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let CapNhatChiDoan = async (req, res) => {
  let { IDLop, MaLop, TenLop, Khoa, EmailLop, ttLop } = req.body;

  try {
    let [rows, fields] = await pool.execute(
      "update lop set MaLop = ?, TenLop = ?, Khoa = ?, EmailLop = ?, ttLop = ? where IDLop = ?",
      [MaLop, TenLop, Khoa, EmailLop, ttLop, IDLop]
    );

    return res.status(200).json({
      dataCD: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let XoaChiDoan = async (req, res) => {
  let IDLop = req.params.selectedIDLop;
  try {
    await pool.execute("update lop set lop.ttLop = 2 where lop.IDLop = ?", [
      IDLop,
    ]);

    console.log("Xoa thanh cong");

    return res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

//Lấy danh sách của một chi đoàn
let getDetailChiDoan = async (req, res) => {
  try {
    const IDLop = req.params.IDLop;
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5
    const IDNamHoc = req.params.idnamhoc;

    const offset = (page - 1) * pageSize;

    const [sotrang, fields] = await pool.execute(
      "SELECT lop.*, doanvien.*, chucvu.*, namhoc.*, chitietnamhoc.*, tongiao.*, dantoc.*  FROM lop, doanvien, chucvu, namhoc, chitietnamhoc, tongiao, dantoc where doanvien.IDLop = ? and doanvien.ttDoanVien = 1 and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = chitietnamhoc.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and chitietnamhoc.IDNamHoc = ? and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.ttChiTietNH = 1",
      [IDLop, IDNamHoc]
    );

    const [rows, fields1] = await Promise.all([
      pool.execute(
        "SELECT lop.*, doanvien.*, chucvu.*, namhoc.*, chitietnamhoc.*, tongiao.*, dantoc.* FROM lop, doanvien, chucvu, namhoc, chitietnamhoc, tongiao, dantoc where doanvien.IDLop = ? and doanvien.ttDoanVien = 1 and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = chitietnamhoc.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and chitietnamhoc.IDNamHoc = ? and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.ttChiTietNH = 1 ORDER BY doanvien.MSSV LIMIT ? OFFSET ?",
        [IDLop, IDNamHoc, pageSize, offset]
      ),

      pool.execute(
        "SELECT lop.*, doanvien.*, chucvu.*, namhoc.*, chitietnamhoc.*, tongiao.*, dantoc.* FROM lop, doanvien, chucvu, namhoc, chitietnamhoc, tongiao, dantoc where doanvien.IDLop = ? and doanvien.ttDoanVien = 1 and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = chitietnamhoc.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and chitietnamhoc.IDNamHoc = ? and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao ORDER BY doanvien.MSSV LIMIT ? OFFSET ?",
        [IDLop, IDNamHoc, pageSize, offset]
      ),
    ]);

    return res.status(200).json({
      dataCD: rows[0],
      totalPages: Math.ceil(sotrang.length / pageSize),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let laymotchidoan = async (req, res) => {
  const IDLop = req.params.IDLop;
  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop where lop.IDLop = ?",

      [IDLop]
    );

    return res.status(200).json({
      dataCD: rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

//Lấy danh sách khóa
let getKhoa = async (req, res) => {
  try {
    const [rows, fields] = await pool.execute("SELECT distinct khoa FROM lop");

    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCD: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let laymotdoanvien = async (req, res) => {
  const IDDoanVien = req.params.IDDoanVien;
  const IDLop = req.params.IDLop;

  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc, lop, anh where lop.IDLop = ? and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = ? and doanvien.ttDoanVien = 1 and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and namhoc.IDNamHoc = chitietnamhoc.IDNamHoc and chitietnamhoc.IDChucVu = chucvu.IDChucVu and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.IDDoanVien = anh.IDDoanVien",

      [IDLop, IDDoanVien]
    );

    console.log(rows);

    if (rows.length > 0) {
      // Định dạng lại ngày trong rows[0].NgayHetHan
      const formattedDate = format(new Date(rows[0].NgaySinh), "dd/MM/yyyy");
      const formattedDate1 = format(
        new Date(rows[0].NgayVaoDoan),
        "dd/MM/yyyy"
      );

      // Gán lại giá trị đã định dạng vào rows[0].NgayHetHan
      rows[0].NgaySinh = formattedDate;
      rows[0].NgayVaoDoan = formattedDate1;
    }

    return res.status(200).json({
      dataDV: rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let deleteDoanVien = async (req, res) => {
  let IDDoanVien = req.params.IDDoanVien;

  try {
    await pool.execute(
      "Update doanvien set ttDoanVien = 0 where IDDoanVien = ?",
      [IDDoanVien]
    );

    console.log("Xoa thanh cong");
    return res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let XoaChiTietDoanVien = async (req, res) => {
  let IDChiTietNamHoc = req.params.IDChiTietNamHoc;
  let IDDanhGia = req.params.IDDanhGia;

  try {
    await pool.execute(
      "Update chitietnamhoc set ttChiTietNH = 0 where IDChiTietNamHoc = ?",
      [IDChiTietNamHoc]
    );

    await pool.execute(
      "Update danhgiadoanvien set ttPhanLoai = 0 where IDDanhGia = ?",
      [IDDanhGia]
    );

    console.log("Xoa thanh cong");
    return res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let getBCH = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 4; // Lấy số lượng mục trên mỗi trang, mặc định là 5
    const idnamhoc = req.params.idnamhoc;
    const khoa = req.params.khoa;
    const IDTruong = req.params.IDTruong;

    const offset = (page - 1) * pageSize;
    console.log("+==============");

    console.log(idnamhoc);

    const [sotrang, fields1] = await pool.execute(
      "SELECT * FROM lop, anh, doanvien, chitietnamhoc, namhoc, chucvu, dantoc, tongiao where lop.IDLop = doanvien.IDLop and doanvien.ttDoanVien = 1 and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and (chucvu.IDChucVu = 1 or chucvu.IDChucVu = 2 or chucvu.IDChucVu = 4 or chucvu.IDChucVu = 5 or chucvu.IDChucVu = 6 or chucvu.IDChucVu = 7) and doanvien.IDDOanVien = anh.IDDoanVien and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ? and lop.IDTruong = ?",
      [idnamhoc, khoa, IDTruong]
    );

    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop, anh, doanvien, chitietnamhoc, namhoc, chucvu, dantoc, tongiao where lop.IDLop = doanvien.IDLop and doanvien.ttDoanVien = 1 and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and (chucvu.IDChucVu = 1 or chucvu.IDChucVu = 2 or chucvu.IDChucVu = 4 or chucvu.IDChucVu = 5 or chucvu.IDChucVu = 6 or chucvu.IDChucVu = 7) and doanvien.IDDOanVien = anh.IDDoanVien and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ? and lop.IDTruong = ? ORDER BY doanvien.MSSV ASC LIMIT ? OFFSET ?",
      [idnamhoc, khoa, IDTruong, pageSize, offset]
    );

    console.log(rows);
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCD: rows,
        totalPages: Math.ceil(sotrang.length / pageSize),
        currentPage: page,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let getBCHMotLop = async (req, res) => {
  try {
    const IDLop = req.params.IDLop;
    const idnamhoc = req.params.idnamhoc;

    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop, anh, doanvien, chitietnamhoc, namhoc, chucvu, dantoc, tongiao where lop.IDLop = doanvien.IDLop and doanvien.ttDoanVien = 1 and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and (chucvu.IDChucVu = 1 or chucvu.IDChucVu = 2 or chucvu.IDChucVu = 4 or chucvu.IDChucVu = 5 or chucvu.IDChucVu = 6 or chucvu.IDChucVu = 7) and doanvien.IDDOanVien = anh.IDDoanVien and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and lop.IDLop = ? ORDER BY doanvien.MSSV ASC",
      [idnamhoc, IDLop]
    );

    console.log(rows);

    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCD: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let getSearchBCH = async (req, res) => {
  let { IDNamHoc, MSSV, HoTen, IDChucVu, Khoa, IDTruong } = req.body;
  console.log(req.body);
  console.log(IDNamHoc);
  console.log(MSSV);
  console.log(HoTen);
  console.log(IDChucVu);
  console.log(Khoa);

  try {
    if (MSSV !== undefined && HoTen === "" && IDChucVu === "") {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu != 3  and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ? and lop.IDTruong = ?",
        ["%" + MSSV + "%", IDNamHoc, Khoa, IDTruong]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else if (MSSV === "" && HoTen !== undefined && IDChucVu === "") {
      const [rowsTenLop, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ? and lop.IDTruong = ?",

        ["%" + HoTen + "%", IDNamHoc, Khoa, IDTruong]
      );

      console.log(rowsTenLop);

      return res.status(200).json({
        dataCD: rowsTenLop,
      });
    } else if (MSSV === "" && HoTen === "" && IDChucVu !== undefined) {
      const [rowsKhoa, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDChucVu = ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ? and lop.IDTruong = ?",

        [IDChucVu, IDNamHoc, Khoa, IDTruong]
      );

      console.log(rowsKhoa);

      return res.status(200).json({
        dataCD: rowsKhoa,
      });
    } else if (MSSV !== undefined && HoTen !== undefined && IDChucVu === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ? and lop.IDTruong = ?",

        ["%" + MSSV + "%", "%" + HoTen + "%", IDNamHoc, Khoa, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MSSV !== undefined && HoTen === "" && IDChucVu !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu LIKE ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ? and lop.IDTruong = ?",

        ["%" + MSSV + "%", "%" + IDChucVu + "%", IDNamHoc, Khoa, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MSSV === "" && HoTen !== undefined && IDChucVu !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ? and lop.IDTruong = ?",

        ["%" + HoTen + "%", IDChucVu, IDNamHoc, Khoa, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      IDChucVu !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ? and lop.IDTruong = ?",

        [
          "%" + MSSV + "%",
          "%" + HoTen + "%",
          IDChucVu,
          IDNamHoc,
          Khoa,
          IDTruong,
        ]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let searchManyDoanVienBCH = async (req, res) => {
  let { Khoa, trimmedInfo, IDNamHoc, IDTruong } = req.body;
  console.log(req.body);
  console.log(IDNamHoc);
  console.log(trimmedInfo);
  console.log(Khoa);

  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and (doanvien.MSSV LIKE ? or doanvien.HoTen LIKE ? or chucvu.TenCV LIKE ?) and chucvu.IDChucVu != 3  and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ? and lop.IDTruong = ?",
        [
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          IDNamHoc,
          Khoa,
          IDTruong,
        ]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let deleteBanChapHanh = async (req, res) => {
  let IDChiTietNamHoc = req.params.select;
  console.log(IDChiTietNamHoc);
  try {
    await pool.execute(
      //  "update doanvien, chitietnamhoc set chitietnamhoc.IDChucVu = 3 where doanvien.MSSV = ? and doanvien.IDDoanVien = chitietnamhoc.IDDoanVien",
      // [IDDoanVien]

      "DELETE FROM chitietnamhoc WHERE IDChiTietNamHoc = ?",
      [IDChiTietNamHoc]
    );

    console.log("Xoa thanh cong");
    return res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

//Lất tất cả chức vụ
let getChucVu = async (req, res) => {
  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM chucvu ORDER BY TenCV ASC "
    );
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCV: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let getSearchDoanVien = async (req, res) => {
  let { IDLop, MSSV, HoTen, IDChucVu, IDNamHoc } = req.body;
  console.log(IDLop);
  console.log(MSSV);
  console.log(HoTen);
  console.log(IDChucVu);
  console.log(IDNamHoc);

  try {
    if (MSSV !== undefined && HoTen === "" && IDChucVu === "") {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and doanvien.MSSV LIKE ? and doanvien.ttDoanVien = 1",
        [IDLop, IDNamHoc, "%" + MSSV + "%"]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else if (MSSV === "" && HoTen !== undefined && IDChucVu === "") {
      const [rowsTenLop, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and doanvien.HoTen LIKE ? and doanvien.ttDoanVien = 1",

        [IDLop, IDNamHoc, "%" + HoTen + "%"]
      );

      console.log(rowsTenLop);

      return res.status(200).json({
        dataCD: rowsTenLop,
      });
    } else if (MSSV === "" && HoTen === "" && IDChucVu !== undefined) {
      const [rowsKhoa, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and chucvu.IDChucVu LIKE ? and doanvien.ttDoanVien = 1",

        [IDLop, IDNamHoc, "%" + IDChucVu + "%"]
      );

      console.log(rowsKhoa);

      return res.status(200).json({
        dataCD: rowsKhoa,
      });
    } else if (MSSV !== undefined && HoTen !== undefined && IDChucVu === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chitietnamhoc.IDNamHoc = ? and doanvien.ttDoanVien = 1",

        [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MSSV !== undefined && HoTen === "" && IDChucVu !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu LIKE ? and chitietnamhoc.IDNamHoc = ? and doanvien.ttDoanVien = 1",

        [IDLop, "%" + MSSV + "%", "%" + IDChucVu + "%", IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MSSV === "" && HoTen !== undefined && IDChucVu !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and chitietnamhoc.IDNamHoc = ? and doanvien.ttDoanVien = 1",

        [IDLop, "%" + HoTen + "%", IDChucVu, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      IDChucVu !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and chitietnamhoc.IDNamHoc = ? and doanvien.ttDoanVien = 1",

        [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", IDChucVu, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let getSearchDGDoanVien = async (req, res) => {
  let { IDLop, MSSV, HoTen, PhanLoai, IDNamHoc } = req.body;
  console.log(IDLop);
  console.log(MSSV);
  console.log(HoTen);
  console.log(PhanLoai);
  console.log(IDNamHoc);

  try {
    if (MSSV !== undefined && HoTen === "" && PhanLoai === "") {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM doanvien, danhgiadoanvien where doanvien.IDLop = ? and danhgiadoanvien.IDDoanVien = doanvien.IDDoanVien and danhgiadoanvien.IDNamHoc = ? and doanvien.MSSV LIKE ?",
        [IDLop, IDNamHoc, "%" + MSSV + "%"]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
      and;
    } else if (MSSV === "" && HoTen !== undefined && PhanLoai === "") {
      const [rowsTenLop, fields] = await pool.execute(
        "SELECT * FROM doanvien, danhgiadoanvien where doanvien.IDLop = ? and danhgiadoanvien.IDDoanVien = doanvien.IDDoanVien and danhgiadoanvien.IDNamHoc = ? and doanvien.HoTen LIKE ?",

        [IDLop, IDNamHoc, "%" + HoTen + "%"]
      );

      console.log(rowsTenLop);

      return res.status(200).json({
        dataCD: rowsTenLop,
      });
    } else if (MSSV === "" && HoTen === "" && PhanLoai !== undefined) {
      const [rowsKhoa, fields] = await pool.execute(
        "SELECT * FROM doanvien, danhgiadoanvien where doanvien.IDLop = ? and danhgiadoanvien.IDDoanVien = doanvien.IDDoanVien and danhgiadoanvien.IDNamHoc = ? and danhgiadoanvien.PhanLoai LIKE ?",

        [IDLop, IDNamHoc, PhanLoai]
      );

      console.log(rowsKhoa);

      return res.status(200).json({
        dataCD: rowsKhoa,
      });
    } else if (MSSV !== undefined && HoTen !== undefined && PhanLoai === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM doanvien, danhgiadoanvien where doanvien.IDLop = ? and danhgiadoanvien.IDDoanVien = doanvien.IDDoanVien and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and danhgiadoanvien.IDNamHoc = ?",

        [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MSSV !== undefined && HoTen === "" && PhanLoai !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM doanvien, danhgiadoanvien where doanvien.IDLop = ? and danhgiadoanvien.IDDoanVien = doanvien.IDDoanVien and doanvien.MSSV LIKE ? and danhgiadoanvien.PhanLoai = ? and danhgiadoanvien.IDNamHoc = ?",

        [IDLop, "%" + MSSV + "%", PhanLoai, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MSSV === "" && HoTen !== undefined && PhanLoai !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM doanvien, danhgiadoanvien where doanvien.IDLop = ? and danhgiadoanvien.IDDoanVien = doanvien.IDDoanVien and doanvien.HoTen LIKE ? and danhgiadoanvien.PhanLoai = ? and danhgiadoanvien.IDNamHoc = ?",

        [IDLop, "%" + HoTen + "%", PhanLoai, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      PhanLoai !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM doanvien, danhgiadoanvien where doanvien.IDLop = ? and danhgiadoanvien.IDDoanVien = doanvien.IDDoanVien and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and danhgiadoanvien.PhanLoai = ? and danhgiadoanvien.IDNamHoc = ?",

        [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", PhanLoai, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let getSearchManyDoanVien = async (req, res) => {
  let { IDNamHoc, trimmedInfo, IDLop } = req.body;
  console.log(trimmedInfo);

  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM doanvien, danhgiadoanvien where doanvien.IDLop = ? and danhgiadoanvien.IDDoanVien = doanvien.IDDoanVien and (doanvien.MSSV LIKE ? or doanvien.HoTen LIKE ? or danhgiadoanvien.PhanLoai = ?) and danhgiadoanvien.IDNamHoc = ?",

        [
          IDLop,
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          IDNamHoc,
        ]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

//Lấy danh sách hoạt động
let layDSHoatDong = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5
    const IDNamHoc = req.params.idnamhoc;
    const IDTruong = req.params.IDTruong;

    const offset = (page - 1) * pageSize;

    const [sotrang, fields] = await pool.execute(
      "SELECT * FROM hoatdong where (ttHD = 0 or ttHD = 1 or ttHD = 2) and idnamhoc = ? and IDTruong = ?",
      [IDNamHoc, IDTruong]
    );

    const [result1, result2] = await Promise.all([
      pool.execute(
        "UPDATE hoatdong SET ttHD = CASE WHEN ttHD = 3 THEN 3 WHEN NgayBanHanh > CURRENT_DATE THEN 0 WHEN NgayBanHanh <= CURRENT_DATE AND NgayHetHan > CURRENT_DATE THEN 1 WHEN NgayHetHan < CURRENT_DATE THEN 2 END"
      ),
      pool.execute(
        "SELECT * FROM hoatdong where (ttHD = 0 or ttHD = 1 or ttHD = 2) and idnamhoc = ? and IDTruong = ? LIMIT ? OFFSET ?",
        [IDNamHoc, IDTruong, pageSize, offset]
      ),
    ]);

    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataHD: result2[0],
        totalPages: Math.ceil(sotrang.length / pageSize),
        currentPage: page,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataHD: [],
        totalPages: 0,
        currentPage: 1,
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let layMotHoatDong = async (req, res) => {
  try {
    const IDHoatDong = req.params.IDHoatDong;

    const [rows, result2] = await pool.execute(
      "SELECT * FROM hoatdong where IDHoatDong = ?",
      [IDHoatDong]
    );

    if (rows.length > 0) {
      // Định dạng lại ngày trong rows[0].NgayHetHan
      const formattedDate = format(new Date(rows[0].NgayBanHanh), "dd/MM/yyyy");
      const formattedDate1 = format(new Date(rows[0].NgayHetHan), "dd/MM/yyyy");

      // Gán lại giá trị đã định dạng vào rows[0].NgayHetHan
      rows[0].NgayBanHanh = formattedDate;
      rows[0].NgayHetHan = formattedDate1;
    }

    console.log(rows);

    return res.status(200).json({
      dataHD: rows[0],
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let capNhatHoatDong = async (req, res) => {
  try {
    const { IDHoatDong, TenHoatDong, NgayBanHanh, NgayHetHan, ChiTietHD } =
      req.body;

    if (!TenHoatDong || !NgayBanHanh || !NgayHetHan || !ChiTietHD) {
      return res.status(400).json({
        error: "Vui lòng cung cấp đầy đủ thông tin để cập nhật hoạt động.",
      });
    }

    const parsedNgayBatDau = format(
      parse(NgayBanHanh, "dd/MM/yyyy", new Date()),
      "yyyy/MM/dd"
    );
    const parsedNgayHetHan = format(
      parse(NgayHetHan, "dd/MM/yyyy", new Date()),
      "yyyy/MM/dd"
    );

    // Thực hiện truy vấn cập nhật
    const updateQuery =
      "UPDATE hoatdong SET TenHoatDong=?, NgayBanHanh=?, NgayHetHan=?, ChiTietHD = ? WHERE IDHoatDong=?";
    const [result] = await pool.execute(updateQuery, [
      TenHoatDong,
      parsedNgayBatDau,
      parsedNgayHetHan,
      ChiTietHD,
      IDHoatDong,
    ]);

    console.log(result);

    // Kiểm tra xem có bản ghi nào được cập nhật hay không
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Không tìm thấy hoạt động để cập nhật.",
      });
    }

    // Lấy thông tin hoạt động sau khi cập nhật
    return res.status(200).json({
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật hoạt động: ", error);
    return res.status(500).json({
      error: "Lỗi khi cập nhật hoạt động",
    });
  }
};

/* Tìm kiếm hoạt động */
let searchHoatDong = async (req, res) => {
  let { TenHoatDong, Thang, ttHD, IDNamHoc, IDTruong } = req.body;
  console.log(req.body);
  console.log(TenHoatDong);
  console.log(Thang);
  console.log(ttHD);

  try {
    if (TenHoatDong !== undefined && Thang === "" && ttHD === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdong where hoatdong.TenHoatDong LIKE ? and ttHD != 3 and hoatdong.IDNamHoc = ? and hoatdong.IDTruong = ?",
        ["%" + TenHoatDong + "%", IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (TenHoatDong == "" && Thang !== undefined && ttHD === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdong where MONTH(hoatdong.NgayBanHanh) = ? and hoatdong.IDNamHoc = ? and hoatdong.IDTruong = ?",
        [Thang, IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (TenHoatDong == "" && Thang === "" && ttHD !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdong where hoatdong.ttHD = ? and hoatdong.IDNamHoc = ? and hoatdong.IDTruong = ?",
        [ttHD, IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (
      TenHoatDong !== undefined &&
      Thang !== undefined &&
      ttHD === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdong where hoatdong.TenHoatDong LIKE ? and MONTH(hoatdong.NgayBanHanh) = ? and hoatdong.IDNamHoc = ? and hoatdong.IDTruong = ?",
        ["%" + TenHoatDong + "%", Thang, IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (
      TenHoatDong !== undefined &&
      Thang === "" &&
      ttHD !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdong where hoatdong.TenHoatDong LIKE ? and hoatdong.ttHD = ? and hoatdong.IDNamHoc = ? and hoatdong.IDTruong = ?",
        ["%" + TenHoatDong + "%", ttHD, IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (
      TenHoatDong === "" &&
      Thang !== undefined &&
      ttHD !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdong where MONTH(hoatdong.NgayBanHanh) = ? and hoatdong.ttHD = ? and hoatdong.IDNamHoc = ? and hoatdong.IDTruong = ?",
        [Thang, ttHD, IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (
      TenHoatDong !== undefined &&
      Thang !== undefined &&
      ttHD !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdong where hoatdong.TenHoatDong LIKE ? and MONTH(hoatdong.NgayBanHanh) = ? and hoatdong.ttHD = ? and hoatdong.IDNamHoc = ? and hoatdong.IDTruong = ?",
        ["%" + TenHoatDong + "%", Thang, ttHD, IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let getSearchManyHoatDong = async (req, res) => {
  console.log(req.body);

  let { trimmedInfo, IDNamHoc, IDTruong } = req.body;
  console.log(trimmedInfo);

  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM hoatdong where TenHoatDong LIKE ? and IDNamHoc = ? and IDTruong = ?",
        ["%" + trimmedInfo + "%", IDNamHoc, IDTruong]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataHD: rowsMaLop,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataHD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

// Thêm hoạt động
let TaoHoatDong = async (req, res) => {
  let {
    TenHoatDong,
    NgayBatDau,
    NgayHetHan,
    ChiTietHoatDong,
    IDNamHoc,
    IDTruong,
  } = req.body;

  try {
    let [rows, fields] = await pool.execute(
      "insert into hoatdong(TenHoatDong, NgayTao, NgayBanHanh, NgayHetHan, ChiTietHD, IDNamHoc, IDTruong) values (?, NOW(), ?, ?, ?, ?, ?)",
      [TenHoatDong, NgayBatDau, NgayHetHan, ChiTietHoatDong, IDNamHoc, IDTruong]
    );

    console.log("1");

    pool.execute(
      "UPDATE hoatdong SET ttHD = CASE WHEN ttHD = 3 THEN 3 WHEN NgayBanHanh > CURRENT_DATE THEN 0 WHEN NgayBanHanh <= CURRENT_DATE AND NgayHetHan > CURRENT_DATE THEN 1 WHEN NgayHetHan < CURRENT_DATE THEN 2 END"
    );

    console.log("2");

    const [newHoatDong] = await pool.execute(
      "SELECT * FROM hoatdong WHERE idhoatdong = ?",
      [rows.insertId]
    );

    console.log("3");

    let [tatcalop, fields2] = await pool.execute(
      "SELECT * FROM lop where ttLop = 1 and IDTruong = ?",
      [IDTruong]
    );

    console.log("4");

    console.log(tatcalop);

    for (const lop of tatcalop) {
      await pool.execute(
        "INSERT INTO diemdanhhoatdong(IDHoatDong, IDLop) VALUES (?, ?)",
        [newHoatDong[0].IDHoatDong, lop.IDLop]
      );

      let [tatcadoanvien, fields3] = await pool.execute(
        "SELECT * FROM doanvien where ttDoanVien = 1 and IDLop = ?",
        [lop.IDLop]
      );

      for (const doanvien of tatcadoanvien) {
        await pool.execute(
          "INSERT INTO diemdanhdoanvien(IDDoanVien, IDHoatDong) VALUES (?, ?)",
          [doanvien.IDDoanVien, newHoatDong[0].IDHoatDong]
        );
      }
    }

    return res.status(200).json({
      dataHD: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let deleteHoatDong = async (req, res) => {
  let IDHoatDong = req.params.IDHoatDong;
  console.log(IDHoatDong);
  await pool.execute("update hoatdong set ttHD = 3 where IDHoatDong = ?", [
    IDHoatDong,
  ]);

  console.log("Xoas thanhf cong 1");
  return res.status(200).json({
    message: "Xóa thành công!",
  });
};

let LayDSDiemDanh = async (req, res) => {
  try {
    const IDHoatDong = req.params.IDHoatDong;
    const IDNamHoc = req.params.IDNamHoc;

    // Modify your SQL query in LayDSNopDoanPhi function
    const [rows, result2] = await pool.execute(
      "SELECT diemdanhhoatdong.IDDiemDanh, lop.IDLop, lop.MaLop, lop.TenLop, lop.Khoa, hoatdong.TenHoatDong, diemdanhhoatdong.DiemDanh, namhoc.tennamhoc " +
        "FROM hoatdong " +
        "JOIN diemdanhhoatdong ON hoatdong.IDHoatDong = diemdanhhoatdong.IDHoatDong " +
        "JOIN lop ON diemdanhhoatdong.IDLop = lop.IDLop " +
        "JOIN namhoc ON hoatdong.IDNamHoc = namhoc.IDNamHoc " +
        "LEFT JOIN doanvien ON lop.IDLop = doanvien.IDLop " +
        "LEFT JOIN chitietnamhoc ON doanvien.IDDoanVien = chitietnamhoc.IDDoanVien AND namhoc.IDNamHoc = chitietnamhoc.IDNamHoc " +
        "WHERE hoatdong.IDHoatDong = ? and chitietnamhoc.IDNamHoc = ? " +
        "GROUP BY diemdanhhoatdong.IDDiemDanh, hoatdong.IDHoatDong, lop.IDLop " +
        "ORDER BY lop.MaLop",
      [IDHoatDong, IDNamHoc]
    );

    return res.status(200).json({
      TenHoatDong: rows[0].TenHoatDong,
      TenNamHoc: rows[0].tennamhoc,
      ChiTietHD: rows.map((row) => ({
        IDDiemDanh: row.IDDiemDanh,
        IDLop: row.IDLop,
        MaLop: row.MaLop,
        TenLop: row.TenLop,
        Khoa: row.Khoa,
        Check: row.DiemDanh,
      })),
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let SaveCheckboxStatesDiemDanh = async (req, res) => {
  let { IDHoatDong, checkboxStates } = req.body;

  console.log(req.body);
  console.log("+=============");
  console.log(checkboxStates);

  try {
    // Assuming checkboxStates is an array of objects with IDChiTietDoanPhi and isChecked
    for (let { IDDiemDanh, isChecked } of checkboxStates) {
      if (isChecked == false) {
        isChecked = 0;
      } else {
        isChecked = 1;
      }
      console.log(isChecked);
      await pool.execute(
        "UPDATE diemdanhhoatdong SET diemdanh = ? WHERE IDDiemDanh = ? and IDHoatDong = ?",
        [isChecked, IDDiemDanh, IDHoatDong]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    console.error("Error updating checkbox states:", error);
    return res.status(500).json({ message: "Cập nhật thành công!" });
  }
};

let namhoc = async (req, res) => {
  try {
    const [result, fields1] = await Promise.all([
      pool.execute("SELECT * FROM namhoc where ttNamHoc = 1"),
    ]);

    if (result[0] && result[0].length > 0) {
      return res.status(200).json({
        dataNH: result[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataNH: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let namhoccuamotchidoan = async (req, res) => {
  try {
    const IDLop = req.params.IDLop; // Lấy trang từ query parameters, mặc định là trang 1
    console.log("*************");

    console.log(IDLop);

    const [result, fields1] = await Promise.all([
      pool.execute(
        "SELECT DISTINCT chitietnamhoc.IDNamHoc, namhoc.TenNamHoc " +
          " FROM doanvien " +
          " JOIN chitietnamhoc ON chitietnamhoc.IDDoanVien = doanvien.IDDoanVien " +
          " JOIN namhoc ON chitietnamhoc.IDNamHoc = namhoc.IDNamHoc " +
          " WHERE doanvien.IDLop = ? " +
          " ORDER BY chitietnamhoc.IDNamHoc DESC",
        [IDLop]
      ),
    ]);

    console.log("*************");
    console.log(result);

    if (result && result.length > 0) {
      return res.status(200).json({
        dataNH: result[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataNH: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let namhoccuamotkhoa = async (req, res) => {
  try {
    const Khoa = req.params.Khoa; // Lấy trang từ query parameters, mặc định là trang 1
    console.log("*************");

    console.log(Khoa);

    const [result, fields1] = await Promise.all([
      pool.execute(
        "SELECT DISTINCT chitietnamhoc.IDNamHoc, namhoc.TenNamHoc " +
          " FROM doanvien " +
          " JOIN chitietnamhoc ON chitietnamhoc.IDDoanVien = doanvien.IDDoanVien " +
          " JOIN namhoc ON chitietnamhoc.IDNamHoc = namhoc.IDNamHoc " +
          " JOIN lop ON lop.IDLop = doanvien.IDLop " +
          " WHERE lop.Khoa = ? " +
          " ORDER BY chitietnamhoc.IDNamHoc DESC",
        [Khoa]
      ),
    ]);

    console.log("*************");
    console.log(result);

    if (result && result.length > 0) {
      return res.status(200).json({
        dataNH: result[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataNH: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let namhoccuaxeploai = async (req, res) => {
  try {
    const [result, fields1] = await Promise.all([
      pool.execute(
        "SELECT DISTINCT danhgiadoanvien.IDNamHoc, namhoc.TenNamHoc " +
          " FROM doanvien " +
          " JOIN danhgiadoanvien ON danhgiadoanvien.IDDoanVien = doanvien.IDDoanVien " +
          " JOIN namhoc ON danhgiadoanvien.IDNamHoc = namhoc.IDNamHoc " +
          " ORDER BY danhgiadoanvien.IDNamHoc"
      ),
    ]);

    console.log("*************");
    console.log(result);

    if (result && result.length > 0) {
      return res.status(200).json({
        dataNH: result[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataNH: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let layDSDoanPhi = async (req, res) => {
  try {
    const idnamhoc = req.params.idnamhoc; // Lấy trang từ query parameters, mặc định là trang 1
    const IDTruong = req.params.IDTruong; // Lấy trang từ query parameters, mặc định là trang 1

    const [result2, fields1] = await Promise.all([
      pool.execute(
        "SELECT * FROM doanphi, namhoc where namhoc.idnamhoc = doanphi.idnamhoc and doanphi.ttDoanPhi = 1 and namhoc.IDNamHoc = ? and doanphi.IDTruong = ?",
        [idnamhoc, IDTruong]
      ),
    ]);

    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataDP: result2[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataDP: [],
        totalPages: 0,
        currentPage: 1,
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let layDSDoanPhiCuaMotLop = async (req, res) => {
  try {
    const idnamhoc = req.params.idnamhoc; // Lấy trang từ query parameters, mặc định là trang 1
    const IDLop = req.params.IDLop; // Lấy trang từ query parameters, mặc định là trang 1
    console.log(req.params);
    const [result2, fields1] = await Promise.all([
      pool.execute(
        "SELECT * FROM doanphi, chitietdoanphi, namhoc where doanphi.IDDoanPhi = chitietdoanphi.IDDoanPhi and doanphi.IDNamHoc = namhoc.IDNamHoc and doanphi.ttDoanPhi = 1 and doanphi.IDNamHoc = ? and chitietdoanphi.IDLop = ?",
        [idnamhoc, IDLop]
      ),
    ]);

    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataDP: result2[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataDP: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let LayDSNopDoanPhi = async (req, res) => {
  try {
    const IDDoanPhi = req.params.IDDoanPhi;
    const IDNamHoc = req.params.IDNamHoc;

    // Modify your SQL query in LayDSNopDoanPhi function
    const [rows, result2] = await pool.execute(
      "SELECT chitietdoanphi.IDChiTietDoanPhi, lop.TenLop, lop.khoa, doanphi.TenDoanPhi, doanphi.SoTien AS SoTienLop, COUNT(doanvien.IDDoanVien) AS SoLuongDoanVien, chitietdoanphi.DaDong, namhoc.tennamhoc " +
        "FROM doanphi " +
        "JOIN chitietdoanphi ON doanphi.IDDoanPhi = chitietdoanphi.IDDoanPhi " +
        "JOIN lop ON chitietdoanphi.IDLop = lop.IDLop " +
        "JOIN namhoc ON doanphi.IDNamHoc = namhoc.IDNamHoc " +
        "LEFT JOIN doanvien ON lop.IDLop = doanvien.IDLop " +
        "LEFT JOIN chitietnamhoc ON doanvien.IDDoanVien = chitietnamhoc.IDDoanVien AND namhoc.IDNamHoc = chitietnamhoc.IDNamHoc " +
        "WHERE doanphi.IDDoanPhi = ? AND chitietnamhoc.IDNamHoc = ? " +
        "GROUP BY chitietdoanphi.IDChiTietDoanPhi, doanphi.IDDoanPhi, lop.IDLop " +
        "ORDER BY lop.MaLop ASC",
      [IDDoanPhi, IDNamHoc]
    );

    return res.status(200).json({
      TenDoanPhi: rows[0].TenDoanPhi,
      TenNamHoc: rows[0].tennamhoc,
      ChiTietDoanPhi: rows.map((row) => ({
        IDChiTietDoanPhi: row.IDChiTietDoanPhi,
        TenLop: row.TenLop,
        Khoa: row.khoa,
        SoTienLop: row.SoTienLop,
        SoLuongDoanVien: row.SoLuongDoanVien,
        ThanhTien: row.SoTienLop * row.SoLuongDoanVien,
        Check: row.DaDong,
      })),
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let SaveCheckboxStates = async (req, res) => {
  let { IDDoanPhi, checkboxStates } = req.body;

  console.log(req.body);
  console.log("+=============");
  console.log(checkboxStates);

  try {
    // Assuming checkboxStates is an array of objects with IDChiTietDoanPhi and isChecked
    for (let { IDChiTietDoanPhi, isChecked } of checkboxStates) {
      if (isChecked == false) {
        isChecked = 0;
      } else {
        isChecked = 1;
      }
      console.log(isChecked);
      await pool.execute(
        "UPDATE chitietdoanphi SET DaDong = ? WHERE IDChiTietDoanPhi = ? and IDDoanPhi = ?",
        [isChecked, IDChiTietDoanPhi, IDDoanPhi]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    console.error("Error updating checkbox states:", error);
    return res.status(500).json({ message: "Cập nhật thành công!" });
  }
};

let searchNamHoc = async (req, res) => {
  let { TenNamHoc } = req.body;
  console.log(TenNamHoc);

  try {
    if (TenNamHoc !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM doanphi, namhoc where doanphi.ttDoanPhi = 1 and namhoc.idnamhoc = doanphi.idnamhoc and namhoc.TenNamHoc = ?",
        [TenNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataDP: rows,
      });
    } else {
      return layDSDoanPhi(req, res);
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let XoaDoanPhi = async (req, res) => {
  let IDDoanPhi = req.params.IDDoanPhi;
  console.log(IDDoanPhi);
  try {
    await pool.execute(
      "update doanphi set doanphi.ttDoanPhi = 0 where doanphi.IDDoanPhi = ?",
      [IDDoanPhi]
    );

    console.log("Xoa thanh cong");
    return res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let ThemDoanPhi = async (req, res) => {
  let { TenDoanPhi, SoTien, TenNamHoc } = req.body;
  let IDTruong = req.params.IDTruong;
  console.log(TenDoanPhi);
  console.log(SoTien);
  console.log(TenNamHoc);

  try {
    let [namhoc, fields1] = await pool.execute(
      "SELECT * FROM namhoc where namhoc.TenNamHoc = ?",
      [TenNamHoc]
    );

    const IDNamHoc = namhoc[0].IDNamHoc;

    let [rows, fields] = await pool.execute(
      "insert into doanphi(TenDoanPhi, SoTien, IDNamHoc, IDTruong) values (?, ?, ?, ?)",
      [TenDoanPhi, SoTien, IDNamHoc, IDTruong]
    );

    const [newDoanPhi] = await pool.execute(
      "SELECT * FROM doanphi WHERE IDDoanPhi = ?",
      [rows.insertId]
    );

    let [tatcalop, fields2] = await pool.execute(
      "SELECT * FROM lop where ttLop = 1 and lop.IDTruong = ?",
      [IDTruong]
    );

    for (const lop of tatcalop) {
      await pool.execute(
        "INSERT INTO chitietdoanphi(IDDoanPhi, IDLop) VALUES (?, ?)",
        [newDoanPhi[0].IDDoanPhi, lop.IDLop]
      );

      let [tatcadoanvien, fields3] = await pool.execute(
        "SELECT * FROM doanvien where ttDoanVien = 1 and IDLop = ?",
        [lop.IDLop]
      );

      for (const doanvien of tatcadoanvien) {
        await pool.execute(
          "INSERT INTO thudoanphi(IDDoanVien, IDDoanPhi) VALUES (?, ?)",
          [doanvien.IDDoanVien, newDoanPhi[0].IDDoanPhi]
        );
      }
    }

    return res.status(200).json({
      message: "Them thanh cong",
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let LayMotDoanPhi = async (req, res) => {
  try {
    const IDDoanPhi = req.params.IDDoanPhi;

    const [rows, result2] = await pool.execute(
      "SELECT * FROM doanphi, namhoc where doanphi.IDDoanPhi = ? and doanphi.IDNamHoc = namhoc.IDnamHoc",
      [IDDoanPhi]
    );

    console.log(rows);

    return res.status(200).json({
      dataDP: rows[0],
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let CapNhatDoanPhi = async (req, res) => {
  let { IDDoanPhi, TenDoanPhi, SoTien, IDNamHoc } = req.body;
  console.log(IDDoanPhi);
  console.log(TenDoanPhi);
  console.log(SoTien);
  console.log(IDNamHoc);

  try {
    let [rows, fields] = await pool.execute(
      "update doanphi set TenDoanPhi = ?, SoTien = ?, IDNamHoc = ? where IDDoanPhi = ?",
      [TenDoanPhi, SoTien, IDNamHoc, IDDoanPhi]
    );

    console.log(rows);

    return res.status(200).json({
      dataDP: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let LayDanToc = async (req, res) => {
  try {
    const [rows, result] = await pool.execute(
      "SELECT * FROM dantoc ORDER BY TenDanToc ASC"
    );

    console.log(rows);

    return res.status(200).json({
      dataDT: rows,
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let LayTonGiao = async (req, res) => {
  try {
    const [rows, result] = await pool.execute(
      "SELECT * FROM TonGiao ORDER BY TenTonGiao ASC"
    );

    console.log(rows);

    return res.status(200).json({
      dataTG: rows,
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let LayDSNopDoanPhiCuaMotLop = async (req, res) => {
  try {
    const IDDoanPhi = req.params.IDDoanPhi;
    const IDNamHoc = req.params.IDNamHoc;
    const IDLop = req.params.IDLop;

    const [rows, result2] = await pool.execute(
      "SELECT thudoanphi.IDThuDP, doanvien.MSSV, doanvien.HoTen, doanphi.TenDoanPhi, doanphi.SoTien AS SoTienLop, COUNT(doanvien.IDDoanVien) AS SoLuongDoanVien, thudoanphi.DaDong, namhoc.tennamhoc " +
        "FROM doanphi " +
        "JOIN thudoanphi ON doanphi.IDDoanPhi = thudoanphi.IDDoanPhi " +
        "JOIN doanvien ON thudoanphi.IDDoanVien = doanvien.IDDoanVien " +
        "JOIN namhoc ON doanphi.IDNamHoc = namhoc.IDNamHoc " +
        "LEFT JOIN chitietnamhoc ON doanvien.IDDoanVien = chitietnamhoc.IDDoanVien AND namhoc.IDNamHoc = chitietnamhoc.IDNamHoc " +
        "WHERE doanphi.IDDoanPhi = ? AND chitietnamhoc.IDNamHoc = ? AND doanvien.IDLop = ? " +
        "GROUP BY thudoanphi.IDThuDP, doanphi.IDDoanPhi, doanvien.IDDoanVien " +
        "ORDER BY doanvien.MSSV ",
      [IDDoanPhi, IDNamHoc, IDLop]
    );

    return res.status(200).json({
      TenDoanPhi: rows[0].TenDoanPhi,
      TenNamHoc: rows[0].tennamhoc,
      ChiTietDoanPhi: rows.map((row) => ({
        IDThuDP: row.IDThuDP,
        SoTienLop: row.SoTienLop,
        SoLuongDoanVien: row.SoLuongDoanVien,
        ThanhTien: row.SoTienLop * row.SoLuongDoanVien,

        MSSV: row.MSSV,
        HoTen: row.HoTen,
        Check: row.DaDong,
      })),
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let SaveCheckboxStatesCuaMotLop = async (req, res) => {
  let { IDDoanPhi, checkboxStates } = req.body;

  console.log(req.body);
  console.log("+=============");
  console.log(checkboxStates);

  try {
    // Assuming checkboxStates is an array of objects with IDChiTietDoanPhi and isChecked
    for (let { IDThuDP, isChecked } of checkboxStates) {
      if (isChecked == false) {
        isChecked = 0;
      } else {
        isChecked = 1;
      }
      console.log(isChecked);
      await pool.execute(
        "UPDATE thudoanphi SET DaDong = ? WHERE IDThuDP = ? and IDDoanPhi = ?",
        [isChecked, IDThuDP, IDDoanPhi]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    console.error("Error updating checkbox states:", error);
    return res.status(500).json({ message: "Cập nhật thành công!" });
  }
};

let layDSHoatDongCuaLop = async (req, res) => {
  try {
    const IDNamHoc = req.params.idnamhoc;
    const IDLop = req.params.IDLop;

    console.log(req.params);
    const [result2, fieldsResult2] = await Promise.all([
      pool.execute(
        "SELECT * FROM diemdanhhoatdong, hoatdong where diemdanhhoatdong.IDHoatDong = hoatdong.IDHoatDong and (hoatdong.ttHD = 0 or hoatdong.ttHD = 1 or hoatdong.ttHD = 2) and hoatdong.IDNamHoc = ? and diemdanhhoatdong.IDLop = ?",
        [IDNamHoc, IDLop]
      ),
    ]);

    console.log(result2);

    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataHD: result2[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataHD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let LayDSDiemDanhCuaLop = async (req, res) => {
  try {
    const IDHoatDong = req.params.IDHoatDong;
    const IDNamHoc = req.params.IDNamHoc;
    const IDLop = req.params.IDLop;

    // Modify your SQL query in LayDSNopDoanPhi function
    const [rows, result2] = await pool.execute(
      "SELECT diemdanhdoanvien.IDDDDoanVien, hoatdong.TenHoatDong, diemdanhdoanvien.DaDiemDanh, namhoc.tennamhoc, doanvien.MSSV, doanvien.HoTen " +
        "FROM hoatdong " +
        "JOIN diemdanhdoanvien ON hoatdong.IDHoatDong = diemdanhdoanvien.IDHoatDong " +
        "JOIN doanvien ON doanvien.IDDoanVien = diemdanhdoanvien.IDDoanVien " +
        "JOIN namhoc ON hoatdong.IDNamHoc = namhoc.IDNamHoc " +
        "LEFT JOIN chitietnamhoc ON doanvien.IDDoanVien = chitietnamhoc.IDDoanVien AND namhoc.IDNamHoc = chitietnamhoc.IDNamHoc " +
        "WHERE hoatdong.IDHoatDong = ? and chitietnamhoc.IDNamHoc = ? and doanvien.IDLop = ? " +
        "GROUP BY diemdanhdoanvien.IDDDDoanVien, hoatdong.IDHoatDong, doanvien.IDDoanVien ",
      [IDHoatDong, IDNamHoc, IDLop]
    );

    return res.status(200).json({
      TenHoatDong: rows[0].TenHoatDong,
      TenNamHoc: rows[0].tennamhoc,
      ChiTietHD: rows.map((row) => ({
        IDDDDoanVien: row.IDDDDoanVien,
        MSSV: row.MSSV,
        HoTen: row.HoTen,
        Check: row.DaDiemDanh,
      })),
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let SaveCheckboxStatesDiemDanhCuaLop = async (req, res) => {
  let { IDHoatDong, checkboxStates } = req.body;

  console.log(IDHoatDong);
  console.log(req.body);
  console.log("+=============");
  console.log(checkboxStates);

  try {
    // Assuming checkboxStates is an array of objects with IDChiTietDoanPhi and isChecked
    for (let { IDDDDoanVien, isChecked } of checkboxStates) {
      if (isChecked == false) {
        isChecked = 0;
      } else {
        isChecked = 1;
      }
      console.log(isChecked);
      await pool.execute(
        "UPDATE diemdanhdoanvien SET DaDiemDanh = ? WHERE IDDDDoanVien = ? and IDHoatDong = ?",
        [isChecked, IDDDDoanVien, IDHoatDong]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    console.error("Error updating checkbox states:", error);
    return res.status(500).json({ message: "Cập nhật thành công!" });
  }
};

let SaveIDDoanVienDiemDanhCuaLop = async (req, res) => {
  console.log(req.body);
  let { IDHoatDong, IDDoanVienList } = req.body;

  try {
    // Assuming checkboxStates is an array of objects with IDChiTietDoanPhi and isChecked
    for (let IDDoanVien of IDDoanVienList) {
      const [rows] = await pool.execute(
        "SELECT COUNT(*) AS count FROM doanvien WHERE IDDoanVien = ?",
        [IDDoanVien]
      );

      if (rows[0].count > 0) {
        await pool.execute(
          "UPDATE diemdanhdoanvien SET DaDiemDanh = 1 WHERE IDDoanVien = ? and IDHoatDong = ?",
          [IDDoanVien, IDHoatDong]
        );
      } else {
        // IDDoanVien không tồn tại, có thể xử lý theo ý của bạn
        console.log(`IDDoanVien ${IDDoanVien} không tồn tại`);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Điểm danh thành công!",
    });
  } catch (error) {
    console.error("Điểm danh thất bại!: ", error);
    return res.status(500).json({ message: "Điểm danh thất bại!" });
  }
};

let laytendoanvien = async (req, res) => {
  const IDDoanVien = req.params.IDDoanVien;
  console.log(IDDoanVien);
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT * FROM doanvien, anh, dantoc, tongiao, lop where doanvien.IDDoanVien = anh.IDDoanVien and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = ?",
      [IDDoanVien]
    );

    if (rows && rows.length > 0) {
      // Định dạng lại ngày trong rows[0].NgayHetHan
      const formattedDate = format(new Date(rows[0].NgaySinh), "dd/MM/yyyy");
      const formattedDate1 = format(
        new Date(rows[0].NgayVaoDoan),
        "dd/MM/yyyy"
      );

      // Gán lại giá trị đã định dạng vào rows[0].NgayHetHan
      rows[0].NgaySinh = formattedDate;
      rows[0].NgayVaoDoan = formattedDate1;

      return res.status(200).json({
        dataDV: rows[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataDV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let timbangmssv = async (req, res) => {
  const MSSV = req.params.MSSV;
  console.log(MSSV);
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT IDDoanVien, MSSV, HoTen FROM doanvien where doanvien.MSSV = ?",
      [MSSV]
    );

    console.log(rows);
    return res.status(200).json({
      dataDV: rows,
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let layDSChucVuDoanVien = async (req, res) => {
  const IDDoanVien = req.params.IDDoanVien;
  console.log(IDDoanVien);
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT * FROM chitietnamhoc, namhoc, chucvu where chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDDoanVien = ? and chitietnamhoc.ttChiTietNH = 1",
      [IDDoanVien]
    );

    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataDV: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataDV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let layDSDanhGiaDoanVien = async (req, res) => {
  const IDDoanVien = req.params.IDDoanVien;
  console.log(IDDoanVien);
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT * FROM danhgiadoanvien where danhgiadoanvien.IDDoanVien = ?",
      [IDDoanVien]
    );

    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataDV: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataDV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let layDSHoatDongCuaDoanVien = async (req, res) => {
  try {
    const IDNamHoc = req.params.IDNamHoc;
    const IDDoanVien = req.params.IDDoanVien;

    console.log(req.params);

    const [result2, fieldsResult2] = await Promise.all([
      pool.execute(
        "SELECT * FROM diemdanhdoanvien, hoatdong where diemdanhdoanvien.IDHoatDong = hoatdong.IDHoatDong and (hoatdong.ttHD = 0 or hoatdong.ttHD = 1 or hoatdong.ttHD = 2) and hoatdong.IDNamHoc = ? and diemdanhdoanvien.IDDoanVien = ? ORDER BY hoatdong.IDHoatDong DESC",
        [IDNamHoc, IDDoanVien]
      ),
    ]);

    console.log(result2[0]);

    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataHD: result2[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataHD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let DanhSachUngTuyen = async (req, res) => {
  try {
    console.log(req.params);
    const IDNamHoc = req.params.IDNamHoc;

    const [result2, fieldsResult2] = await Promise.all([
      pool.execute(
        "SELECT * FROM admin, lop, doanvien, ungtuyen, namhoc where admin.IDTruong = lop.IDTruong and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = ungtuyen.IDDoanVien and namhoc.IDNamHoc = ungtuyen.IDNamHoc and namhoc.IDNamHoc = ?",
        [IDNamHoc]
      ),
    ]);

    // Chuyển đổi NgayBanHanh từ định dạng date thành định dạng "yyyy/MM/dd"
    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataUT: result2[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataUT: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let DanhSachUngTuyenCT = async (req, res) => {
  console.log(req.params);
  const IDNamHoc = req.params.IDNamHoc;
  const IDTruong = req.params.IDTruong;

  const page = parseInt(req.params.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5

  const offset = (page - 1) * pageSize;

  const [sotrang, fields1] = await pool.execute(
    "SELECT * FROM admin, lop, doanvien, ungtuyen, namhoc where admin.IDTruong = lop.IDTruong and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = ungtuyen.IDDoanVien and namhoc.IDNamHoc = ungtuyen.IDNamHoc and namhoc.IDNamHoc = ? and admin.IDTruong = ?",
    [IDNamHoc, IDTruong]
  );

  try {
    const [result2, fieldsResult2] = await Promise.all([
      pool.execute(
        "SELECT * FROM admin, lop, doanvien, ungtuyen, namhoc where admin.IDTruong = lop.IDTruong and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = ungtuyen.IDDoanVien and namhoc.IDNamHoc = ungtuyen.IDNamHoc and namhoc.IDNamHoc = ? and admin.IDTruong = ? LIMIT ? OFFSET ?",
        [IDNamHoc, IDTruong, pageSize, offset]
      ),
    ]);

    // Chuyển đổi NgayBanHanh từ định dạng date thành định dạng "yyyy/MM/dd"
    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataUT: result2[0],
        totalPages: Math.ceil(sotrang.length / pageSize),
        currentPage: page,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataUT: [],
        totalPages: 0,
        currentPage: 1,
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let DanhSachUngTuyenCuaLop = async (req, res) => {
  try {
    console.log(req.params);
    const IDLop = req.params.IDLop;
    const IDNamHoc = req.params.IDNamHoc;

    const [result2, fieldsResult2] = await Promise.all([
      pool.execute(
        "SELECT * FROM doanvien, ungtuyen, namhoc where doanvien.IDDoanVien = ungtuyen.IDDoanVien and namhoc.IDNamHoc = ungtuyen.IDNamHoc and doanvien.IDLop = ? and ungtuyen.IDNamHoc = ? ORDER BY ungtuyen.IDUngTuyen DESC",
        [IDLop, IDNamHoc]
      ),
    ]);

    console.log(result2);

    // Chuyển đổi NgayBanHanh từ định dạng date thành định dạng "yyyy/MM/dd"
    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataUT: result2[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataUT: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let DanhSachUngTuyenCuaDV = async (req, res) => {
  try {
    console.log(req.params);
    const IDDoanVien = req.params.IDDoanVien;

    const [result2, fieldsResult2] = await Promise.all([
      pool.execute(
        "SELECT * FROM doanvien, ungtuyen, namhoc where doanvien.IDDoanVien = ungtuyen.IDDoanVien and namhoc.IDNamHoc = ungtuyen.IDNamHoc and ungtuyen.IDDoanVien = ? ORDER BY ungtuyen.IDUngTuyen DESC",
        [IDDoanVien]
      ),
    ]);

    console.log(result2[0].NgayUngTuyen);

    // Chuyển đổi NgayBanHanh từ định dạng date thành định dạng "yyyy/MM/dd"
    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataUT: result2[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataUT: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let CapNhatUngTuyenCuaDV = async (req, res) => {
  try {
    console.log(req.params);
    const IDUngTuyen = req.params.IDUngTuyen;
    const TTUngTuyen = req.params.TTUngTuyen;

    const [result2, fieldsResult2] = await Promise.all([
      pool.execute("update ungtuyen set TTUngTuyen = ? where IDUngTuyen = ?", [
        TTUngTuyen,
        IDUngTuyen,
      ]),
    ]);

    return res.status(200).json({
      message: "Thanh cong!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let MauUngTuyen = async (req, res) => {
  try {
    const [result2, fieldsResult2] = await Promise.all([
      pool.execute(
        "SELECT TenFile FROM dieukiensinhviennamtot ORDER BY dieukiensinhviennamtot.IDFile DESC"
      ),
    ]);

    console.log(result2[0]);

    // Chuyển đổi NgayBanHanh từ định dạng date thành định dạng "yyyy/MM/dd"
    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataUT: result2[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataUT: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let getSearchSVNT = async (req, res) => {
  let { IDNamHoc, trimmedInfo, IDTruong } = req.body;
  console.log(req.body);

  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM admin, lop, doanvien, ungtuyen where admin.IDTruong = lop.IDTruong and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = ungtuyen.IDDoanVien and ungtuyen.IDNamHoc = ? and (doanvien.MSSV LIKE ? or doanvien.HoTen LIKE ? or TenLop LIKE ? or MaLop LIKE ?) and admin.IDTruong = ?",
        [
          IDNamHoc,
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          IDTruong,
        ]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataUT: rowsMaLop,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataUT: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let DiemCuaMotDoanVien = async (req, res) => {
  console.log(req.body);

  let { hk1, hk2, rl1, rl2, idnamhoc, IDDoanVien } = req.body;
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
    rl1 < 50 ||
    rl2 < 50 ||
    (rl1 + rl2) / 2 < 50
  ) {
    PhanLoai = 4;
  }

  try {
    let [rows, fields] = await pool.execute(
      "update danhgiadoanvien set hk1 = ?, hk2 = ?, rl1 = ?, rl2 = ?, PhanLoai = ? where IDNamHoc = ? and IDDoanVien = ?",
      [hk1, hk2, rl1, rl2, PhanLoai, idnamhoc, IDDoanVien]
    );

    return res.status(200).json({
      message: "Thành công!",
    });
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let LayDiemCuaMotDoanVien = async (req, res) => {
  let IDDoanVien = req.params.IDDoanVien;
  let IDNamHoc = req.params.IDNamHoc;

  try {
    let [rows, fields] = await pool.execute(
      "select * from danhgiadoanvien where IDNamHoc = ? and IDDoanVien = ?",
      [IDNamHoc, IDDoanVien]
    );
    return res.status(200).json({
      dataDG: rows[0],
    });
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let KetQuaCuaMotDoanVien = async (req, res) => {
  let IDDoanVien = req.params.IDDoanVien;
  console.log(req.params);
  try {
    let [rows, fields] = await pool.execute(
      "SELECT * from danhgiadoanvien, namhoc where danhgiadoanvien.IDDoanVien = ? and namhoc.IDNamHoc = danhgiadoanvien.IDNamHoc",
      [IDDoanVien]
    );

    return res.status(200).json({
      dataDG: rows,
    });
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let DanhSachDanhGiaDoanVienCuaLop = async (req, res) => {
  console.log(req.params);
  let IDLop = req.params.IDLop;
  let IDNamHoc = req.params.idnamhoc;

  const page = parseInt(req.params.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5

  const offset = (page - 1) * pageSize;

  const [sotrang, fields1] = await pool.execute(
    "SELECT * from lop, doanvien, danhgiadoanvien, namhoc where lop.IDLop = doanvien.IDLop and danhgiadoanvien.IDNamHoc = namhoc.IDNamHoc and doanvien.IDLop = ? and doanvien.IDDoanVien = danhgiadoanvien.IDDoanVien and danhgiadoanvien.IDNamHoc = ?",
    [IDLop, IDNamHoc]
  );

  try {
    let [rows, fields] = await pool.execute(
      "SELECT * from lop, doanvien, danhgiadoanvien, namhoc where lop.IDLop = doanvien.IDLop and danhgiadoanvien.IDNamHoc = namhoc.IDNamHoc and doanvien.IDLop = ? and doanvien.IDDoanVien = danhgiadoanvien.IDDoanVien and danhgiadoanvien.IDNamHoc = ? LIMIT ? OFFSET ?",
      [IDLop, IDNamHoc, pageSize, offset]
    );

    if (rows && rows.length > 0) {
      let phanLoaiCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

      // Count occurrences for each PhanLoai value
      sotrang.forEach((trang) => {
        const phanLoai = trang.PhanLoai || 0; // Assuming PhanLoai is a property in the result rows
        phanLoaiCounts[phanLoai]++;
      });

      return res.status(200).json({
        dataDG: rows,
        phanLoaiCounts,
        totalPages: Math.ceil(sotrang.length / pageSize),
        currentPage: page,
      });
    } else {
      console.log("Không tìm thấy kết quả");
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let DanhGiaChiDoan = async (req, res) => {
  let IDNamHoc = req.params.idnamhoc;
  let Khoa = req.params.khoa;
  let IDTruong = req.params.IDTruong;

  try {
    const [Lops, fields] = await pool.execute(
      "SELECT * from lop where Khoa = ? and IDTruong = ? ORDER BY lop.MaLop",
      [Khoa, IDTruong]
    );
    let classResults = [];

    for (const lop of Lops) {
      const [rows, fields1] = await pool.execute(
        "SELECT * FROM doanvien, danhgiadoanvien, namhoc WHERE doanvien.IDDoanVien = danhgiadoanvien.IDDoanVien AND doanvien.IDLop = ? AND danhgiadoanvien.IDNamHoc = ? ",
        [lop.IDLop, IDNamHoc]
      );

      let phanLoaiCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

      rows.forEach((row) => {
        const phanLoai = row.PhanLoai || 0;
        phanLoaiCounts[phanLoai]++;
      });

      const totalPhanLoai1And2 = phanLoaiCounts[1] + phanLoaiCounts[2];
      const totalPhanLoai4 = phanLoaiCounts[4];
      const totalPhanLoai4Percentage = (totalPhanLoai4 / rows.length) * 100;
      const allPhanLoaiZero = phanLoaiCounts[0] === rows.length;

      // if (!allPhanLoaiZero) {
      let PLChiDoan;
      if (totalPhanLoai1And2 >= 0.8 && totalPhanLoai4 === 0) {
        PLChiDoan = 1;
      } else if (totalPhanLoai1And2 >= 0.6 && totalPhanLoai4 === 0) {
        PLChiDoan = 2;
      } else if (totalPhanLoai1And2 >= 0.5 && totalPhanLoai4Percentage < 0.2) {
        PLChiDoan = 3;
      } else if (totalPhanLoai4Percentage >= 0.2) {
        PLChiDoan = 4;
      } else if (allPhanLoaiZero) {
        PLChiDoan = 0;
      } else {
        PLChiDoan = 0;
      }

      classResults.push({
        dataCD: lop,
        PLChiDoan,
      });
      // }
    }

    // Return the final counts for each PhanLoai value
    return res.status(200).json({
      classResults,
    });
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let DanhGiaCuaTungChiDoan = async (req, res) => {
  let IDNamHoc = req.params.idnamhoc;
  let IDLop = req.params.IDLop;
  console.log(req.params);
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT * FROM doanvien, danhgiadoanvien, namhoc WHERE doanvien.IDLop = ? AND doanvien.IDDoanVien = danhgiadoanvien.IDDoanVien AND danhgiadoanvien.IDNamHoc = ?",
      [IDLop, IDNamHoc]
    );
    console.log(rows);
    let phanLoaiCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

    // Count occurrences for each PhanLoai value in the current result set
    rows.forEach((row) => {
      const phanLoai = row.PhanLoai || 0;
      phanLoaiCounts[phanLoai]++;
    });

    const totalPhanLoai1And2 = phanLoaiCounts[1] + phanLoaiCounts[2];
    const totalPhanLoai4 = phanLoaiCounts[4];
    const totalPhanLoai4Percentage = (totalPhanLoai4 / rows.length) * 100;
    const allPhanLoaiZero = phanLoaiCounts[0] === rows.length;

    // Calculate PLChiDoan
    let PLChiDoan = "";
    if (totalPhanLoai1And2 >= 0.8 && totalPhanLoai4 === 0) {
      PLChiDoan = "Chi Đoàn Vững Mạnh";
    } else if (totalPhanLoai1And2 >= 0.6 && totalPhanLoai4 === 0) {
      PLChiDoan = "Chi Đoàn Khá";
    } else if (totalPhanLoai1And2 >= 0.5 && totalPhanLoai4Percentage < 0.2) {
      PLChiDoan = "Chi Đoàn Trung Bình";
    } else if (totalPhanLoai4Percentage >= 0.2) {
      PLChiDoan = "Chi Đoàn Yếu Kém";
    } else if (allPhanLoaiZero) {
      PLChiDoan = "Chưa Đủ Thông Tin";
    } else {
      PLChiDoan = "Chưa Xếp Loại";
    }

    console.log(PLChiDoan);
    // Return the final counts for each PhanLoai value
    return res.status(200).json({
      IDLop,
      PLChiDoan,
    });
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let layDSDoanPhiCuaDoanVien = async (req, res) => {
  try {
    const IDNamHoc = req.params.IDNamHoc;
    const IDDoanVien = req.params.IDDoanVien;

    const [result2, fieldsResult2] = await Promise.all([
      pool.execute(
        "SELECT * FROM thudoanphi, doanphi where thudoanphi.IDDoanPhi = doanphi.IDDoanPhi and doanphi.ttDoanPhi = 1  and doanphi.IDNamHoc = ? and thudoanphi.IDDoanVien = ? ORDER BY doanphi.IDDoanPhi DESC",
        [IDNamHoc, IDDoanVien]
      ),
    ]);

    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataHD: result2[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataHD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let DoiMatKhauDoanVien = async (req, res) => {
  try {
    const IDDoanVien = req.params.IDDoanVien;
    const { oldPassword, newPassword } = req.body;
    const [result, fields] = await pool.execute(
      "SELECT Password FROM doanvien WHERE doanvien.IDDoanVien = ?",
      [IDDoanVien]
    );

    if (result && result.length > 0) {
      const hashedPassword = result[0].Password;

      if (hashedPassword) {
        // So sánh mật khẩu cũ
        const match = await bcrypt.compare(oldPassword, hashedPassword);

        if (match) {
          // Băm mật khẩu mới
          const saltRounds = 10;
          const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

          // Cập nhật mật khẩu mới vào cơ sở dữ liệu
          const [updateResult, fieldUpdate] = await pool.execute(
            "UPDATE doanvien SET Password = ? WHERE IDDoanVien = ?",
            [newHashedPassword, IDDoanVien]
          );
          console.log(updateResult);
          if (updateResult && updateResult.affectedRows > 0) {
            console.log("Đổi mật khẩu thành công!");
            return res.status(200).json({
              success: true,
              message: "Đổi mật khẩu thành công!",
            });
          } else {
            console.log("Không thể cập nhật mật khẩu mới!");
            return res.status(500).json({
              error: "Không thể cập nhật mật khẩu mới!",
            });
          }
        } else {
          console.log("Mật khẩu cũ không đúng!");
          return res.status(500).json({
            error: "Mật khẩu cũ không đúng!",
          });
        }
      } else {
        console.log("Không tìm thấy mật khẩu trong cơ sở dữ liệu!");
        return res.status(500).json({
          error: "Không tìm thấy mật khẩu trong cơ sở dữ liệu!",
        });
      }
    } else {
      console.log("Không tìm thấy người dùng!");
      return res.status(200).json({
        dataDV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let laytentruong = async (req, res) => {
  const IDTruong = req.params.IDTruong;

  try {
    const [rows, fields1] = await pool.execute(
      "SELECT * FROM admin where IDTruong = ?",
      [IDTruong]
    );

    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataDT: rows[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataDT: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let DoiMatKhauDoanTruong = async (req, res) => {
  try {
    const IDTruong = req.params.IDTruong;
    const { oldPassword, newPassword } = req.body;
    console.log(IDTruong);
    const [result, fields] = await pool.execute(
      "SELECT PassTruong FROM admin WHERE admin.IDTruong = ?",
      [IDTruong]
    );

    if (result && result.length > 0) {
      const hashedPassword = result[0].PassTruong;

      if (hashedPassword) {
        // So sánh mật khẩu cũ
        const match = await bcrypt.compare(oldPassword, hashedPassword);

        if (match) {
          // Băm mật khẩu mới
          const saltRounds = 10;
          const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

          // Cập nhật mật khẩu mới vào cơ sở dữ liệu
          const [updateResult, fieldUpdate] = await pool.execute(
            "UPDATE admin SET PassTruong = ? WHERE IDTruong = ?",
            [newHashedPassword, IDTruong]
          );
          console.log(updateResult);
          if (updateResult && updateResult.affectedRows > 0) {
            console.log("Đổi mật khẩu thành công!");
            return res.status(200).json({
              success: true,
              message: "Đổi mật khẩu thành công!",
            });
          } else {
            console.log("Không thể cập nhật mật khẩu mới!");
            return res.status(500).json({
              error: "Không thể cập nhật mật khẩu mới!",
            });
          }
        } else {
          console.log("Mật khẩu cũ không đúng!");
          return res.status(500).json({
            error: "Mật khẩu cũ không đúng!",
          });
        }
      } else {
        console.log("Không tìm thấy mật khẩu trong cơ sở dữ liệu!");
        return res.status(500).json({
          error: "Không tìm thấy mật khẩu trong cơ sở dữ liệu!",
        });
      }
    } else {
      console.log("Không tìm thấy người dùng!");
      return res.status(200).json({
        dataDV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let CapNhatThongTinDoanTruong = async (req, res) => {
  let { IDTruong, TenTruong, EmailTruong } = req.body;

  console.log("data", req.body);

  try {
    let [rows, fields] = await pool.execute(
      "update admin set TenTruong = ?, EmailTruong = ? where IDTruong = ?",
      [TenTruong, EmailTruong, IDTruong]
    );

    return res.status(200).json({
      dataDT: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let CapNhatThongTinLop = async (req, res) => {
  let { IDLop, TenLop, EmailLop } = req.body;

  console.log("data", req.body);

  try {
    let [rows, fields] = await pool.execute(
      "update lop set TenLop = ?, EmailLop = ? where IDLop = ?",
      [TenLop, EmailLop, IDLop]
    );

    return res.status(200).json({
      dataCD: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let DoiMatKhauLop = async (req, res) => {
  try {
    const IDLop = req.params.IDLop;
    const { oldPassword, newPassword } = req.body;
    console.log(IDLop);
    const [result, fields] = await pool.execute(
      "SELECT PassLop FROM lop WHERE lop.IDLop = ?",
      [IDLop]
    );

    if (result && result.length > 0) {
      const hashedPassword = result[0].PassLop;

      if (hashedPassword) {
        // So sánh mật khẩu cũ
        const match = await bcrypt.compare(oldPassword, hashedPassword);

        if (match) {
          // Băm mật khẩu mới
          const saltRounds = 10;
          const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

          // Cập nhật mật khẩu mới vào cơ sở dữ liệu
          const [updateResult, fieldUpdate] = await pool.execute(
            "UPDATE lop SET PassLop = ? WHERE IDLop = ?",
            [newHashedPassword, IDLop]
          );
          console.log(updateResult);
          if (updateResult && updateResult.affectedRows > 0) {
            console.log("Đổi mật khẩu thành công!");
            return res.status(200).json({
              success: true,
              message: "Đổi mật khẩu thành công!",
            });
          } else {
            console.log("Không thể cập nhật mật khẩu mới!");
            return res.status(500).json({
              error: "Không thể cập nhật mật khẩu mới!",
            });
          }
        } else {
          console.log("Mật khẩu cũ không đúng!");
          return res.status(500).json({
            error: "Mật khẩu cũ không đúng!",
          });
        }
      } else {
        console.log("Không tìm thấy mật khẩu trong cơ sở dữ liệu!");
        return res.status(500).json({
          error: "Không tìm thấy mật khẩu trong cơ sở dữ liệu!",
        });
      }
    } else {
      console.log("Không tìm thấy người dùng!");
      return res.status(200).json({
        error: "Không tìm thấy mật khẩu trong cơ sở dữ liệu!",
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let guiMaXacNhan = async (req, res) => {
  let email = req.body.email;
  // let testAccount = await nodemailer.createTestAccount();
  const generateVerificationCode = (length) => {
    // return Math.floor(1000 + Math.random() * 9000).toString();
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const verificationCode = generateVerificationCode(6);
  const saltRounds = 10;
  const pwdHash = await bcrypt.hash(verificationCode, saltRounds);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
      user: "ld7941682@gmail.com",
      pass: "ijippjqyfxuyqgxs",
    },
  });

  const [r1, f1] = await pool.execute(
    "SELECT * FROM doanvien WHERE Email = ?",
    [email]
  );
  console.log(email);
  if (r1.length == 0) {
    console.log("Email không ton tai");
    return res.status(404).json({
      message: "Email không tồn tại",
    });
  }

  // const [r2, f2] = await pool.execute("UPDATE users set maxacnhan=? where email = ?", [verificationCode, email])
  const [r2, f2] = await pool.execute(
    "SELECT Password FROM doanvien WHERE Email = ?",
    [email]
  );

  const old_password = r2[0].Password;
  // console.log(old_password)
  await pool.execute("UPDATE doanvien SET Password = ? WHERE Email = ?", [
    pwdHash,
    email,
  ]);
  const mailOptions = {
    from: "ld7941682@gmail.com",
    to: email,
    subject: "New Password",
    text: `Your new password is: ${verificationCode}`,
  };

  await transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log(error);
      await pool.execute("UPDATE doanvien SET Password = ? WHERE Email = ?", [
        old_password,
        email,
      ]);
      return res.status(404).json({ message: "Kiểm tra lại Email" });
    } else {
      console.log("Ok");
      return res.status(200).json({ message: "Gửi mã thành công!" });
    }
  });
};

let LayTieuChi = async (req, res) => {
  try {
    const [rows, fields1] = await pool.execute("SELECT * FROM tieuchisvnamtot");

    console.log(rows);
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataTC: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataTC: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let LayMotTieuChi = async (req, res) => {
  let IDTieuChi = req.params.IDTieuChi;
  console.log(IDTieuChi);
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT NoiDungTieuChi FROM tieuchisvnamtot where IDTieuChi = ?",
      [IDTieuChi]
    );

    console.log(rows[0]);
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataTC: rows[0].NoiDungTieuChi,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataTC: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let CapNhatMotTieuChi = async (req, res) => {
  let IDTieuChi = req.params.IDTieuChi;
  let NoiDungTieuChi = req.body.NoiDungTieuChi;
  console.log("Nội dung:", NoiDungTieuChi);
  try {
    await pool.execute(
      "update tieuchisvnamtot set tieuchisvnamtot.NoiDungTieuChi = ? where tieuchisvnamtot.IDTieuChi = ?",
      [NoiDungTieuChi, IDTieuChi]
    );

    return res.status(200).json({
      message: "Update thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let LayTieuChiChiDoan = async (req, res) => {
  try {
    const [rows, fields1] = await pool.execute("SELECT * FROM danhgiachidoan");

    console.log(rows);
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataTC: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataTC: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let CapNhatMotTieuChiCD = async (req, res) => {
  let IDDGCD = req.params.IDDGCD;
  let NoiDungTieuChi = req.body.NoiDungChiDoan;
  console.log("Nội dung:", NoiDungTieuChi);
  try {
    await pool.execute(
      "update danhgiachidoan set danhgiachidoan.NoiDungChiDoan = ? where danhgiachidoan.IDDGCD = ?",
      [NoiDungTieuChi, IDDGCD]
    );

    return res.status(200).json({
      message: "Update thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let LayTieuChiDoanVien = async (req, res) => {
  try {
    const [rows, fields1] = await pool.execute("SELECT * FROM tieuchidoanvien");

    console.log(rows);
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataTC: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataTC: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let CapNhatTieuChiDoanVien = async (req, res) => {
  let IDTieuChiDV = req.params.IDTieuChiDV;
  let NoiDungTieuChi = req.body.NoiDungTC;
  console.log("Nội dung:", NoiDungTieuChi);
  try {
    await pool.execute(
      "update tieuchidoanvien set tieuchidoanvien.NoiDungTC = ? where tieuchidoanvien.IDTieuChiDV = ?",
      [NoiDungTieuChi, IDTieuChiDV]
    );

    return res.status(200).json({
      message: "Update thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let laytentruongdh = async (req, res) => {
  const IDDHCT = req.params.IDDHCT;

  try {
    const [rows, fields1] = await pool.execute(
      "SELECT * FROM dhct where IDDHCT = ?",
      [IDDHCT]
    );

    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataDT: rows[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataDT: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let getAllTruong = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5

    const offset = (page - 1) * pageSize;

    const [sotrang, fields1] = await pool.execute(
      "SELECT * FROM admin where admin.ttTruong = 1"
    );

    const [rows, fields] = await pool.execute(
      "SELECT * FROM admin where admin.ttTruong = 1 LIMIT ? OFFSET ?",
      [pageSize, offset]
    );
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCD: rows,
        totalPages: Math.ceil(sotrang.length / pageSize),
        currentPage: page,
      });
    } else {
      return res.status(200).json({
        dataCD: [],
        totalPages: 0,
        currentPage: 1,
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let laytatcatruong = async (req, res) => {
  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM admin where admin.ttTruong = 1"
    );
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCD: rows,
      });
    } else {
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let ThemTruong = async (req, res) => {
  let { TenTruong, EmailTruong } = req.body;
  console.log(req.body);

  try {
    const [existingRows, _] = await pool.execute(
      "SELECT * FROM admin WHERE EmailTruong = ?",
      [EmailTruong]
    );

    // Nếu đã tồn tại, trả về lỗi
    if (existingRows.length > 0) {
      return res
        .status(400)
        .json({ error: "EmailTruong đã tồn tại trong hệ thống!" });
    }

    const passTruong = EmailTruong.split("@")[0];
    console.log(passTruong);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passTruong, saltRounds);

    let [rows, fields] = await pool.execute(
      "insert into admin(TenTruong, EmailTruong, PassTruong) values (?, ?, ?)",
      [TenTruong, EmailTruong, hashedPassword]
    );

    return res.status(200).json({
      message: "Thêm trường thành công!",
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let searchManyTenTruong = async (req, res) => {
  let { trimmedInfo } = req.body;

  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM admin where TenTruong LIKE ? or EmailTruong LIKE ?",
        ["%" + trimmedInfo + "%", "%" + trimmedInfo + "%"]
      );

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let XoaTruong = async (req, res) => {
  let IDTruong = req.params.selectedIDLop;
  try {
    await pool.execute(
      "update admin set admin.ttTruong = 0 where admin.IDTruong = ?",
      [IDTruong]
    );

    console.log("Xoa thanh cong");

    return res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let LayMotTruong = async (req, res) => {
  const IDTruong = req.params.IDTruong;
  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM admin where admin.IDTruong = ?",

      [IDTruong]
    );

    return res.status(200).json({
      dataCD: rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let CapNhatTruong = async (req, res) => {
  let IDTruong = req.params.IDTruong;
  let { TenTruong, EmailTruong } = req.body;

  try {
    let [rows, fields] = await pool.execute(
      "update admin set TenTruong = ?, EmailTruong = ? where IDTruong = ?",
      [TenTruong, EmailTruong, IDTruong]
    );

    return res.status(200).json({
      dataCD: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let getAllChiDoanCT = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5

    const offset = (page - 1) * pageSize;
    const khoa = req.params.khoa; // Lấy trang từ query parameters, mặc định là trang 1
    const IDTruong = req.params.IDTruong; // Lấy trang từ query parameters, mặc định là trang 1

    const [sotrang, fields1] = await pool.execute(
      "SELECT * FROM lop where (lop.ttLop = 0 or lop.ttLop = 1) and Khoa = ? and IDTruong = ?",
      [khoa, IDTruong]
    );

    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop where (lop.ttLop = 0 or lop.ttLop = 1) and Khoa = ? and IDTruong = ? ORDER BY MaLop ASC LIMIT ? OFFSET ?",
      [khoa, IDTruong, pageSize, offset]
    );
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCD: rows,
        totalPages: Math.ceil(sotrang.length / pageSize),
        currentPage: page,
      });
    } else {
      return res.status(200).json({
        dataCD: [],
        totalPages: 0,
        currentPage: 1,
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let ThemChiDoanCT = async (req, res) => {
  let { MaLop, TenLop, Khoa, Email } = req.body;
  let IDTruong = req.params.IDTruong;
  try {
    const passLop = MaLop;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passLop, saltRounds);

    let [rows, fields] = await pool.execute(
      "insert into lop(MaLop, TenLop, Khoa, EmailLop, PassLop, IDTruong) values (?, ?, ?, ?, ?, ?)",
      [MaLop, TenLop, Khoa, Email, hashedPassword, IDTruong]
    );

    return res.status(200).json({
      dataCD: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let getBCHTruong = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 4; // Lấy số lượng mục trên mỗi trang, mặc định là 5
    const idnamhoc = req.params.idnamhoc;
    const IDTruong = req.params.IDTruong;

    const offset = (page - 1) * pageSize;
    console.log("+==============");
    console.log(idnamhoc);

    const [sotrang, fields1] = await pool.execute(
      "SELECT * FROM admin, anhbch, bchtruong, chitietbch, namhoc, chucvu, dantoc, tongiao where admin.IDTruong = bchtruong.IDTruong and bchtruong.ttBCH = 1 and chitietbch.IDBCH = bchtruong.IDBCH and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDNamHoc = namhoc.IDNamHoc and (chucvu.IDChucVu = 4 or chucvu.IDChucVu = 5 or chucvu.IDChucVu = 6) and bchtruong.IDBCH = anhbch.IDBCH and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and chitietbch.IDNamHoc = ? and admin.IDTruong = ? and chitietbch.ttChiTietBCH = 1",
      [idnamhoc, IDTruong]
    );

    const [rows, fields] = await pool.execute(
      "SELECT * FROM admin, anhbch, bchtruong, chitietbch, namhoc, chucvu, dantoc, tongiao where admin.IDTruong = bchtruong.IDTruong and bchtruong.ttBCH = 1 and chitietbch.IDBCH = bchtruong.IDBCH and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDNamHoc = namhoc.IDNamHoc and (chucvu.IDChucVu = 4 or chucvu.IDChucVu = 5 or chucvu.IDChucVu = 6) and bchtruong.IDBCH = anhbch.IDBCH and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and chitietbch.IDNamHoc = ? and admin.IDTruong = ? and chitietbch.ttChiTietBCH = 1 ORDER BY bchtruong.MaBCH ASC LIMIT ? OFFSET ?",
      [idnamhoc, IDTruong, pageSize, offset]
    );

    console.log(rows);
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCD: rows,
        totalPages: Math.ceil(sotrang.length / pageSize),
        currentPage: page,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let namhoccuabch = async (req, res) => {
  try {
    const [result, fields1] = await Promise.all([
      pool.execute(
        "SELECT DISTINCT chitietbch.IDNamHoc, namhoc.TenNamHoc " +
          " FROM bchtruong " +
          " JOIN chitietbch ON chitietbch.IDBCH = bchtruong.IDBCH " +
          " JOIN namhoc ON chitietbch.IDNamHoc = namhoc.IDNamHoc " +
          " ORDER BY chitietbch.IDNamHoc DESC"
      ),
    ]);

    console.log(result);

    if (result && result.length > 0) {
      return res.status(200).json({
        dataNH: result[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataNH: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let laytenBCH = async (req, res) => {
  const IDBCH = req.params.IDBCH;
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT * FROM bchtruong, anhbch, dantoc, tongiao, admin where bchtruong.IDBCH = anhbch.IDBCH and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and admin.IDTruong = bchtruong.IDTruong and bchtruong.IDBCH = ?",
      [IDBCH]
    );

    console.log(rows);

    if (rows && rows.length > 0) {
      // Định dạng lại ngày trong rows[0].NgayHetHan
      if (rows[0].NgaySinh) {
        const formattedDate = format(new Date(rows[0].NgaySinh), "dd/MM/yyyy");
        rows[0].NgaySinhBCH = formattedDate;
      }

      if (rows[0].NgayVaoDoan) {
        const formattedDate1 = format(
          new Date(rows[0].NgayVaoDoan),
          "dd/MM/yyyy"
        );
        rows[0].NgayVaoDoanBCH = formattedDate1;
      }

      return res.status(200).json({
        dataDV: rows[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataDV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let layDSChucVuBCH = async (req, res) => {
  const IDBCH = req.params.IDBCH;
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT * FROM chitietbch, namhoc, chucvu where chitietbch.IDNamHoc = namhoc.IDNamHoc and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDBCH = ? and chitietbch.ttChiTietBCH = 1",
      [IDBCH]
    );

    console.log(rows);
    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataDV: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataDV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let searchBCHTruong = async (req, res) => {
  console.log(req.body);
  let { IDNamHoc, MaBCH, TenBCH, IDChucVu, IDTruong } = req.body;

  try {
    if (MaBCH !== undefined && TenBCH === "" && IDChucVu === "") {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM anhbch, admin, bchtruong, chitietbch, chucvu, namhoc, tongiao, dantoc where anhbch.IDBCH = bchtruong.IDBCH and bchtruong.ttBCH = 1 and admin.IDTruong = bchtruong.IDTruong and chitietbch.IDBCH = bchtruong.IDBCH and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDNamHoc = namhoc.IDNamHoc and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and bchtruong.MaBCH LIKE ? and (chitietbch.IDChucVu = 4 or chitietbch.IDChucVu = 5 or chitietbch.IDChucVu = 6) and chitietbch.IDNamHoc = ? and bchtruong.IDTruong = ? ORDER BY bchtruong.MaBCH ASC",
        ["%" + MaBCH + "%", IDNamHoc, IDTruong]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else if (MaBCH === "" && TenBCH !== undefined && IDChucVu === "") {
      const [rowsTenLop, fields] = await pool.execute(
        "SELECT * FROM anhbch, admin, bchtruong, chitietbch, chucvu, namhoc, tongiao, dantoc where anhbch.IDBCH = bchtruong.IDBCH and bchtruong.ttBCH = 1 and admin.IDTruong = bchtruong.IDTruong and chitietbch.IDBCH = bchtruong.IDBCH and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDNamHoc = namhoc.IDNamHoc and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and bchtruong.TenBCH LIKE ? and (chitietbch.IDChucVu = 4 or chitietbch.IDChucVu = 5 or chitietbch.IDChucVu = 6) and chitietbch.IDNamHoc = ? and bchtruong.IDTruong = ? ORDER BY bchtruong.MaBCH ASC",
        ["%" + TenBCH + "%", IDNamHoc, IDTruong]
      );

      console.log(rowsTenLop);

      return res.status(200).json({
        dataCD: rowsTenLop,
      });
    } else if (MaBCH === "" && TenBCH === "" && IDChucVu !== undefined) {
      const [rowsKhoa, fields] = await pool.execute(
        "SELECT * FROM anhbch, admin, bchtruong, chitietbch, chucvu, namhoc, tongiao, dantoc where anhbch.IDBCH = bchtruong.IDBCH and bchtruong.ttBCH = 1 and admin.IDTruong = bchtruong.IDTruong and chitietbch.IDBCH = bchtruong.IDBCH and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDNamHoc = namhoc.IDNamHoc and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and chitietbch.IDChucVu = ? and (chitietbch.IDChucVu = 4 or chitietbch.IDChucVu = 5 or chitietbch.IDChucVu = 6) and chitietbch.IDNamHoc = ? and bchtruong.IDTruong = ? ORDER BY bchtruong.MaBCH ASC",
        [IDChucVu, IDNamHoc, IDTruong]
      );

      console.log(rowsKhoa);

      return res.status(200).json({
        dataCD: rowsKhoa,
      });
    } else if (MaBCH !== undefined && TenBCH !== undefined && IDChucVu === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anhbch, admin, bchtruong, chitietbch, chucvu, namhoc, tongiao, dantoc where anhbch.IDBCH = bchtruong.IDBCH and bchtruong.ttBCH = 1 and admin.IDTruong = bchtruong.IDTruong and chitietbch.IDBCH = bchtruong.IDBCH and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDNamHoc = namhoc.IDNamHoc and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and bchtruong.MaBCH LIKE ? and bchtruong.TenBCH LIKE ? and (chitietbch.IDChucVu = 4 or chitietbch.IDChucVu = 5 or chitietbch.IDChucVu = 6) and chitietbch.IDNamHoc = ? and bchtruong.IDTruong = ? ORDER BY bchtruong.MaBCH ASC",
        ["%" + MaBCH + "%", "%" + TenBCH + "%", IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MaBCH !== undefined && TenBCH === "" && IDChucVu !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anhbch, admin, bchtruong, chitietbch, chucvu, namhoc, tongiao, dantoc where anhbch.IDBCH = bchtruong.IDBCH and bchtruong.ttBCH = 1 and admin.IDTruong = bchtruong.IDTruong and chitietbch.IDBCH = bchtruong.IDBCH and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDNamHoc = namhoc.IDNamHoc and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and bchtruong.MaBCH LIKE ? and chitietbch.IDChucVu = ? and (chitietbch.IDChucVu = 4 or chitietbch.IDChucVu = 5 or chitietbch.IDChucVu = 6) and chitietbch.IDNamHoc = ? and bchtruong.IDTruong = ? ORDER BY bchtruong.MaBCH ASC",
        ["%" + MaBCH + "%", IDChucVu, IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MaBCH === "" && TenBCH !== undefined && IDChucVu !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anhbch, admin, bchtruong, chitietbch, chucvu, namhoc, tongiao, dantoc where anhbch.IDBCH = bchtruong.IDBCH and bchtruong.ttBCH = 1 and admin.IDTruong = bchtruong.IDTruong and chitietbch.IDBCH = bchtruong.IDBCH and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDNamHoc = namhoc.IDNamHoc and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and bchtruong.TenBCH LIKE ? and chitietbch.IDChucVu = ? and (chitietbch.IDChucVu = 4 or chitietbch.IDChucVu = 5 or chitietbch.IDChucVu = 6) and chitietbch.IDNamHoc = ? and bchtruong.IDTruong = ? ORDER BY bchtruong.MaBCH ASC",

        ["%" + TenBCH + "%", IDChucVu, IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaBCH !== undefined &&
      TenBCH !== undefined &&
      IDChucVu !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anhbch, admin, bchtruong, chitietbch, chucvu, namhoc, tongiao, dantoc where anhbch.IDBCH = bchtruong.IDBCH and bchtruong.ttBCH = 1 and admin.IDTruong = bchtruong.IDTruong and chitietbch.IDBCH = bchtruong.IDBCH and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDNamHoc = namhoc.IDNamHoc and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and bchtruong.MaBCH LIKE ? and bchtruong.TenBCH LIKE ? and chitietbch.IDChucVu = ? and (chitietbch.IDChucVu = 4 or chitietbch.IDChucVu = 5 or chitietbch.IDChucVu = 6) and chitietbch.IDNamHoc = ? and bchtruong.IDTruong = ? ORDER BY bchtruong.MaBCH ASC",

        ["%" + MaBCH + "%", "%" + TenBCH + "%", IDChucVu, IDNamHoc, IDTruong]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let searchManyBCH = async (req, res) => {
  let { trimmedInfo, IDNamHoc, IDTruong } = req.body;
  console.log(req.body);

  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM anhbch, admin, bchtruong, chitietbch, chucvu, namhoc, tongiao, dantoc where anhbch.IDBCH = bchtruong.IDBCH and bchtruong.ttBCH = 1 and admin.IDTruong = bchtruong.IDTruong and chitietbch.IDBCH = bchtruong.IDBCH and chitietbch.IDChucVu = chucvu.IDChucVu and chitietbch.IDNamHoc = namhoc.IDNamHoc and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and (bchtruong.MaBCH LIKE ? or bchtruong.TenBCH LIKE ? or chucvu.TenCV LIKE ?) and (chitietbch.IDChucVu = 4 or chitietbch.IDChucVu = 5 or chitietbch.IDChucVu = 6) and chitietbch.IDNamHoc = ? and bchtruong.IDTruong = ? ORDER BY bchtruong.MaBCH ASC",

        [
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          IDNamHoc,
          IDTruong,
        ]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let XoaBCHTruong = async (req, res) => {
  let IDBCH = req.params.IDBCH;

  try {
    await pool.execute("Update bchtruong set ttBCH = 0 where IDBCH = ?", [
      IDBCH,
    ]);

    console.log("Xoa thanh cong");
    return res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let XoaChiTietBCH = async (req, res) => {
  let IDChiTietBCH = req.params.IDChiTietBCH;

  try {
    await pool.execute(
      "Update chitietbch set ttChiTietBCH = 0 where IDChiTietBCH = ?",
      [IDChiTietBCH]
    );

    console.log("Xoa thanh cong");
    return res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let CapNhatThongTinDHCT = async (req, res) => {
  let { IDDHCT, TenTruongDH, EmailDH } = req.body;

  console.log("data", req.body);

  try {
    let [rows, fields] = await pool.execute(
      "update dhct set TenTruongDH = ?, EmailDH = ? where IDDHCT = ?",
      [TenTruongDH, EmailDH, IDDHCT]
    );

    return res.status(200).json({
      dataDT: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let DoiMatKhauDHCT = async (req, res) => {
  try {
    const IDDHCT = req.params.IDDHCT;
    const { oldPassword, newPassword } = req.body;
    console.log(IDDHCT);
    const [result, fields] = await pool.execute(
      "SELECT PassDH FROM dhct WHERE dhct.IDDHCT = ?",
      [IDDHCT]
    );

    if (result && result.length > 0) {
      const hashedPassword = result[0].PassDH;

      if (hashedPassword) {
        // So sánh mật khẩu cũ
        const match = await bcrypt.compare(oldPassword, hashedPassword);

        if (match) {
          // Băm mật khẩu mới
          const saltRounds = 10;
          const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

          // Cập nhật mật khẩu mới vào cơ sở dữ liệu
          const [updateResult, fieldUpdate] = await pool.execute(
            "UPDATE dhct SET PassDH = ? WHERE IDDHCT = ?",
            [newHashedPassword, IDDHCT]
          );
          console.log(updateResult);
          if (updateResult && updateResult.affectedRows > 0) {
            console.log("Đổi mật khẩu thành công!");
            return res.status(200).json({
              success: true,
              message: "Đổi mật khẩu thành công!",
            });
          } else {
            console.log("Không thể cập nhật mật khẩu mới!");
            return res.status(500).json({
              error: "Không thể cập nhật mật khẩu mới!",
            });
          }
        } else {
          console.log("Mật khẩu cũ không đúng!");
          return res.status(500).json({
            error: "Mật khẩu cũ không đúng!",
          });
        }
      } else {
        console.log("Không tìm thấy mật khẩu trong cơ sở dữ liệu!");
        return res.status(500).json({
          error: "Không tìm thấy mật khẩu trong cơ sở dữ liệu!",
        });
      }
    } else {
      console.log("Không tìm thấy người dùng!");
      return res.status(200).json({
        dataDV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let laytenBCHTruong = async (req, res) => {
  const IDBCH = req.params.IDBCH;
  const IDTruong = req.params.IDTruong;
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT * FROM bchtruong, anhbch, dantoc, tongiao, admin where bchtruong.IDBCH = anhbch.IDBCH and bchtruong.IDDanToc = dantoc.IDDanToc and bchtruong.IDTonGiao = tongiao.IDTonGiao and admin.IDTruong = bchtruong.IDTruong and bchtruong.IDBCH = ? and bchtruong.IDTruong = ?",
      [IDBCH, IDTruong]
    );

    console.log(rows);

    if (rows && rows.length > 0) {
      // Định dạng lại ngày trong rows[0].NgayHetHan
      if (rows[0].NgaySinh) {
        const formattedDate = format(new Date(rows[0].NgaySinh), "dd/MM/yyyy");
        rows[0].NgaySinhBCH = formattedDate;
      }

      if (rows[0].NgayVaoDoan) {
        const formattedDate1 = format(
          new Date(rows[0].NgayVaoDoan),
          "dd/MM/yyyy"
        );
        rows[0].NgayVaoDoanBCH = formattedDate1;
      }

      return res.status(200).json({
        dataDV: rows[0],
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataDV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let doimatkhaubch = async (req, res) => {
  try {
    const IDBCH = req.params.IDBCH;
    const { oldPassword, newPassword } = req.body;
    console.log(IDBCH);
    const [result, fields] = await pool.execute(
      "SELECT PassBCH FROM bchtruong WHERE bchtruong.IDBCH = ?",
      [IDBCH]
    );

    if (result && result.length > 0) {
      const hashedPassword = result[0].PassBCH;

      if (hashedPassword) {
        // So sánh mật khẩu cũ
        const match = await bcrypt.compare(oldPassword, hashedPassword);

        if (match) {
          // Băm mật khẩu mới
          const saltRounds = 10;
          const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

          // Cập nhật mật khẩu mới vào cơ sở dữ liệu
          const [updateResult, fieldUpdate] = await pool.execute(
            "UPDATE bchtruong SET PassBCH = ? WHERE IDBCH = ?",
            [newHashedPassword, IDBCH]
          );
          console.log(updateResult);
          if (updateResult && updateResult.affectedRows > 0) {
            console.log("Đổi mật khẩu thành công!");
            return res.status(200).json({
              success: true,
              message: "Đổi mật khẩu thành công!",
            });
          } else {
            console.log("Không thể cập nhật mật khẩu mới!");
            return res.status(500).json({
              error: "Không thể cập nhật mật khẩu mới!",
            });
          }
        } else {
          console.log("Mật khẩu cũ không đúng!");
          return res.status(500).json({
            error: "Mật khẩu cũ không đúng!",
          });
        }
      } else {
        console.log("Không tìm thấy mật khẩu trong cơ sở dữ liệu!");
        return res.status(500).json({
          error: "Không tìm thấy mật khẩu trong cơ sở dữ liệu!",
        });
      }
    } else {
      console.log("Không tìm thấy người dùng!");
      return res.status(200).json({
        dataDV: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let LayAnhDiemDanh = async (req, res) => {
  const IDDoanVien = req.params.IDDoanVien;
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT DDTenAnh, MaLop FROM anhdiemdanh, doanvien, lop where anhdiemdanh.IDDoanVien = ? and doanvien.IDDoanVien = anhdiemdanh.IDDoanVien and doanvien.IDLop = lop.IDLop",
      [IDDoanVien]
    );

    console.log(rows);

    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataAnh: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataAnh: [],
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let layDSHoatDongDHCT = async (req, res) => {
  console.log(req.params)
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5
    const IDNamHoc = req.params.idnamhoc;

    const offset = (page - 1) * pageSize;

    const [sotrang, fields] = await pool.execute(
      "SELECT * FROM hoatdongtruong where (ttHDDHCT = 0 or ttHDDHCT = 1 or ttHDDHCT = 2) and IDNamHoc = ?",
      [IDNamHoc]
    );

    const [result1, result2] = await Promise.all([
      pool.execute(
        "UPDATE hoatdongtruong SET ttHDDHCT = CASE WHEN ttHDDHCT = 3 THEN 3 WHEN NgayBatDauDHCT > CURRENT_DATE THEN 0 WHEN NgayBatDauDHCT <= CURRENT_DATE AND NgayHetHanDHCT > CURRENT_DATE THEN 1 WHEN NgayHetHanDHCT < CURRENT_DATE THEN 2 END"
      ),
      pool.execute(
        "SELECT * FROM hoatdongtruong where (ttHDDHCT = 0 or ttHDDHCT = 1 or ttHDDHCT = 2) and idnamhoc = ? LIMIT ? OFFSET ?",
        [IDNamHoc, pageSize, offset]
      ),
    ]);

    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataHD: result2[0],
        totalPages: Math.ceil(sotrang.length / pageSize),
        currentPage: page,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataHD: [],
        totalPages: 0,
        currentPage: 1,
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let layMotHoatDongDHCT = async (req, res) => {
  try {
    const IDHoatDong = req.params.IDHoatDongDHCT;
console.log(IDHoatDong)
    const [rows, result2] = await pool.execute(
      "SELECT * FROM hoatdongtruong where IDHoatDongDHCT = ?",
      [IDHoatDong]
    );

    if (rows.length > 0) {
      // Định dạng lại ngày trong rows[0].NgayHetHan
      const formattedDate = format(new Date(rows[0].NgayBatDauDHCT), "dd/MM/yyyy");
      const formattedDate1 = format(new Date(rows[0].NgayHetHanDHCT), "dd/MM/yyyy");

      // Gán lại giá trị đã định dạng vào rows[0].NgayHetHan
      rows[0].NgayBatDauDHCT = formattedDate;
      rows[0].NgayHetHanDHCT = formattedDate1;
    }

    console.log(rows);

    return res.status(200).json({
      dataHD: rows[0],
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let capNhatHoatDongDHCT = async (req, res) => {
  console.log(req.body)
  try {
    const { IDHoatDongDHCT, TenHoatDongDHCT, NgayBatDauDHCT, NgayHetHanDHCT, ChiTietHDDHCT } =
      req.body;

    if (!TenHoatDongDHCT || !NgayBatDauDHCT || !NgayHetHanDHCT || !ChiTietHDDHCT) {
      return res.status(400).json({
        error: "Vui lòng cung cấp đầy đủ thông tin để cập nhật hoạt động.",
      });
    }

    const parsedNgayBatDau = format(
      parse(NgayBatDauDHCT, "dd/MM/yyyy", new Date()),
      "yyyy/MM/dd"
    );
    const parsedNgayHetHan = format(
      parse(NgayHetHanDHCT, "dd/MM/yyyy", new Date()),
      "yyyy/MM/dd"
    );

    // Thực hiện truy vấn cập nhật
    const updateQuery =
      "UPDATE hoatdongtruong SET TenHoatDongDHCT=?, NgayBatDauDHCT=?, NgayHetHanDHCT=?, ChiTietHDDHCT = ? WHERE IDHoatDongDHCT=?";
    const [result] = await pool.execute(updateQuery, [
      TenHoatDongDHCT,
      parsedNgayBatDau,
      parsedNgayHetHan,
      ChiTietHDDHCT,
      IDHoatDongDHCT,
    ]);

    console.log(result);

    // Kiểm tra xem có bản ghi nào được cập nhật hay không
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Không tìm thấy hoạt động để cập nhật.",
      });
    }

    // Lấy thông tin hoạt động sau khi cập nhật
    return res.status(200).json({
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật hoạt động: ", error);
    return res.status(500).json({
      error: "Lỗi khi cập nhật hoạt động",
    });
  }
};

/* Tìm kiếm hoạt động */
let searchHoatDongDHCT = async (req, res) => {
  let { TenHoatDong, Thang, ttHD, IDNamHoc } = req.body;
  console.log(req.body);
  console.log(TenHoatDong);
  console.log(Thang);
  console.log(ttHD);

  try {
    if (TenHoatDong !== undefined && Thang === "" && ttHD === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdongtruong where hoatdongtruong.TenHoatDongDHCT LIKE ? and ttHDDHCT != 3 and hoatdongtruong.IDNamHoc = ?",
        ["%" + TenHoatDong + "%", IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (TenHoatDong == "" && Thang !== undefined && ttHD === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdongtruong where MONTH(hoatdongtruong.NgayBatDauDHCT) = ? and hoatdongtruong.IDNamHoc = ?",
        [Thang, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (TenHoatDong == "" && Thang === "" && ttHD !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdongtruong where hoatdongtruong.ttHDDHCT = ? and hoatdongtruong.IDNamHoc = ?",
        [ttHD, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (
      TenHoatDong !== undefined &&
      Thang !== undefined &&
      ttHD === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdongtruong where hoatdongtruong.TenHoatDongDHCT LIKE ? and MONTH(hoatdongtruong.NgayBatDauDHCT) = ? and hoatdongtruong.IDNamHoc = ?",
        ["%" + TenHoatDong + "%", Thang, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (
      TenHoatDong !== undefined &&
      Thang === "" &&
      ttHD !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdongtruong where hoatdongtruong.TenHoatDongDHCT LIKE ? and hoatdonhoatdongtruongg.ttHDDHCT = ? and hoatdongtruong.IDNamHoc = ?",
        ["%" + TenHoatDong + "%", ttHD, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (
      TenHoatDong === "" &&
      Thang !== undefined &&
      ttHD !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdongtruong where MONTH(hoatdongtruong.NgayBatDauDHCT) = ? and hoatdongtruong.ttHDDHCT = ? and hoatdongtruong.IDNamHoc = ?",
        [Thang, ttHD, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (
      TenHoatDong !== undefined &&
      Thang !== undefined &&
      ttHD !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdongtruong where hoatdongtruong.TenHoatDongDHCT LIKE ? and MONTH(hoatdongtruong.NgayBatDauDHCT) = ? and hoatdongtruong.ttHDDHCT = ? and hoatdongtruong.IDNamHoc = ?",
        ["%" + TenHoatDong + "%", Thang, ttHD, IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataCD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

let searchManyInfoHDdhct = async (req, res) => {
  console.log(req.body);

  let { trimmedInfo, IDNamHoc } = req.body;
  console.log(trimmedInfo);

  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM hoatdongtruong where TenHoatDongDHCT LIKE ? and IDNamHoc = ?",
        ["%" + trimmedInfo + "%", IDNamHoc]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataHD: rowsMaLop,
      });
    } else {
      console.log("Không tìm thấy kết quả");
      return res.status(200).json({
        dataHD: [],
      });
    }
  } catch (error) {
    console.error("Lỗi truy vấn:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
  }
};

// Thêm hoạt động
let TaoHoatDongDHCT = async (req, res) => {
  let {
    TenHoatDong,
    NgayBatDau,
    NgayHetHan,
    ChiTietHoatDong,
    IDNamHoc,
  } = req.body;

  try {
    let [rows, fields] = await pool.execute(
      "insert into hoatdongtruong(TenHoatDongDHCT, NgayTaoDHCT, NgayBatDauDHCT, NgayHetHanDHCT, ChiTietHDDHCT, IDNamHoc) values (?, NOW(), ?, ?, ?, ?)",
      [TenHoatDong, NgayBatDau, NgayHetHan, ChiTietHoatDong, IDNamHoc]
    );

    console.log("1");

    pool.execute(
      "UPDATE hoatdongtruong SET ttHDDHCT = CASE WHEN ttHDDHCT = 3 THEN 3 WHEN NgayBatDauDHCT > CURRENT_DATE THEN 0 WHEN NgayBatDauDHCT <= CURRENT_DATE AND NgayHetHanDHCT > CURRENT_DATE THEN 1 WHEN NgayHetHanDHCT < CURRENT_DATE THEN 2 END"
    );

    console.log("2");

    const [newHoatDong] = await pool.execute(
      "SELECT * FROM hoatdongtruong WHERE IDHoatDongDHCT = ?",
      [rows.insertId]
    );

    console.log("3");

    let [tatcalop, fields2] = await pool.execute(
      "SELECT * FROM bchtruong, chitietbch where bchtruong.IDBCH = chitietbch.IDBCH and bchtruong.ttBCH = 1 and chitietbch.IDNamHoc = ?", [IDNamHoc]
    );

    console.log("4");

    console.log(tatcalop);

    for (const lop of tatcalop) {
      await pool.execute(
        "INSERT INTO chitiethoatdongdhct(IDHoatDongDHCT, IDBCH) VALUES (?, ?)",
        [newHoatDong[0].IDHoatDongDHCT, lop.IDBCH]
      )
    }

    return res.status(200).json({
      dataHD: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let deleteHoatDongDHCT = async (req, res) => {
  let IDHoatDongDHCT = req.params.IDHoatDongDHCT;
  console.log(IDHoatDongDHCT);
  await pool.execute("update hoatdongtruong set ttHDDHCT = 3 where IDHoatDongDHCT = ?", [
    IDHoatDongDHCT,
  ]);

  console.log("Xoas thanhf cong 1");
  return res.status(200).json({
    message: "Xóa thành công!",
  });
};

let LayDSDiemDanhDHCT = async (req, res) => {
  console.log(req.params)
    try {
    const IDNamHoc = req.params.IDNamHoc;
    const IDHoatDongDHCT = req.params.IDHoatDongDHCT;
    const IDTruong = req.params.IDTruong
    // Modify your SQL query in LayDSNopDoanPhi function
    const [rows, result2] = await pool.execute(
      "SELECT * from admin, namhoc, hoatdongtruong, chitiethoatdongdhct, bchtruong, anhbch where hoatdongtruong.IDNamHoc = namhoc.IDNamHoc and hoatdongtruong.IDHoatDongDHCT = chitiethoatdongdhct.IDHoatDongDHCT and chitiethoatdongdhct.IDBCH = bchtruong.IDBCH and admin.IDTruong = bchtruong.IDTruong and bchtruong.IDBCH = anhbch.IDBCH and hoatdongtruong.IDNamHoc = ? and hoatdongtruong.IDHoatDongDHCT = ? and admin.IDTruong = ?",
      [IDNamHoc, IDHoatDongDHCT, IDTruong]
    );

    console.log(rows)
    return res.status(200).json({
      dataHD: rows
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
    return res.status(500).json({
      error: "Lỗi khi truy vấn cơ sở dữ liệu",
    });
  }
};

let SaveCheckboxStatesDiemDanhDHCT = async (req, res) => {
  let { IDHoatDongDHCT, checkboxStates } = req.body;

  console.log(req.body);
  console.log("+=============");
  console.log(checkboxStates);

  try {
    // Assuming checkboxStates is an array of objects with IDChiTietDoanPhi and isChecked
    for (let { IDChiTietDHCT, isChecked } of checkboxStates) {
      if (isChecked == false) {
        isChecked = 0;
      } else {
        isChecked = 1;
      }
      console.log(isChecked);
      await pool.execute(
        "UPDATE chitiethoatdongdhct SET DaDiemDanhBCH = ? WHERE IDChiTietDHCT = ? and IDHoatDongDHCT = ?",
        [isChecked, IDChiTietDHCT, IDHoatDongDHCT]
      );
      console.log("tc")
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    console.error("Error updating checkbox states:", error);
    return res.status(500).json({ message: "Cập nhật thành công!" });
  }
};

let layMaBCH = async (req, res) => {
  const MaBCH = req.params.MaBCH;
  console.log(MaBCH);
  try {
    let rows;

    if (MaBCH === "Người lạ") {
      // Nếu MaBCH là "Người lạ", gán TenBCH là "Người lạ"
      rows = [{ IDBCH: null, MaBCH: "Người lạ", TenBCH: "Người lạ" }];
    } else {
      // Nếu MaBCH không phải là "Người lạ", truy vấn cơ sở dữ liệu bình thường
      [rows] = await pool.execute(
        "SELECT IDBCH, MaBCH, TenBCH FROM bchtruong where bchtruong.MaBCH = ?",
        [MaBCH]
      );
    }

    console.log(rows);
    return res.status(200).json({
      dataDV: rows,
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let SaveIDBCH = async (req, res) => {
  console.log(req.body);
  let { IDHoatDongDHCT, IDBCHList } = req.body;

  try {
    // Assuming checkboxStates is an array of objects with IDChiTietDoanPhi and isChecked
    for (let IDBCH of IDBCHList) {
      const [rows] = await pool.execute(
        "SELECT COUNT(*) AS count FROM bchtruong WHERE IDBCH = ?",
        [IDBCH]
      );

      if (rows[0].count > 0) {
        await pool.execute(
          "UPDATE chitiethoatdongdhct SET DaDiemDanhBCH = 1 WHERE IDBCH = ? and IDHoatDongDHCT = ?",
          [IDBCH, IDHoatDongDHCT]
        );
      } else {
        // IDDoanVien không tồn tại, có thể xử lý theo ý của bạn
        console.log(`IDDoanVien ${IDBCH} không tồn tại`);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Điểm danh thành công!",
    });
  } catch (error) {
    console.error("Điểm danh thất bại!: ", error);
    return res.status(500).json({ message: "Điểm danh thất bại!" });
  }
};

let ThemNamHoc = async (req, res) => {
  console.log("123", req.body);
  let { TenNamHoc } = req.body;
  const [rows, result2] = await pool.execute(
    "SELECT TenNamHoc from namhoc where namhoc.TenNamHoc = ?",
    [TenNamHoc]
  );
  try {
    if(rows.length > 0) {
      console.log("Nam hoc da ton tai")
      return res.status(400).json({
       message: "Nam hoc da ton tai"
      });
    } else {
      let [rows, fields] = await pool.execute(
        "insert into namhoc(TenNamHoc) values (?)",
        [TenNamHoc]
      );
      console.log("ThanhCong")

      return res.status(200).json({
        message: "Thêm năm học thành công!"
       });
    }
  } catch (error) {
    console.error("Thêm năm học thất bại!: ", error);
    return res.status(400).json({
      message: "Thêm năm học thất bại!"
     }); // Thay đổi ở đây
  }
};


let XoaNamHoc = async (req, res) => {
  let IDNamHoc = req.params.IDNamHoc;

  try {
    await pool.execute("Update namhoc set ttNamHoc = 0 where IDNamHoc = ?", [
      IDNamHoc,
    ]);

    console.log("Xoa thanh cong");
    return res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

module.exports = {
  XoaNamHoc,
  ThemNamHoc,
  SaveIDBCH,
  layMaBCH,
  SaveCheckboxStatesDiemDanhDHCT,
  LayDSDiemDanhDHCT,
  TaoHoatDongDHCT,
  deleteHoatDongDHCT,
  searchManyInfoHDdhct,
  searchHoatDongDHCT,
  capNhatHoatDongDHCT,
  layMotHoatDongDHCT,
  layDSHoatDongDHCT,
  SaveIDDoanVienDiemDanhCuaLop,
  doimatkhaubch,
  laytenBCHTruong,
  DoiMatKhauDHCT,
  CapNhatThongTinDHCT,
  XoaChiTietDoanVien,
  XoaChiTietBCH,
  XoaBCHTruong,
  searchManyBCH,
  searchBCHTruong,
  layDSChucVuBCH,
  laytenBCH,
  namhoccuabch,
  getBCHTruong,
  DanhSachUngTuyenCT,
  laytatcatruong,
  ThemChiDoanCT,
  LayMotTruong,
  CapNhatTruong,
  XoaTruong,
  getAllTruong,
  getAllChiDoan,
  laytenlop,
  getKhoa,
  getSearchChiDoan,
  getSearchManyChiDoan,
  getDetailChiDoan,
  ThemChiDoan,
  XoaChiDoan,
  laymotchidoan,
  CapNhatChiDoan,
  CapNhatThongTinLop,
  getAllChiDoanCT,

  getBCH,
  getBCHMotLop,
  getSearchBCH,
  searchManyDoanVienBCH,
  getChucVu,
  deleteBanChapHanh,

  getSearchDoanVien,
  getSearchDGDoanVien,
  getSearchManyDoanVien,
  laymotdoanvien,
  deleteDoanVien,

  layDSHoatDong,
  searchHoatDong,
  getSearchManyHoatDong,
  TaoHoatDong,
  layMotHoatDong,
  capNhatHoatDong,
  deleteHoatDong,
  LayDSDiemDanh,
  SaveCheckboxStatesDiemDanh,

  namhoc,
  searchNamHoc,
  namhoccuamotchidoan,
  namhoccuamotkhoa,
  namhoccuaxeploai,

  layDSDoanPhi,
  layDSDoanPhiCuaMotLop,
  XoaDoanPhi,
  ThemDoanPhi,
  LayMotDoanPhi,
  CapNhatDoanPhi,
  LayDSNopDoanPhi,
  SaveCheckboxStates,

  LayDanToc,
  LayTonGiao,

  LayDSNopDoanPhiCuaMotLop,
  SaveCheckboxStatesCuaMotLop,

  layDSHoatDongCuaLop,
  LayDSDiemDanhCuaLop,
  SaveCheckboxStatesDiemDanhCuaLop,

  laytendoanvien,
  timbangmssv,
  // dvlaymotdoanvien,
  layDSChucVuDoanVien,
  layDSDanhGiaDoanVien,
  layDSHoatDongCuaDoanVien,
  DanhSachUngTuyen,
  DanhSachUngTuyenCuaLop,
  DanhSachUngTuyenCuaDV,
  MauUngTuyen,
  CapNhatUngTuyenCuaDV,
  getSearchSVNT,

  DiemCuaMotDoanVien,
  LayDiemCuaMotDoanVien,
  KetQuaCuaMotDoanVien,
  layDSDoanPhiCuaDoanVien,
  DoiMatKhauDoanVien,

  DanhSachDanhGiaDoanVienCuaLop,
  DanhGiaChiDoan,

  laytentruong,
  ThemTruong,
  DoiMatKhauDoanTruong,
  CapNhatThongTinDoanTruong,
  DoiMatKhauLop,
  DanhGiaCuaTungChiDoan,
  guiMaXacNhan,

  LayTieuChi,
  LayMotTieuChi,
  CapNhatMotTieuChi,

  LayTieuChiChiDoan,
  CapNhatMotTieuChiCD,
  LayTieuChiDoanVien,
  CapNhatTieuChiDoanVien,

  laytentruongdh,
  searchManyTenTruong,

  LayAnhDiemDanh,
};
