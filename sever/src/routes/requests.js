const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestSchema");
const User = require("../models/userSchema");
const { sendEmail } = require("../utils/nodeMail");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      console.log(req.params);
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }

      // If there is an existing ConnectionsRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exists!" });
      }

      const connectionsRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const request = await connectionsRequest.save();

      sendEmail(
        toUser.emailId, // Recipient's email
        `${req.user.firstName} is interested in You`, // Email subject
        `Hi ${toUser.firstName},\n\nYou have a new request from ${req.user.firstName} on DevMatch! They are interested in connecting with you. You can view and respond to their request by visiting your profile on DevMatch.\n\nCheck it out here: https://devmatch.tusharshitole.site\n\nBest regards,\nThe DevMatch Team`, // Plain text body
        `<html>
          <head><title>New Request Notification</title></head>
          <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <h2 style="text-align: center; color: #0056b3;">You have a new request on DevMatch!</h2>
              <p>Hi <strong>${toUser.firstName}</strong>,</p>
              <p>You have a new request from <strong>${req.user.firstName}</strong> on DevMatch! They are interested in connecting with you.</p>
              <p style="font-size: 16px; color: #555;">You can view and respond to their request by visiting your profile on DevMatch:</p>
              <p style="text-align: center;">
                <a href="https://devmatch.tusharshitole.site/requests" style="background-color: #0056b3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">View Request</a>
              </p>
              <p style="font-size: 14px; color: #777;">Best regards,<br>The DevMatch Team</p>
            </div>
          </body>
        </html>` // HTML body (optional)
      );

      res.json({
        message:
          req.user.firstName + " is " + status + " to " + toUser.firstName,
        request,
      });
    } catch (error) {
      res.status(400).send("Error " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      console.log(data)

      res.status(201).json({ message: "connection request " + status, data });
    } catch (error) {
      res.status(400).send("Error " + error.message);
    }
  }
);

module.exports = requestRouter;
