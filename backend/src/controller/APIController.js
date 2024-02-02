import pool from "../configs/connectDB";
const XLSX = require("xlsx");
const { parse, format } = require("date-fns");
const bcrypt = require("bcrypt");

//Lấy danh sách chi đoàn
let getAllChiDoan = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5

    const offset = (page - 1) * pageSize;

    const [sotrang, fields1] = await pool.execute(
      "SELECT * FROM lop where (lop.ttLop = 0 or lop.ttLop = 1)"
    );

    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop where (lop.ttLop = 0 or lop.ttLop = 1) ORDER BY MaLop ASC LIMIT ? OFFSET ?",
      [pageSize, offset]
    );
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
      "SELECT MaLop FROM lop where IDLop = ?",
      [IDLop]
    );

    if (rows && rows.length > 0) {
      return res.status(200).json({
        dataCD: rows[0],
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

//Tìm kiếm chi đoàn theo tên và mã lớp
let getSearchChiDoan = async (req, res) => {
  let { MaLop, TenLop, Khoa, ttLop } = req.body;
  console.log(MaLop);
  console.log(TenLop);
  console.log(Khoa);
  console.log(ttLop);

  try {
    if (MaLop !== undefined && TenLop === "" && Khoa === "" && ttLop === "") {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM lop where MaLop LIKE ?",
        ["%" + MaLop + "%"]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else if (
      MaLop === "" &&
      TenLop !== undefined &&
      Khoa === "" &&
      ttLop === ""
    ) {
      const [rowsTenLop, fields] = await pool.execute(
        "SELECT * FROM lop where TenLop LIKE ?",
        ["%" + TenLop + "%"]
      );

      console.log(rowsTenLop);

      return res.status(200).json({
        dataCD: rowsTenLop,
      });
    } else if (
      MaLop === "" &&
      TenLop === "" &&
      Khoa !== undefined &&
      ttLop === ""
    ) {
      const [rowsKhoa, fields] = await pool.execute(
        "SELECT * FROM lop where Khoa = ?",
        [Khoa]
      );

      console.log(rowsKhoa);

      return res.status(200).json({
        dataCD: rowsKhoa,
      });
    } else if (
      MaLop === "" &&
      TenLop === "" &&
      Khoa === "" &&
      ttLop !== undefined
    ) {
      // if (ttLop == "Đã tốt nghiệp") {
      //   ttLop = 0;
      // } else {
      //   ttLop = 1;
      // }
      const [rowsTrangThai, fields] = await pool.execute(
        "SELECT * FROM lop where ttLop = ?",
        [ttLop]
      );

      console.log(rowsTrangThai);

      return res.status(200).json({
        dataCD: rowsTrangThai,
      });
    } else if (
      MaLop !== undefined &&
      TenLop !== undefined &&
      Khoa === "" &&
      ttLop === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (TenLop LIKE ? and MaLop LIKE ?)",
        ["%" + TenLop + "%", "%" + MaLop + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop !== undefined &&
      TenLop === "" &&
      Khoa !== undefined &&
      ttLop === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (Khoa = ? and MaLop LIKE ?)",
        [Khoa, "%" + MaLop + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop !== undefined &&
      TenLop === "" &&
      Khoa === "" &&
      ttLop !== undefined
    ) {
      // if (ttLop == "Đã tốt nghiệp") {
      //   ttLop = 0;
      // } else {
      //   ttLop = 1;
      // }

      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (ttLop = ? and MaLop LIKE ?)",
        [ttLop, "%" + MaLop + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop === "" &&
      TenLop !== undefined &&
      Khoa !== undefined &&
      ttLop === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (TenLop LIKE ? and Khoa = ?)",
        ["%" + TenLop + "%", Khoa]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop === "" &&
      TenLop !== undefined &&
      Khoa === "" &&
      ttLop !== undefined
    ) {
      // if (ttLop == "Đã tốt nghiệp") {
      //   ttLop = 0;
      // } else {
      //   ttLop = 1;
      // }

      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (ttLop = ? and TenLop LIKE ?)",
        [ttLop, "%" + TenLop + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop === "" &&
      TenLop === "" &&
      Khoa !== undefined &&
      ttLop !== undefined
    ) {
      // if (ttLop == "Đã tốt nghiệp") {
      //   ttLop = 0;
      // } else {
      //   ttLop = 1;
      // }

      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (ttLop = ? and Khoa = ?)",
        [ttLop, Khoa]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop !== undefined &&
      TenLop !== undefined &&
      Khoa !== undefined &&
      ttLop === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (Khoa = ? and TenLop LIKE ? and MaLop LIKE ?)",
        [Khoa, "%" + TenLop + "%", "%" + MaLop + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop !== undefined &&
      TenLop === "" &&
      Khoa !== undefined &&
      ttLop !== undefined
    ) {
      // if (ttLop == "Đã tốt nghiệp") {
      //   ttLop = 0;
      // } else {
      //   ttLop = 1;
      // }
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (Khoa = ? and ttlop = ? and MaLop LIKE ?)",
        [Khoa, ttLop, "%" + MaLop + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop !== undefined &&
      TenLop !== undefined &&
      Khoa === "" &&
      ttLop !== undefined
    ) {
      // if (ttLop == "Đã tốt nghiệp") {
      //   ttLop = 0;
      // } else {
      //   ttLop = 1;
      // }
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (ttLop = ? and TenLop LIKE ? and MaLop LIKE ?)",
        [ttLop, "%" + TenLop + "%", "%" + MaLop + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop === "" &&
      TenLop !== undefined &&
      Khoa !== undefined &&
      ttLop !== undefined
    ) {
      // if (ttLop == "Đã tốt nghiệp") {
      //   ttLop = 0;
      // } else {
      //   ttLop = 1;
      // }

      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (ttLop = ? and TenLop LIKE ? and Khoa = ?)",
        [ttLop, "%" + TenLop + "%", Khoa]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MaLop !== undefined &&
      TenLop !== undefined &&
      Khoa !== undefined &&
      ttLop !== undefined
    ) {
      // if (ttLop == "Đã tốt nghiệp") {
      //   ttLop = 0;
      // } else {
      //   ttLop = 1;
      // }

      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop where (ttLop = ? and Khoa = ? and TenLop LIKE ? and MaLop LIKE ?)",
        [ttLop, Khoa, "%" + TenLop + "%", "%" + MaLop + "%"]
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

let getSearchManyChiDoan = async (req, res) => {
  console.log(req.body);

  let { trimmedInfo } = req.body;
  console.log(trimmedInfo);

  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM lop where MaLop LIKE ? or TenLop LIKE ? or Khoa = ?",
        ["%" + trimmedInfo + "%", "%" + trimmedInfo + "%", trimmedInfo]
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

let ThemChiDoan = async (req, res) => {
  let { MaLop, TenLop, Khoa, Email } = req.body;
  console.log(MaLop);
  console.log(TenLop);
  console.log(Khoa);
  console.log(Email);

  try {
    const passLop = MaLop;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passLop, saltRounds);

    let [rows, fields] = await pool.execute(
      "insert into lop(MaLop, TenLop, Khoa, EmailLop, PassLop) values (?, ?, ?, ?, ?)",
      [MaLop, TenLop, Khoa, Email, hashedPassword]
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
  console.log(MaLop);
  console.log(TenLop);
  console.log(Khoa);
  console.log(EmailLop);
  console.log(ttLop);

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
  console.log(IDLop);
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
    console.log("+==============");

    console.log(IDLop);
    console.log(page);
    console.log(IDNamHoc);

    const [sotrang, fields] = await pool.execute(
      "SELECT lop.*, doanvien.*, chucvu.*, namhoc.*, chitietnamhoc.*, tongiao.*, dantoc.*  FROM lop, doanvien, chucvu, namhoc, chitietnamhoc, tongiao, dantoc where doanvien.IDLop = ? and doanvien.ttDoanVien = 1 and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = chitietnamhoc.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and chitietnamhoc.IDNamHoc = ? and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao",
      [IDLop, IDNamHoc]
    );

    const [rows, fields1] = await Promise.all([
      pool.execute(
        "SELECT lop.*, doanvien.*, chucvu.*, namhoc.*, chitietnamhoc.*, tongiao.*, dantoc.* FROM lop, doanvien, chucvu, namhoc, chitietnamhoc, tongiao, dantoc where doanvien.IDLop = ? and doanvien.ttDoanVien = 1 and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = chitietnamhoc.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and chitietnamhoc.IDNamHoc = ? and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao ORDER BY doanvien.MSSV LIMIT ? OFFSET ?",
        [IDLop, IDNamHoc, pageSize, offset]
      ),

      pool.execute(
        "SELECT lop.*, doanvien.*, chucvu.*, namhoc.*, chitietnamhoc.*, tongiao.*, dantoc.* FROM lop, doanvien, chucvu, namhoc, chitietnamhoc, tongiao, dantoc where doanvien.IDLop = ? and doanvien.ttDoanVien = 1 and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = chitietnamhoc.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and chitietnamhoc.IDNamHoc = ? and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao ORDER BY doanvien.MSSV LIMIT ? OFFSET ?",
        [IDLop, IDNamHoc, pageSize, offset]
      ),
    ]);

    console.log(rows);

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
  console.log(IDLop);
  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop where lop.IDLop = ?",

      [IDLop]
    );

    console.log(rows);

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

let laymotdoanvien = async (req, res) => {
  const IDDoanVien = req.params.IDDoanVien;
  const IDLop = req.params.IDLop;
  // const IDChiTietNamHoc = req.params.IDChiTietNamHoc;

  console.log(IDDoanVien);
  console.log(IDLop);
  // console.log(IDChiTietNamHoc);

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
  let IDChiTietNamHoc = req.params.IDChiTietNamHoc;

  console.log(IDChiTietNamHoc);
  try {
    await pool.execute("DELETE FROM chitietnamhoc WHERE IDChiTietNamHoc = ?", [
      IDChiTietNamHoc,
    ]);

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

    const offset = (page - 1) * pageSize;
    console.log("+==============");

    console.log(idnamhoc);

    const [sotrang, fields1] = await pool.execute(
      "SELECT * FROM lop, anh, doanvien, chitietnamhoc, namhoc, chucvu, dantoc, tongiao where lop.IDLop = doanvien.IDLop and doanvien.ttDoanVien = 1 and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and (chucvu.IDChucVu = 1 or chucvu.IDChucVu = 2 or chucvu.IDChucVu = 4 or chucvu.IDChucVu = 5 or chucvu.IDChucVu = 6 or chucvu.IDChucVu = 7) and doanvien.IDDOanVien = anh.IDDoanVien and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and lop.khoa = ?",
      [idnamhoc, khoa]
    );

    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop, anh, doanvien, chitietnamhoc, namhoc, chucvu, dantoc, tongiao where lop.IDLop = doanvien.IDLop and doanvien.ttDoanVien = 1 and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and (chucvu.IDChucVu = 1 or chucvu.IDChucVu = 2 or chucvu.IDChucVu = 4 or chucvu.IDChucVu = 5 or chucvu.IDChucVu = 6 or chucvu.IDChucVu = 7) and doanvien.IDDOanVien = anh.IDDoanVien and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and lop.khoa = ? LIMIT ? OFFSET ?",
      [idnamhoc, khoa, pageSize, offset]
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

    console.log("0000000000000000000000");
    console.log(req.params);

    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop, anh, doanvien, chitietnamhoc, namhoc, chucvu, dantoc, tongiao where lop.IDLop = doanvien.IDLop and doanvien.ttDoanVien = 1 and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and (chucvu.IDChucVu = 1 or chucvu.IDChucVu = 2 or chucvu.IDChucVu = 4 or chucvu.IDChucVu = 5 or chucvu.IDChucVu = 6 or chucvu.IDChucVu = 7) and doanvien.IDDOanVien = anh.IDDoanVien and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and lop.IDLop = ?",
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
  let { IDNamHoc, MSSV, HoTen, IDChucVu, Khoa } = req.body;
  console.log(req.body);
  console.log(IDNamHoc);
  console.log(MSSV);
  console.log(HoTen);
  console.log(IDChucVu);
  console.log(Khoa);

  try {
    if (MSSV !== undefined && HoTen === "" && IDChucVu === "") {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu != 3  and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ?",
        ["%" + MSSV + "%", IDNamHoc, Khoa]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else if (MSSV === "" && HoTen !== undefined && IDChucVu === "") {
      const [rowsTenLop, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ?",

        ["%" + HoTen + "%", IDNamHoc, Khoa]
      );

      console.log(rowsTenLop);

      return res.status(200).json({
        dataCD: rowsTenLop,
      });
    } else if (MSSV === "" && HoTen === "" && IDChucVu !== undefined) {
      const [rowsKhoa, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDChucVu = ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ?",

        [IDChucVu, IDNamHoc, Khoa]
      );

      console.log(rowsKhoa);

      return res.status(200).json({
        dataCD: rowsKhoa,
      });
    } else if (MSSV !== undefined && HoTen !== undefined && IDChucVu === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ?",

        ["%" + MSSV + "%", "%" + HoTen + "%", IDNamHoc, Khoa]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MSSV !== undefined && HoTen === "" && IDChucVu !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu LIKE ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ?",

        ["%" + MSSV + "%", "%" + IDChucVu + "%", IDNamHoc, Khoa]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MSSV === "" && HoTen !== undefined && IDChucVu !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ?",

        ["%" + HoTen + "%", IDChucVu, IDNamHoc, Khoa]
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
        "SELECT * FROM anh, lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where anh.IDDoanVien = doanvien.IDDoanVien and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and chucvu.IDChucVu != 3 and chitietnamhoc.IDNamHoc = ? and lop.Khoa = ?",

        ["%" + MSSV + "%", "%" + HoTen + "%", IDChucVu, IDNamHoc, Khoa]
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

//Tìm đoàn viên theo mã, tên, chức vụ, giới tính
// let getSearchDoanVien = async (req, res) => {
//   let { IDLop, MSSV, HoTen, IDChucVu, GioiTinh } = req.body;
//   console.log(IDLop);

//   console.log(MSSV);
//   console.log(HoTen);
//   console.log(IDChucVu);
//   console.log(GioiTinh);

//   try {
//     if (
//       MSSV !== undefined &&
//       HoTen === "" &&
//       IDChucVu === "" &&
//       GioiTinh === ""
//     ) {
//       const [rowsMaLop, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ?",
//         [IDLop, "%" + MSSV + "%"]
//       );

//       console.log(rowsMaLop);

//       return res.status(200).json({
//         dataCD: rowsMaLop,
//       });
//     } else if (
//       MSSV === "" &&
//       HoTen !== undefined &&
//       IDChucVu === "" &&
//       GioiTinh === ""
//     ) {
//       const [rowsTenLop, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ?",

//         [IDLop, "%" + HoTen + "%"]
//       );

//       console.log(rowsTenLop);

//       return res.status(200).json({
//         dataCD: rowsTenLop,
//       });
//     } else if (
//       MSSV === "" &&
//       HoTen === "" &&
//       IDChucVu !== undefined &&
//       GioiTinh === ""
//     ) {
//       const [rowsKhoa, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chucvu.IDChucVu LIKE ?",

//         [IDLop, "%" + IDChucVu + "%"]
//       );

//       console.log(rowsKhoa);

//       return res.status(200).json({
//         dataCD: rowsKhoa,
//       });
//     } else if (
//       MSSV === "" &&
//       HoTen === "" &&
//       IDChucVu === "" &&
//       GioiTinh !== undefined
//     ) {
//       const [rowsTrangThai, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.GioiTinh = ?",

//         [IDLop, GioiTinh]
//       );

//       console.log(rowsTrangThai);

//       return res.status(200).json({
//         dataCD: rowsTrangThai,
//       });
//     } else if (
//       MSSV !== undefined &&
//       HoTen !== undefined &&
//       IDChucVu === "" &&
//       GioiTinh === ""
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ?",

//         [IDLop, "%" + MSSV + "%", "%" + HoTen + "%"]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else if (
//       MSSV !== undefined &&
//       HoTen === "" &&
//       IDChucVu !== undefined &&
//       GioiTinh === ""
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu LIKE ?",

//         [IDLop, "%" + MSSV + "%", "%" + IDChucVu + "%"]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else if (
//       MSSV !== undefined &&
//       HoTen === "" &&
//       IDChucVu === "" &&
//       GioiTinh !== undefined
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.GioiTinh = ?",

//         [IDLop, "%" + MSSV + "%", GioiTinh]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else if (
//       MSSV === "" &&
//       HoTen !== undefined &&
//       IDChucVu !== undefined &&
//       GioiTinh === ""
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ?",

//         [IDLop, "%" + HoTen + "%", IDChucVu]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else if (
//       MSSV === "" &&
//       HoTen !== undefined &&
//       IDChucVu === "" &&
//       GioiTinh !== undefined
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and doanvien.GioiTinh = ?",

//         [IDLop, "%" + HoTen + "%", GioiTinh]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else if (
//       MSSV === "" &&
//       HoTen === "" &&
//       IDChucVu !== undefined &&
//       GioiTinh !== undefined
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",

//         [IDLop, IDChucVu, GioiTinh]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else if (
//       MSSV !== undefined &&
//       HoTen !== undefined &&
//       IDChucVu !== undefined &&
//       GioiTinh === ""
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ?",

//         [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", IDChucVu]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else if (
//       MSSV !== undefined &&
//       HoTen === "" &&
//       IDChucVu !== undefined &&
//       GioiTinh !== undefined
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",

//         [IDLop, "%" + MSSV + "%", IDChucVu, GioiTinh]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else if (
//       MSSV !== undefined &&
//       HoTen !== undefined &&
//       IDChucVu === "" &&
//       GioiTinh !== undefined
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and doanvien.GioiTinh = ?",

//         [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", GioiTinh]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else if (
//       MSSV === "" &&
//       HoTen !== undefined &&
//       IDChucVu !== undefined &&
//       GioiTinh !== undefined
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",
//         [IDLop, "%" + HoTen + "%", IDChucVu, GioiTinh]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else if (
//       MSSV !== undefined &&
//       HoTen !== undefined &&
//       IDChucVu !== undefined &&
//       GioiTinh !== undefined
//     ) {
//       const [rows, fields] = await pool.execute(
//         "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",

//         [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", IDChucVu, GioiTinh]
//       );

//       console.log(rows);

//       return res.status(200).json({
//         dataCD: rows,
//       });
//     } else {
//       console.log("Không tìm thấy kết quả");
//       return res.status(200).json({
//         dataCD: [],
//       });
//     }
//   } catch (error) {
//     console.error("Lỗi truy vấn:", error);
//     return res
//       .status(500)
//       .json({ error: "Có lỗi xảy ra trong quá trình tìm kiếm." });
//   }
// };

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
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and doanvien.MSSV LIKE ?",
        [IDLop, IDNamHoc, "%" + MSSV + "%"]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else if (MSSV === "" && HoTen !== undefined && IDChucVu === "") {
      const [rowsTenLop, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and doanvien.HoTen LIKE ?",

        [IDLop, IDNamHoc, "%" + HoTen + "%"]
      );

      console.log(rowsTenLop);

      return res.status(200).json({
        dataCD: rowsTenLop,
      });
    } else if (MSSV === "" && HoTen === "" && IDChucVu !== undefined) {
      const [rowsKhoa, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and chucvu.IDChucVu LIKE ?",

        [IDLop, IDNamHoc, "%" + IDChucVu + "%"]
      );

      console.log(rowsKhoa);

      return res.status(200).json({
        dataCD: rowsKhoa,
      });
    } else if (MSSV !== undefined && HoTen !== undefined && IDChucVu === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chitietnamhoc.IDNamHoc = ?",

        [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MSSV !== undefined && HoTen === "" && IDChucVu !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu LIKE ? and chitietnamhoc.IDNamHoc = ?",

        [IDLop, "%" + MSSV + "%", "%" + IDChucVu + "%", IDNamHoc]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (MSSV === "" && HoTen !== undefined && IDChucVu !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and chitietnamhoc.IDNamHoc = ?",

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
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and chitietnamhoc.IDNamHoc = ?",

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

let getSearchManyDoanVien = async (req, res) => {
  let { IDNamHoc, trimmedInfo, IDLop } = req.body;
  console.log(trimmedInfo);

  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chitietnamhoc.IDNamHoc = ? and (doanvien.MSSV LIKE ? or doanvien.HoTen LIKE ? or chucvu.TenCV LIKE ?)",
        [
          IDLop,
          IDNamHoc,
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
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

    const offset = (page - 1) * pageSize;

    const [sotrang, fields] = await pool.execute(
      "SELECT * FROM hoatdong where (ttHD = 0 or ttHD = 1 or ttHD = 2) and idnamhoc = ?",
      [IDNamHoc]
    );

    const [result1, result2] = await Promise.all([
      pool.execute(
        "UPDATE hoatdong SET ttHD = CASE WHEN ttHD = 3 THEN 3 WHEN NgayBanHanh > CURRENT_DATE THEN 0 WHEN NgayBanHanh <= CURRENT_DATE AND NgayHetHan > CURRENT_DATE THEN 1 WHEN NgayHetHan < CURRENT_DATE THEN 2 END"
      ),
      pool.execute(
        "SELECT * FROM hoatdong where (ttHD = 0 or ttHD = 1 or ttHD = 2) and idnamhoc = ? LIMIT ? OFFSET ?",
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
  let { TenHoatDong, Thang, ttHD } = req.body;
  console.log(TenHoatDong);
  console.log(Thang);
  console.log(ttHD);

  try {
    if (TenHoatDong !== undefined && Thang === "" && ttHD === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdong where hoatdong.TenHoatDong LIKE ? and ttHD != 3",
        ["%" + TenHoatDong + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (TenHoatDong == "" && Thang !== undefined && ttHD === "") {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdong where MONTH(hoatdong.NgayBanHanh) = ?",
        [Thang]
      );

      console.log(rows);

      return res.status(200).json({
        dataHD: rows,
      });
    } else if (TenHoatDong == "" && Thang === "" && ttHD !== undefined) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM hoatdong where hoatdong.ttHD = ?",
        [ttHD]
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
        "SELECT * FROM hoatdong where hoatdong.TenHoatDong LIKE ? and MONTH(hoatdong.NgayBanHanh) = ?",
        ["%" + TenHoatDong + "%", Thang]
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
        "SELECT * FROM hoatdong where hoatdong.TenHoatDong LIKE ? and hoatdong.ttHD = ?",
        ["%" + TenHoatDong + "%", ttHD]
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
        "SELECT * FROM hoatdong where MONTH(hoatdong.NgayBanHanh) = ? and hoatdong.ttHD = ?",
        [Thang, ttHD]
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
        "SELECT * FROM hoatdong where hoatdong.TenHoatDong LIKE ? and MONTH(hoatdong.NgayBanHanh) = ? and hoatdong.ttHD = ?",
        ["%" + TenHoatDong + "%", Thang, ttHD]
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

// Thêm hoạt động
let TaoHoatDong = async (req, res) => {
  let { TenHoatDong, NgayBatDau, NgayHetHan, ChiTietHoatDong, IDNamHoc } =
    req.body;
  console.log(req.body);
  console.log(TenHoatDong);
  console.log(NgayBatDau);
  console.log(NgayHetHan);
  console.log(ChiTietHoatDong);
  console.log(IDNamHoc);

  try {
    let [rows, fields] = await pool.execute(
      "insert into hoatdong(TenHoatDong, NgayTao, NgayBanHanh, NgayHetHan, ChiTietHD, IDNamHoc) values (?, NOW(), ?, ?, ?, ?)",
      [TenHoatDong, NgayBatDau, NgayHetHan, ChiTietHoatDong, IDNamHoc]
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
      "SELECT * FROM lop where ttLop = 1"
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
      "SELECT diemdanhhoatdong.IDDiemDanh, lop.TenLop, lop.Khoa, hoatdong.TenHoatDong, diemdanhhoatdong.DiemDanh, namhoc.tennamhoc " +
        "FROM hoatdong " +
        "JOIN diemdanhhoatdong ON hoatdong.IDHoatDong = diemdanhhoatdong.IDHoatDong " +
        "JOIN lop ON diemdanhhoatdong.IDLop = lop.IDLop " +
        "JOIN namhoc ON hoatdong.IDNamHoc = namhoc.IDNamHoc " +
        "LEFT JOIN doanvien ON lop.IDLop = doanvien.IDLop " +
        "LEFT JOIN chitietnamhoc ON doanvien.IDDoanVien = chitietnamhoc.IDDoanVien AND namhoc.IDNamHoc = chitietnamhoc.IDNamHoc " +
        "WHERE hoatdong.IDHoatDong = ? and chitietnamhoc.IDNamHoc = ? " +
        "GROUP BY diemdanhhoatdong.IDDiemDanh, hoatdong.IDHoatDong, lop.IDLop ",
      [IDHoatDong, IDNamHoc]
    );

    return res.status(200).json({
      TenHoatDong: rows[0].TenHoatDong,
      TenNamHoc: rows[0].tennamhoc,
      ChiTietHD: rows.map((row) => ({
        IDDiemDanh: row.IDDiemDanh,
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

// let loginAdmin = async (req, res) => {
//   let { email, passAdmin } = req.body;
//   const [rows, fields] = await pool.execute(
//     "select * from admin where idAdmin=0"
//   );
//   const emailValue = rows[0].email;
//   const passAdminValue = rows[0].passAdmin;

//   if (emailValue == email && passAdmin == passAdminValue) {
//     return res.status(200).json({
//       dataAdmin: rows[0],
//     });
//   } else {
//     return res.status(500).json({ error: "\n Đăng nhập không thành công!" });
//   }
// };

let namhoc = async (req, res) => {
  try {
    const [result, fields1] = await Promise.all([
      pool.execute("SELECT * FROM namhoc"),
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

let layDSDoanPhi = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5
    const idnamhoc = req.params.idnamhoc; // Lấy trang từ query parameters, mặc định là trang 1

    const offset = (page - 1) * pageSize;

    const [sotrang, fields] = await pool.execute(
      "SELECT * FROM doanphi, namhoc where namhoc.idnamhoc = doanphi.idnamhoc and doanphi.ttDoanPhi = 1 and namhoc.IDNamHoc = ?",
      [idnamhoc]
    );

    const [result2, fields1] = await Promise.all([
      pool.execute(
        "SELECT * FROM doanphi, namhoc where namhoc.idnamhoc = doanphi.idnamhoc and doanphi.ttDoanPhi = 1 and namhoc.IDNamHoc = ? LIMIT ? OFFSET ?",
        [idnamhoc, pageSize, offset]
      ),
    ]);

    if (result2[0] && result2[0].length > 0) {
      return res.status(200).json({
        dataDP: result2[0],
        totalPages: Math.ceil(sotrang.length / pageSize),
        currentPage: page,
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

    const [result2, fields1] = await Promise.all([
      pool.execute(
        "SELECT * FROM doanphi, namhoc, chitietdoanphi where namhoc.idnamhoc = doanphi.idnamhoc and doanphi.ttDoanPhi = 1 and doanphi.IDDoanPhi = chitietdoanphi.IDDoanPhi and namhoc.IDNamHoc = ? and lop.IDLop = ?",
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
        "GROUP BY chitietdoanphi.IDChiTietDoanPhi, doanphi.IDDoanPhi, lop.IDLop ",
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
      "insert into doanphi(TenDoanPhi, SoTien, IDNamHoc) values (?, ?, ?)",
      [TenDoanPhi, SoTien, IDNamHoc]
    );

    const [newDoanPhi] = await pool.execute(
      "SELECT * FROM doanphi WHERE IDDoanPhi = ?",
      [rows.insertId]
    );

    let [tatcalop, fields2] = await pool.execute(
      "SELECT * FROM lop where ttLop = 1"
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

let layDSChucVuDoanVien = async (req, res) => {
  const IDDoanVien = req.params.IDDoanVien;
  console.log(IDDoanVien);
  try {
    const [rows, fields1] = await pool.execute(
      "SELECT TenNamHoc, TenCV FROM chitietnamhoc, namhoc, chucvu where chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDDoanVien = ?",
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

// let dvlaymotdoanvien = async (req, res) => {
//   const IDDoanVien = req.params.IDDoanVien;
//   const IDNamHoc = req.params.IDNamHoc;

//   console.log(IDDoanVien);
//   console.log(IDNamHoc);

//   try {
//     const [rows, fields] = await pool.execute(
//       "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc, anh where doanvien.IDDoanVien = ? and chitietnamhoc.IDNamHoc = ? and lop.IDLop = doanvien.IDLop and doanvien.ttDoanVien = 1 and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and namhoc.IDNamHoc = chitietnamhoc.IDNamHoc and chitietnamhoc.IDChucVu = chucvu.IDChucVu and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.IDDoanVien = anh.IDDoanVien",

//       [IDDoanVien, IDNamHoc]
//     );

//     console.log(rows);

//     if (rows.length > 0) {
//       // Định dạng lại ngày trong rows[0].NgayHetHan
//       const formattedDate = format(new Date(rows[0].NgaySinh), "dd/MM/yyyy");
//       const formattedDate1 = format(
//         new Date(rows[0].NgayVaoDoan),
//         "dd/MM/yyyy"
//       );

//       // Gán lại giá trị đã định dạng vào rows[0].NgayHetHan
//       rows[0].NgaySinh = formattedDate;
//       rows[0].NgayVaoDoan = formattedDate1;
//     }

//     return res.status(200).json({
//       dataDV: rows[0],
//     });
//   } catch (error) {
//     return res.status(500).json({ error: "Không hiển thị được!" });
//   }
// };

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
        "SELECT * FROM lop, doanvien, ungtuyen, namhoc where lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = ungtuyen.IDDoanVien and namhoc.IDNamHoc = ungtuyen.IDNamHoc and namhoc.IDNamHoc = ?",
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
  let { IDNamHoc, trimmedInfo } = req.body;
  console.log(req.body);

  try {
    if (trimmedInfo !== undefined) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, ungtuyen where lop.IDLop = doanvien.IDLop and ungtuyen.IDNamHoc = ? and (doanvien.MSSV LIKE ? or doanvien.HoTen LIKE ? or TenLop LIKE ? or MaLop LIKE ?)",
        [
          IDNamHoc,
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
          "%" + trimmedInfo + "%",
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
    ((rl1 < 50 || rl2 < 50) && (rl1 + rl2) / 2 < 50)
  ) {
    PhanLoai = 4;
  }

  console.log(PhanLoai);
  try {
    let [rows, fields] = await pool.execute(
      "insert into danhgiadoanvien(hk1, hk2, rl1, rl2, IDNamHoc, IDDoanVien, PhanLoai) values (?, ?, ?, ?, ?, ?, ?)",
      [hk1, hk2, rl1, rl2, idnamhoc, IDDoanVien, PhanLoai]
    );

    const [newHoatDong] = await pool.execute(
      "SELECT PhanLoai FROM danhgiadoanvien WHERE IDDanhGia = ?",
      [rows.insertId]
    );

    console.log(newHoatDong);

    return res.status(200).json({
      dataDG: newHoatDong,
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

let layDSDoanPhiCuaDoanVien = async (req, res) => {
  try {
    const IDNamHoc = req.params.IDNamHoc;
    const IDDoanVien = req.params.IDDoanVien;

    console.log(req.params);

    const [result2, fieldsResult2] = await Promise.all([
      pool.execute(
        "SELECT * FROM thudoanphi, doanphi where thudoanphi.IDDoanPhi = doanphi.IDDoanPhi and doanphi.ttDoanPhi = 1  and doanphi.IDNamHoc = ? and thudoanphi.IDDoanVien = ? ORDER BY doanphi.IDDoanPhi DESC",
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
          console.log(updateResult)
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


module.exports = {
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

  getBCH,
  getBCHMotLop,
  getSearchBCH,
  getChucVu,
  deleteBanChapHanh,

  getSearchDoanVien,
  getSearchManyDoanVien,
  laymotdoanvien,
  deleteDoanVien,

  layDSHoatDong,
  searchHoatDong,
  TaoHoatDong,
  layMotHoatDong,
  capNhatHoatDong,
  deleteHoatDong,
  LayDSDiemDanh,
  SaveCheckboxStatesDiemDanh,

  namhoc,
  searchNamHoc,
  namhoccuamotchidoan,

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
  // dvlaymotdoanvien,
  layDSChucVuDoanVien,
  layDSHoatDongCuaDoanVien,
  DanhSachUngTuyen,
  DanhSachUngTuyenCuaDV,
  MauUngTuyen,
  CapNhatUngTuyenCuaDV,
  getSearchSVNT,

  DiemCuaMotDoanVien,
  KetQuaCuaMotDoanVien,
  layDSDoanPhiCuaDoanVien,
  DoiMatKhauDoanVien,
};
