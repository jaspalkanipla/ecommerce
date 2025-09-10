import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";
import dotenv from "dotenv";
dotenv.config();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // acl: "public-read", // file publicly accessible hogi
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now().toString()}-${file.originalname}`);
      // cb(null, `images/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;



  
// import multer from 'multer'
// import path from 'path'

// const storage = multer.diskStorage(
//     {
//         destination: (req, file, cb) => {
//             cb(null, "public/uploads/")
//         },
//         filename(req, file, cb) {
//             const uniqueName = Date.now() + path.extname(file.originalname)
//             cb(null, uniqueName)

//         }
//     }
// )

// // File filter (only images allowed)
// function fileFilter(req, file, cb) {
//     const allowed = /jpeg|jpg|png/;
//     const ext = allowed.test(path.extname(file.originalname).toLowerCase());
//     const mime = allowed.test(file.mimetype);

//     if (ext && mime) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only .jpeg, .jpg, .png allowed"));
//     }
// }

// const upload = multer({ storage, fileFilter });

// export default upload;