const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file.controller");

router.get("/", (req, res) => {
  res.send("file route working");
});

router.post("/upload", fileController.uploadFile);

router.get("/view/:fileName", fileController.viewFile);

router.get("/download/:fileName", fileController.downloadFile);

router.delete("/:fileName", fileController.deleteFile);

router.get("/list", fileController.listFiles);

module.exports = router;
