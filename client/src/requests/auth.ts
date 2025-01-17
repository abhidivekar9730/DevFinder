import axios from "axios";
import { BASEURL } from "../helper/constant";
import { LoginData, InputBoxSignUp } from "../types";

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
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

const signup = async ({
  firstName,
  lastName,
  emailId,
  password,
}: InputBoxSignUp) => {
  try {
    const response = await axios.post(
      `${BASEURL}/signup`,
      {
        firstName,
        lastName,
        emailId,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await axios.get(`${BASEURL}/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const forgetPassword = async ({ emailId }: { emailId: string }) => {
  try {
    const response = await axios.post(
      `${BASEURL}/forget`,
      { emailId },
      {
        withCredentials: true,
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const otpverify = async ({
  emailId,
  otpNumber,
}: {
  emailId: string;
  otpNumber: string;
}) => {
  try {
    const response = await axios.post(
      `${BASEURL}/otpverify`,
      { emailId, otpNumber },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async ({
  token,
  password,
}: {
  token: string | undefined;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${BASEURL}/reset/${token}`,
      { resetPassword: password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the response data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to reset password!"
    );
  }
};

export { login, signup, logout, forgetPassword, otpverify, resetPassword };
