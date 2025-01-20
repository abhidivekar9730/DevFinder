const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: [
      "https://dev-tinder03.vercel.app",
      "https://devmatch.tusharshitole.site",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("server is started at 3000");
    });
  })
  .catch((err) => {
    console.error("Database connect be connected");
  });
