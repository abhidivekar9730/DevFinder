import axios from "axios";
import { BASEURL } from "../helper/constant";
import { EditData } from "../types";

const fetchUserData = async () => {
  try {
    const user = await axios.get(`${BASEURL}/profile/view`, {
      withCredentials: true,
    });

    return await user.data;
  } catch (error) {
    throw error;
  }
};

const editProfile = async (profileData: EditData) => {
  try {
    const response = await axios.patch(`${BASEURL}/profile/edit`, profileData, {
      withCredentials: true, // Include cookies for authentication
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export { fetchUserData, editProfile };
