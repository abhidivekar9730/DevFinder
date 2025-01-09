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

const fetchRequests = async () => {
  try {
    const response = await axios.get(`${BASEURL}/user/requests/received`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// - POST /request/review/accepted/:requestId
// - POST /request/review/rejected/:requestId

const acceptRequest = async (requestId: string) => {
  try {
    const response = await axios.post(
      `${BASEURL}/request/review/accepted/${requestId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const rejectRequest = async (requestId: string) => {
  try {
    const response = await axios.post(
      `${BASEURL}/request/review/rejected/${requestId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// /request/send/:status/:userId
// /request/send/:status/:toUserId

const sendRequest = async (userId: string, status: string) => {
  try {
    const response = await axios.post(
      `${BASEURL}/request/send/${status}/${userId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  FeedUsers,
  fetchConnections,
  fetchRequests,
  acceptRequest,
  rejectRequest,
  sendRequest,
};
