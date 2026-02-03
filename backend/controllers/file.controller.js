const minioClient = require("../config/minio");

const BUCKET = "my-files";

/* ======================
   UPLOAD → PRESIGNED PUT
   ====================== */
exports.uploadFile = async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: "fileName required" });
    }

    const exists = await minioClient.bucketExists(BUCKET);
    if (!exists) {
      await minioClient.makeBucket(BUCKET, "us-east-1");
    }

    const objectName = `${Date.now()}-${fileName}`;

    const uploadUrl = await minioClient.presignedPutObject(
      BUCKET,
      objectName,
      60 * 5 // 5 min
    );

    res.json({
      uploadUrl,
      fileName: objectName, // return the objectName to store in DB
    });
  } catch (error) {
    res.status(500).json({
      message: "Upload presign failed",
      error: error.message,
    });
  }
};

/* ======================
   VIEW → PRESIGNED GET
   ====================== */
exports.viewFile = async (req, res) => {
  try {
    const { fileName } = req.params;

    const viewUrl = await minioClient.presignedGetObject(
      BUCKET,
      fileName,
      60 * 5 // 5 min
    );

    res.json({ viewUrl });
  } catch (error) {
    res.status(500).json({
      message: "View failed",
      error: error.message,
    });
  }
};

/* ======================
   DOWNLOAD (OPTIONAL)
   ====================== */
exports.downloadFile = async (req, res) => {
  try {
    const fileName = req.params.fileName;

    const stream = await minioClient.getObject(BUCKET, fileName);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    stream.pipe(res);
  } catch (error) {
    res.status(500).json({
      message: "Download failed",
      error: error.message,
    });
  }
};

/* ======================
   DELETE FILE
   ====================== */
exports.deleteFile = async (req, res) => {
  try {
    const fileName = req.params.fileName;

    await minioClient.removeObject(BUCKET, fileName);

    res.json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

/* ======================
   LIST FILES
   ====================== */
exports.listFiles = async (req, res) => {
  try {
    const files = [];
    const stream = minioClient.listObjectsV2(BUCKET, "", true);

    stream.on("data", (obj) => files.push(obj.name));
    stream.on("end", () => res.json(files));
    stream.on("error", (err) => {
      throw err;
    });
  } catch (error) {
    res.status(500).json({
      message: "List failed",
      error: error.message,
    });
  }
};
