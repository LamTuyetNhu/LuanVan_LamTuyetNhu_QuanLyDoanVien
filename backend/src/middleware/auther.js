let authDoanTruong = (req, res, next) => {
  if(req.role != "") {
    return res.status(403).json({
      message: "Bạn phải là BCH đoàn trường!"
    })
  }
  next()
}

let authChiDoan = (req, res, next) => {
  if(req.role != "") {
    return res.status(403).json({
      message: "Bạn phải là BCH đoàn trường!"
    })
  }
  next()
}

let authDoanVien = (req, res, next) => {
  if(req.role != "") {
    return res.status(403).json({
      message: "Bạn phải là BCH đoàn trường!"
    })
  }
  next()
}

module.exports = {
  authDoanTruong, authChiDoan, authDoanVien
}