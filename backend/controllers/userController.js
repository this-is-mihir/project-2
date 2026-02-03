const User = require("../model/user");

// create user
const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      age,
      profilePic
    } = req.body;

    const user = new User({
      username,
      email,
      password,
      age,
      profilePic // 🔥 THIS WAS MISSING
    });

    await user.save();
    return res.json(user);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// single user
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.json(user);
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body // profilePic yaha bhi aayega
      },
      { new: true }
    );

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
