const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://devfinder01.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// app.use("/",(req,res)=>  res.send("hee"))


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);
app.use("/", (res, req) => res.json({ "hello": "hello" }))

const server = http.createServer(app);

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
  })
  .then(() => {
    server.listen(3000, () => console.log("Start at 3000"))
  })
  .catch((err) => {
    console.error("Database connect be connected");
  });
