import io from "socket.io-client";

export const createSocketConnection = () => {
  return io(BASEURL);
};

export const BASEURL: string = "http://localhost:3000";

//https://devtinder-mbmq.onrender.com
//

// https://dev-tinder-back.vercel.app
