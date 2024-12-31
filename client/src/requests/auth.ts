import axios from "axios";
import { BASEURL } from "../helper/constant";
import { LoginData } from "../types";

const login = async ({ emailId, password }: LoginData) => {
  try {
    const response = await axios.post(
      `${BASEURL}/login`,
      {
        emailId,
        password,
      },
      { withCredentials: true }
    );

    console.log("Login successful:", response);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export default login;
