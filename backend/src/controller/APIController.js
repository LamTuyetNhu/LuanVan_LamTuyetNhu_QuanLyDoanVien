import pool from "../configs/connectDB";
const XLSX = require("xlsx");

//Lấy danh sách chi đoàn
let getAllChiDoan = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5

    const offset = (page - 1) * pageSize;

    const [sotrang, fields1] = await pool.execute("SELECT * FROM lop");

    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop  LIMIT ? OFFSET ?",
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

let ThemChiDoan = async (req, res) => {
  let { MaLop, TenLop, Khoa, Email } = req.body;
  console.log(MaLop);
  console.log(TenLop);
  console.log(Khoa);
  console.log(Email);

  try {
    let [rows, fields] = await pool.execute(
      "insert into lop(MaLop, TenLop, Khoa, Email) values (?, ?, ?, ?)",
      [MaLop, TenLop, Khoa, Email]
    );

    return res.status(200).json({
      dataCD: rows,
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
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

//Upload file excel
let insertDataFromExcel = async (fileBuffer) => {
  const MaLop = "DI20Z6A1";
  try {
    const workbook = XLSX.readFile(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Lấy danh sách các ô (cột) trong header
    const header = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

    // Lấy dữ liệu từ file Excel và chèn vào cơ sở dữ liệu
    const data = XLSX.utils.sheet_to_json(sheet, { header: header });
    for (const row of data) {
      const {
        MSSV,
        HoTen,
        Email,
        SoDT,
        GioiTinh,
        QueQuan,
        DanToc,
        TonGiao,
        NgaySinh,
        NgayVaoDoan,
      } = row;

      if (GioiTinh === "Nam") {
        GioiTinh = 1;
      } else if (GioiTinh === "Nữ") {
        GioiTinh = 0;
      } else {
        GioiTinh = 2;
      }

      DanToc = 1;
      TonGiao = 1;

      // Thực hiện truy vấn SQL để chèn dữ liệu vào cơ sở dữ liệu
      const sql = `INSERT INTO TenBang (MaLop, MSSV, HoTen, Email, SoDT, GioiTinh, QueQuan, DanToc, TonGiao, NgaySinh, NgayVaoDoan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await pool.execute(sql, [
        MaLop,
        MSSV,
        HoTen,
        Email,
        SoDT,
        GioiTinh,
        QueQuan,
        DanToc,
        TonGiao,
        NgaySinh,
        NgayVaoDoan,
      ]);
    }

    console.log("Dữ liệu đã được chèn thành công từ file Excel");
  } catch (error) {
    console.error("Lỗi khi chèn dữ liệu từ file Excel: ", error);
  }
};

//Lấy danh sách của một chi đoàn
let getDetailChiDoan = async (req, res) => {
  try {
    const IDLop = req.params.IDLop;

    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5

    const offset = (page - 1) * pageSize;

    console.log(IDLop);
    console.log(page);

    const [sotrang, fields] = await pool.execute(
      "SELECT * FROM lop, doanvien, chucvu, namhoc, chitietnamhoc, tongiao, dantoc where lop.IDLop = ? and doanvien.ttDoanVien = 1 and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = chitietnamhoc.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao",
      [IDLop]
    );

    const [rows, fields1] = await Promise.all([
      pool.execute(
        "SELECT * FROM lop, doanvien, chucvu, namhoc, chitietnamhoc, tongiao, dantoc where lop.IDLop = ? and doanvien.ttDoanVien = 1 and lop.IDLop = doanvien.IDLop and doanvien.IDDoanVien = chitietnamhoc.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao  LIMIT ? OFFSET ?",
        [IDLop, pageSize, offset]
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

let laymotdoanvien = async (req, res) => {
  const IDDoanVien = req.params.IDDoanVien;
  const IDLop = req.params.IDLop;
  console.log(IDDoanVien);
  console.log(IDLop);
  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc, lop where lop.MaLop = ? and lop.IDLop = doanvien.IDLop and doanvien.MSSV = ? and doanvien.ttDoanVien = 1 and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and namhoc.IDNamHoc = chitietnamhoc.IDNamHoc and chitietnamhoc.IDChucVu = chucvu.IDChucVu and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao",

      [IDLop, IDDoanVien]
    );

    console.log(rows);

    return res.status(200).json({
      dataDV: rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let deleteDoanVien = async (req, res) => {
  let IDDoanVien = req.params.IDDoanVien;
  console.log(IDDoanVien);
  try {
    await pool.execute(
      "update doanvien set doanvien.ttDoanVien = 0 where doanvien.MSSV = ?",
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

//Lấy tất cả danh sách BCH
let getBCH = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 4; // Lấy số lượng mục trên mỗi trang, mặc định là 5

    const offset = (page - 1) * pageSize;

    const [sotrang, fields1] = await pool.execute(
      "SELECT * FROM lop, doanvien, chitietnamhoc, namhoc, chucvu where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and doanvien.ttDoanVien = 1 and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and (chucvu.IDChucVu = 1 or chucvu.IDChucVu = 2 or chucvu.IDChucVu = 4 or chucvu.IDChucVu = 5 or chucvu.IDChucVu = 6)"
    );

    const [rows, fields] = await pool.execute(
      "SELECT * FROM lop, doanvien, chitietnamhoc, namhoc, chucvu where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and doanvien.ttDoanVien = 1 and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and (chucvu.IDChucVu = 1 or chucvu.IDChucVu = 2 or chucvu.IDChucVu = 4 or chucvu.IDChucVu = 5 or chucvu.IDChucVu = 6) LIMIT ? OFFSET ?",
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
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn cơ sở dữ liệu: ", error);
  }
};

let getSearchBCH = async (req, res) => {
  let { MSSV, HoTen, IDChucVu, GioiTinh } = req.body;


  console.log(MSSV);
  console.log(HoTen);
  console.log(IDChucVu);
  console.log(GioiTinh);

  try {
    if (
      MSSV !== undefined &&
      HoTen === "" &&
      IDChucVu === "" &&
      GioiTinh === ""
    ) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? ",
        ["%" + MSSV + "%"]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop
      });
    } else if (
      MSSV === "" &&
      HoTen !== undefined &&
      IDChucVu === "" &&
      GioiTinh === ""
    ) {
      const [rowsTenLop, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ?",

        ["%" + HoTen + "%"]
      );

      console.log(rowsTenLop);

      return res.status(200).json({
        dataCD: rowsTenLop,
      });
    } else if (
      MSSV === "" &&
      HoTen === "" &&
      IDChucVu !== undefined &&
      GioiTinh === ""
    ) {
      const [rowsKhoa, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chucvu.IDChucVu LIKE ?",

        ["%" + IDChucVu + "%"]
      );

      console.log(rowsKhoa);

      return res.status(200).json({
        dataCD: rowsKhoa,
      });
    } else if (
      MSSV === "" &&
      HoTen === "" &&
      IDChucVu === "" &&
      GioiTinh !== undefined
    ) {
      const [rowsTrangThai, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.GioiTinh = ?",

        [GioiTinh]
      );

      console.log(rowsTrangThai);

      return res.status(200).json({
        dataCD: rowsTrangThai,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      IDChucVu === "" &&
      GioiTinh === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ?",

        ["%" + MSSV + "%", "%" + HoTen + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen === "" &&
      IDChucVu !== undefined &&
      GioiTinh === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu LIKE ?",

        ["%" + MSSV + "%", "%" + IDChucVu + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen === "" &&
      IDChucVu === "" &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.GioiTinh = ?",

        ["%" + MSSV + "%", GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV === "" &&
      HoTen !== undefined &&
      IDChucVu !== undefined &&
      GioiTinh === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ?",

        ["%" + HoTen + "%", IDChucVu]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV === "" &&
      HoTen !== undefined &&
      IDChucVu === "" &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and doanvien.GioiTinh = ?",

        ["%" + HoTen + "%", GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV === "" &&
      HoTen === "" &&
      IDChucVu !== undefined &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",

        [IDChucVu, GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      IDChucVu !== undefined &&
      GioiTinh === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ?",

        ["%" + MSSV + "%", "%" + HoTen + "%", IDChucVu]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen === "" &&
      IDChucVu !== undefined &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",

        ["%" + MSSV + "%", IDChucVu, GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      IDChucVu === "" &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and doanvien.GioiTinh = ?",

        ["%" + MSSV + "%", "%" + HoTen + "%", GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV === "" &&
      HoTen !== undefined &&
      IDChucVu !== undefined &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",
        ["%" + HoTen + "%", IDChucVu, GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      IDChucVu !== undefined &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",

        ["%" + MSSV + "%", "%" + HoTen + "%", IDChucVu, GioiTinh]
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

//Lất tất cả chức vụ
let getChucVu = async (req, res) => {
  try {
    const [rows, fields] = await pool.execute("SELECT * FROM chucvu");
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
let getSearchDoanVien = async (req, res) => {
  let { IDLop, MSSV, HoTen, IDChucVu, GioiTinh } = req.body;
  console.log(IDLop);

  console.log(MSSV);
  console.log(HoTen);
  console.log(IDChucVu);
  console.log(GioiTinh);

  try {
    if (
      MSSV !== undefined &&
      HoTen === "" &&
      IDChucVu === "" &&
      GioiTinh === ""
    ) {
      const [rowsMaLop, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ?",
        [IDLop, "%" + MSSV + "%"]
      );

      console.log(rowsMaLop);

      return res.status(200).json({
        dataCD: rowsMaLop,
      });
    } else if (
      MSSV === "" &&
      HoTen !== undefined &&
      IDChucVu === "" &&
      GioiTinh === ""
    ) {
      const [rowsTenLop, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ?",

        [IDLop, "%" + HoTen + "%"]
      );

      console.log(rowsTenLop);

      return res.status(200).json({
        dataCD: rowsTenLop,
      });
    } else if (
      MSSV === "" &&
      HoTen === "" &&
      IDChucVu !== undefined &&
      GioiTinh === ""
    ) {
      const [rowsKhoa, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chucvu.IDChucVu LIKE ?",

        [IDLop, "%" + IDChucVu + "%"]
      );

      console.log(rowsKhoa);

      return res.status(200).json({
        dataCD: rowsKhoa,
      });
    } else if (
      MSSV === "" &&
      HoTen === "" &&
      IDChucVu === "" &&
      GioiTinh !== undefined
    ) {
      const [rowsTrangThai, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.GioiTinh = ?",

        [IDLop, GioiTinh]
      );

      console.log(rowsTrangThai);

      return res.status(200).json({
        dataCD: rowsTrangThai,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      IDChucVu === "" &&
      GioiTinh === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ?",

        [IDLop, "%" + MSSV + "%", "%" + HoTen + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen === "" &&
      IDChucVu !== undefined &&
      GioiTinh === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu LIKE ?",

        [IDLop, "%" + MSSV + "%", "%" + IDChucVu + "%"]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen === "" &&
      IDChucVu === "" &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.GioiTinh = ?",

        [IDLop, "%" + MSSV + "%", GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV === "" &&
      HoTen !== undefined &&
      IDChucVu !== undefined &&
      GioiTinh === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ?",

        [IDLop, "%" + HoTen + "%", IDChucVu]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV === "" &&
      HoTen !== undefined &&
      IDChucVu === "" &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and doanvien.GioiTinh = ?",

        [IDLop, "%" + HoTen + "%", GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV === "" &&
      HoTen === "" &&
      IDChucVu !== undefined &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",

        [IDLop, IDChucVu, GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      IDChucVu !== undefined &&
      GioiTinh === ""
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ?",

        [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", IDChucVu]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen === "" &&
      IDChucVu !== undefined &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",

        [IDLop, "%" + MSSV + "%", IDChucVu, GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      IDChucVu === "" &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and doanvien.GioiTinh = ?",

        [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV === "" &&
      HoTen !== undefined &&
      IDChucVu !== undefined &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",
        [IDLop, "%" + HoTen + "%", IDChucVu, GioiTinh]
      );

      console.log(rows);

      return res.status(200).json({
        dataCD: rows,
      });
    } else if (
      MSSV !== undefined &&
      HoTen !== undefined &&
      IDChucVu !== undefined &&
      GioiTinh !== undefined
    ) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM lop, doanvien, chitietnamhoc, chucvu, namhoc, tongiao, dantoc where doanvien.IDLop = ? and lop.IDLop = doanvien.IDLop and chitietnamhoc.IDDoanVien = doanvien.IDDoanVien and chitietnamhoc.IDChucVu = chucvu.IDChucVu and chitietnamhoc.IDNamHoc = namhoc.IDNamHoc and doanvien.IDDanToc = dantoc.IDDanToc and doanvien.IDTonGiao = tongiao.IDTonGiao and doanvien.MSSV LIKE ? and doanvien.HoTen LIKE ? and chucvu.IDChucVu = ? and doanvien.GioiTinh = ?",

        [IDLop, "%" + MSSV + "%", "%" + HoTen + "%", IDChucVu, GioiTinh]
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

//Lấy danh sách hoạt động
let layDSHoatDong = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; // Lấy trang từ query parameters, mặc định là trang 1
    const pageSize = parseInt(req.query.pageSize) || 5; // Lấy số lượng mục trên mỗi trang, mặc định là 5

    const offset = (page - 1) * pageSize;

    const [sotrang, fields] = await pool.execute("SELECT * FROM hoatdong");

    const [result1, result2] = await Promise.all([
      pool.execute(
        "UPDATE hoatdong SET ttHD = CASE WHEN ttHD = 3 THEN 3 WHEN NgayBanHanh > CURRENT_DATE THEN 0 WHEN NgayBanHanh <= CURRENT_DATE AND NgayHetHan > CURRENT_DATE THEN 1 WHEN NgayHetHan < CURRENT_DATE THEN 2 END"
      ),
      pool.execute("SELECT * FROM hoatdong LIMIT ? OFFSET ?", [
        pageSize,
        offset,
      ]),
    ]);

    // console.log(Math.ceil(result2[0].length / pageSize))
    // console.log(Math.ceil(page))

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
    // const IDHoatDong = req.params.IDHoatDong;
    const { IDHoatDong, TenHoatDong, NgayBatDau, NgayHetHan, ChiTietHoatDong } =
      req.body;

    // Kiểm tra xem có thông tin cần thiết để cập nhật hay không
    if (!TenHoatDong || !NgayBatDau || !NgayHetHan || !ChiTietHoatDong) {
      return res.status(400).json({
        error: "Vui lòng cung cấp đầy đủ thông tin để cập nhật hoạt động.",
      });
    }

    // Thực hiện truy vấn cập nhật
    const updateQuery =
      "UPDATE hoatdong SET TenHoatDong=?, NgayBanHanh=?, NgayHetHan=?, ChiTietHD = ? WHERE IDHoatDong=?";
    const [result] = await pool.execute(updateQuery, [
      TenHoatDong,
      NgayBatDau,
      NgayHetHan,
      ChiTietHoatDong,
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
        "SELECT * FROM hoatdong where hoatdong.TenHoatDong LIKE ?",
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
  let { TenHoatDong, NgayBatDau, NgayHetHan, ChiTietHoatDong } = req.body;

  console.log(TenHoatDong);
  console.log(NgayBatDau);
  console.log(NgayHetHan);
  console.log(ChiTietHoatDong);

  try {
    let [rows, fields] = await pool.execute(
      "insert into hoatdong(TenHoatDong, NgayTao, NgayBanHanh, NgayHetHan, ChiTietHD) values (?, NOW(), ?, ?, ?)",
      [TenHoatDong, NgayBatDau, NgayHetHan, ChiTietHoatDong]
    );

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

// let getHomeAdmin = async (req, res) => {
//   const [rowsAdmin, fieldsAdmin] = await pool.execute(
//     "select nameAdmin from admin where idAdmin=0"
//   );
//   const nameAdmin = rowsAdmin[0].nameAdmin;

//   return res.status(200).json({
//     nameAdmin,
//   });
// };

// let updateCustomer = async (req, res) => {
//   let { username, address, email, phonenumber, idKH } = req.body;

//   try {
//     await pool.execute(
//       "update customer set username= ?, address= ?, email= ?, phonenumber= ? where idKH= ?",
//       [username, address, email, phonenumber, idKH]
//     );

//     return res.status(200).json({
//       message: "Cập nhật thành công!",
//     });
//   } catch (error) {
//     console.log("Không cập nhật được!", error);
//     return res.status(500).json({ error: "Không hiển thị được!" });
//   }
// };

// let deleteCustomer = async (req, res) => {
//   let idKH = req.body.idKH;
//   await pool.execute("update customer set trangthai= 0 where idKH = ?", [idKH]);
//   // const [rows, fields] = await pool.execute("SELECT *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth FROM customer where trangthai = 1");

//   return res.status(200).json({
//     message: "Xóa thành công!",
//   });
// };

// let updateCoinsCustomer = async (req, res) => {
//   let { point, idKH, addcoin } = req.body;
//   try {
//     await pool.execute("update customer set point= ? where idKH= ?", [
//       addcoin / 100 + point * 1,
//       idKH,
//     ]);

//     return res.status(200).json({
//       message: "Thành công",
//     });
//   } catch (error) {
//     console.log("Không cập nhật được!", error);
//     return res.status(500).json({ error: "Không cập nhật được!" });
//   }
// };

module.exports = {
  getAllChiDoan,
  getKhoa,
  getSearchChiDoan,
  getDetailChiDoan,
  ThemChiDoan,

  getBCH,
  getSearchBCH,
  getChucVu,
  getSearchDoanVien,
  laymotdoanvien,
  deleteDoanVien,

  layDSHoatDong,
  searchHoatDong,
  TaoHoatDong,
  insertDataFromExcel,
  layMotHoatDong,
  capNhatHoatDong,
  deleteHoatDong,
};
