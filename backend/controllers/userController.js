const User = require("../model/user");
const minioClient = require("../config/minio");

const BUCKET = "my-files";

/* ================= CREATE USER ================= */
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL USERS ================= */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE USER ================= */
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.json(user);
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};

/* ================= UPDATE USER (🔥 IMPORTANT) ================= */
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const incomingData = req.body;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ===== EXTRACT FILENAMES ===== */
    const extractFileName = (value) => {
      if (!value) return "";
      return value.split("/").pop();
    };

    const oldPic = extractFileName(existingUser.profilePic);
    const newPic = extractFileName(incomingData.profilePic);

    /* ===== DELETE OLD IMAGE IF REPLACED ===== */
    if (oldPic && newPic && oldPic !== newPic) {
      try {
        await minioClient.removeObject("my-files", oldPic);
        console.log("OLD IMAGE DELETED 👉", oldPic);
      } catch (err) {
        console.log("MINIO DELETE FAILED 👉", err.message);
      }
    }

    /* ===== SAVE ONLY FILENAME IN DB ===== */
    incomingData.profilePic = newPic;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      incomingData,
      { new: true }
    );

    return res.json(updatedUser);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


/* ================= DELETE USER ================= */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.json({ message: "User not found" });
    }

    // 🔥 DELETE IMAGE FROM MINIO FIRST
    if (user.profilePic) {
      try {
        await minioClient.removeObject(BUCKET, user.profilePic);
      } catch (err) {
        console.log("MinIO delete failed:", err.message);
      }
    }

    // 🔥 THEN DELETE USER
    await User.findByIdAndDelete(req.params.id);

    return res.json({ message: "User deleted" });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
