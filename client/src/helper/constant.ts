import io from "socket.io-client";

export const createSocketConnection = () => {
  return io(BASEURL);
};

export const BASEURL: string = "https://devfinder03.onrender.com";

// https://devfinder03.onrender.com

// http://localhost:3000
 
