import axios from "axios";
import { BASEURL } from "../helper/constant";

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

export { fetchUserData };
