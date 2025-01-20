const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType],
      currency: "INR",
      receipt: "any unique id for every order",
      notes: {
        firstName: firstName,
        lastName: lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savePayment = await payment.save();

    console.log(membershipAmount[membershipType]);

    res.json({
      ...savePayment.toJSON(),
      keyId: process.env.RAZOR_ID,
      amount: membershipAmount[membershipType],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = paymentRouter;
