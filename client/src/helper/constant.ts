import io from "socket.io-client";

export const createSocketConnection = () => {
  return io(BASEURL);
};

export const BASEURL: string = "https://devtinder-mbmq.onrender.com";

//https://devtinder-mbmq.onrender.com
//http://localhost:3000

// https://dev-tinder-back.vercel.app
