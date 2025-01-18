const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const userAuth = async (req, res, next) => {
  //read the token from the req cookies

  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login");
    }

    const decodedObj = await jwt.verify(token, process.env.TOKEN_SECRET);


    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("Error : " + error);
  }
};

module.exports = { userAuth };
