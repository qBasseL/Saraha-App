export const fileFieldValidation = {
    Image : ["image/jpeg", "image/png", "image/jpg"],
    PDF : ["application/pdf"],
    Excel : [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
    ],
    Video : [
        "video/mp4",
        "video/avi",
        "video/mov"
    ]
}

export const fileFilter = (validation = []) => {
  return function (req, file, cb) {
    if (!validation.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type", { cause: { status: 400 } }),
        false,
      );
    }
    cb(null, true);
  };
};
