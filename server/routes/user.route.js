// importing user context
const User = require("../models/user.model");
const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const fs = require("fs");
const upload = require("../middleware/multer");

// const app = express();

const router = express.Router();
const jwt = require("jsonwebtoken");
const e = require("express");

router.get("/showhomepage", async (req, res) => {
  res.send("Hellos");
});
router.post("/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { full_name, phone, email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res
        .status(400)
        .json({ success: false, message: "All input is required" });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ success: false, message: "User Already Exist. Please Login" });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      full_name,
      phone,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.ACCESS_TOKEN_SECRET,

      {
        // expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(200).json({
      success: true,
      message: "User registered in Successfully 🙌 ",
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.post("/login", async (req, res) => {
  // console.log(req.query === {});
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res
        .status(400)
        .json({ success: false, message: "All input is required" });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.ACCESS_TOKEN_SECRET
        // {
        //   expiresIn: "2h",
        // }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json({
        success: true,
        message: "Logged in Successfully 🙌 ",
        user: user,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
router.post("/logout", auth, async (req, res) => {
  try {
    // res.cookie("jwt", "", { maxAge: "1" }); //set token to empty and also max expiring to 1 sec
    res.clearCookie("jwt");
    return res.status(200).json({
      success: true,
      message: "Logged out Successfully 🙌 ",
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/updateUser", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.user_id, req.body, {
    useFindAndModify: false,
  });
  var user = await User.findById(req.user.user_id).lean();
  return res.status(200).json({
    success: true,
    message: "Info retrieved successfully 🙌 ",
    user: user,
  });
});
router.post("/changePassword", auth, async (req, res) => {
  try {
    var user = await User.findById(req.user.user_id).lean();
    const email = req.user.email;
    const { old_password, new_password } = req.body;
    console.log("password");
    console.log(old_password);
    console.log(new_password);
    if (!(old_password && new_password)) {
      // Validate if user exist in our database
      return res
        .status(400)
        .json({ success: false, message: "All input is required" });
    }
    if (user && (await bcrypt.compare(old_password, user.password))) {
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(new_password, 10);
      await User.findByIdAndUpdate(user._id, { password: encryptedPassword });
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.ACCESS_TOKEN_SECRET
        // {
        //   expiresIn: "2h",
        // }
      );

      // save user token
      user.token = token;
      return res.status(200).json({
        success: true,
        message: "Password Changed successfully 🙌 ",
        user: user,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect old password" });
    }
  } catch (error) {
    console.log(error);
  }
});
const uploadPicture = upload.single("image");

router.post("/updateProfilePicture", auth, async (req, res) => {
  console.log("profile dp is hitted");
  uploadPicture(req, res, async function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({ message: err.message });
    }
    try {
      const url = req.protocol + "://" + req.get("host");
      const file = req.file;
      const { path } = file;
      const newPath = path.replace(/\\/g, "/");
      const dattoUpdate = {
        profilePicture: url + "/" + newPath,
      };
      let user = await User.findByIdAndUpdate(req.user.user_id, dattoUpdate, {
        useFindAndModify: false,
      }).select("-token");
      // console.log(user);
      res.status(200).json({
        success: true,
        message: "Info retrieved successfully 🙌",
        user: user,
        dp: path,
      });
    } catch (error) {
      console.log(error);
    }
  });
});

router.post("/getUser", auth, async (req, res) => {
  // console.log(req.user)

  let user = await User.findById(req.user.user_id).select("-password");
  res.status(200).json({
    success: true,
    message: "Info retrieved successfully 🙌 ",
    user: user,
  });
});
router.post("/getAUser", auth, async (req, res) => {
  let user = await User.findById(req.body.user_id).select("-password");

  res.status(200).json({
    success: true,
    message: "Info retrieved successfully 🙌 ",
    user: user,
  });
});
router.get("/getAllUsers", async (req, res) => {
  // console.log(req.user)

  User.find({}, function (err, users) {
    res.send(users);
  }).select("-password");
});

router.post("/getAllCustomers", async (req, res) => {
  // console.log(req.user)
  var users = await User.find({ user_type: "business_user" }).lean();

  res.json(users);
});

module.exports = router;
