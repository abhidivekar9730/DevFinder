import axios from "axios";
import { BASEURL } from "../helper/constant";

const FeedUsers = async () => {
  try {
    const response = await axios.get(`${BASEURL}/feed`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchConnections = async () => {
  try {
    const response = await axios.get(`${BASEURL}/user/connections`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { FeedUsers, fetchConnections };
