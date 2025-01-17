const express = require("express");
const User = require("../models/userSchema");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { sendEmail } = require("../utils/nodeMail");
const jwt = require("jsonwebtoken");
const { run } = require("../utils/sendEmail");

const authRouter = express.Router();

let otp = [{ email: "", otp: "", valid: false }];

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

    const eamilRes = await run(
      `Created Account by ${firstName}`,
      `<h1>${emailId}</h1>`,
      "Succssfully Done create an account...."
    );

    const tokenOption = {
      httpOnly: true,
      secure: true, // Set true if using HTTPS
      sameSite: "None",
    };

    // Add the token to cookie and send the response back to the server
    res.cookie("token", token, tokenOption);

    res.json({
      message: "Login Successful!!",
      user: saveData,
    });
  } catch (error) {
    res.status(400).send(error.message.split(":").pop().trim());
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

setInterval(() => {
  if (otp.length > 0) {
    otp.pop();
  }
}, 300000);

authRouter.post("/forget", async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Provide a Valid EmailId");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const generateOtp = Math.floor(Math.random() * 10000);
    otp.push({ email: emailId, otp: generateOtp, valid: false });

    const responseEmail = sendEmail(
      `${emailId}`,
      `Your OTP Code for Verification`,
      " ",
      `<!DOCTYPE html>
<html>
<head>
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #007bff;
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content p {
      margin: 10px 0;
      font-size: 16px;
      color: #333333;
    }
    .otp {
      font-size: 20px;
      font-weight: bold;
      color: #007bff;
      margin: 20px 0;
    }
    .footer {
      background-color: #f4f4f4;
      color: #666666;
      text-align: center;
      padding: 10px 20px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>OTP Verification</h1>
    </div>
    <div class="content">
      <p>Dear ${user.firstName},</p>
      <p>We received a request to verify your email address. Use the OTP below to proceed:</p>
      <div class="otp">${generateOtp}</div>
      <p>Please do not share this OTP with anyone. It is valid for the next 5 minutes.</p>
      <p>If you did not request this verification, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; {{year}} Your Company Name. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>
`
    );

    if (responseEmail) {
      res.json({
        message: "OTP send successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

authRouter.post("/otpverify", async (req, res) => {
  try {
    const { emailId, otpNumber } = req.body;

    // Validate the email format
    if (!validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Provide a valid email address" });
    }

    // Find the user by email
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the OTP matches
    const generatedOtp = otp.find(
      ({ email, otp }) => email === emailId && otp == otpNumber
    );

    if (!generatedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Generate a token upon successful OTP verification
    const token = jwt.sign({ emailId }, "tushar", { expiresIn: "3m" });

    // Return the token and success message
    res.status(200).json({ token, message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params; // Extract the token from URL
    const { resetPassword } = req.body; // Extract the new password from the request body

    // Verify the token
    const verifyToken = jwt.verify(token, "tushar");

    // Check if resetPassword is provided
    if (!resetPassword) {
      throw new Error("Password is required");
    }

    // Hash the new password
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(resetPassword, saltRounds);

    // Find the user using the email from the token
    const user = await User.findOne({ emailId: verifyToken.emailId });

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = authRouter;
