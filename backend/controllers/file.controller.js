const minioClient = require("../config/minio");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const bucketName = "my-files";

    // check bucket
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
    }

    const fileName = Date.now() + "-" + req.file.originalname;

    await minioClient.putObject(
      bucketName,
      fileName,
      req.file.buffer,
      req.file.size,
      {
        "Content-Type": req.file.mimetype,
      }
    );

    res.json({
      message: "File uploaded successfully",
      fileName,
    });
  } catch (error) {
    console.error("MINIO UPLOAD ERROR 👉", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const bucketName = "my-files";
    const fileName = req.params.fileName;

    const stream = await minioClient.getObject(bucketName, fileName);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    stream.pipe(res);
  } catch (error) {
    console.error("DOWNLOAD ERRO", error);
    res.status(500).json({
      message: "Download failed",
      error: error.message,
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const bucketName = "my-files";
    const fileName = req.params.fileName;

    await minioClient.removeObject(bucketName, fileName);

    res.json({
      message: "File deleted successfully",
      fileName,
    });
  } catch (error) {
    console.error("DELETE ERROR", error);
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

exports.listFiles = async (req, res) => {
  try {
    const bucketName = "my-files";
    const files = [];

    const stream = minioClient.listObjectsV2(bucketName, "", true);

    stream.on("data", (obj) => {
      files.push(obj.name);
    });

    stream.on("end", () => {
      res.json(files);
    });

    stream.on("error", (err) => {
      throw err;
    });
  } catch (error) {
    console.error("LIST ERROR ", error);
    res.status(500).json({ message: "List failed" });
  }
};


