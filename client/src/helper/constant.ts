import io from "socket.io-client";

export const createSocketConnection = () => {
  return io(BASEURL);
};

export const BASEURL: string = "https://devfinder03.onrender.com";

//https://devtinder-mbmq.onrender.com
//

// https://dev-tinder-back.vercel.app
