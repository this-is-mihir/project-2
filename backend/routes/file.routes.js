const express = require("express");
const multer = require("multer");
const router = express.Router();
const fileController = require("../controllers/file.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (req, res) => {
  res.send("file route working");
});

router.get("/", (req, res) => {
  res.send("file route working");
});

router.get("/list", fileController.listFiles);


router.post(
  "/upload",
  upload.single("file"),
  fileController.uploadFile
);

router.get(
  "/download/:fileName",
  fileController.downloadFile
);

router.delete(
  "/:fileName",
  fileController.deleteFile
);


router.post("/upload", upload.single("file"), fileController.uploadFile);

module.exports = router;
