const express = require("express");
const User = require("../models/userSchema");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const saveData = await user.save();
    const token = await user.getJWT();

    const tokenOption = {
      httpOnly: true,
      secure: true, // Set true if using HTTPS
      sameSite: "None",
      domain: "localhost",
    };

    // Add the token to cookie and send the response back to the server
    res.cookie("token", token, tokenOption);

    res.json({
      message: "Login Successful!!",
      user: saveData,
    });
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Provide a Valid EmailId");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT Token

      const token = await user.getJWT();

      const tokenOption = {
        httpOnly: true,
        secure: true, // Set true if using HTTPS
        sameSite: "None",
        domain: "localhost",
      };

      const { password, ...userWithoutPassword } = user.toObject();

      // Add the token to cookie and send the response back to the server
      res.cookie("token", token, tokenOption);

      res.json({
        message: "Login Successful!!",
        user: userWithoutPassword,
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.get("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    res.status(201).json({ message: "LogOut Successful" });
  } catch (error) {
    res.status(400).send("Error logout the user:" + error);
  }
});

module.exports = authRouter;
