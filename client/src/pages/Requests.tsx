import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptRequest, fetchRequests, rejectRequest } from "../requests/User";
import { addRequest, removeRequest } from "../store/requestSlice";
import { RootState } from "../store/store";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store: RootState) => store.requests);

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchRequests(); // Fetch connections data
      // console.log(data);
      dispatch(addRequest(data.data));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      dispatch(removeRequest(requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest(requestId);
      dispatch(removeRequest(requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (!loading && requests.length === 0) {
    return (
      <div className="flex justify-center my-10">
        <h1 className="font-bold text-2xl">No Connection Found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-10 w-full ">
      <h1 className="font-bold text-2xl mb-6">Connections</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full px-2 ">
        {requests.map((request) => (
          <div
            key={request._id}
            className="card card-side bg-base-200 shadow-lg rounded-lg overflow-hidden flex items-center justify-center p-2 px-9"
          >
            <img
              src={
                request.fromUserId.photoUrl ||
                "https://via.placeholder.com/150?text=No+Image"
              }
              alt="User"
              className="max-w-28 max-h-28 rounded-lg object-cover border border-gray-300 ml-4"
            />

            <div className="card-body ml-7">
              <h2 className="card-title text-lg font-semibold text-gray-200">
                {request.fromUserId.firstName} {request.fromUserId.lastName}
              </h2>

              <p className="text-gray-400 ">
                {request.fromUserId.about || "No details available"}
              </p>

              <div>
                <span className="font-semibold">Skills : </span>
                {request.fromUserId.skills.map((skill, inde) => (
                  <div className="badge badge-warning m-1 p-3" key={inde}>
                    {skill}
                  </div>
                ))}
              </div>

              <div className=" flex gap-4 justify-center">
                <button
                  className="btn btn-sm md:btn-md  text-red-500 bg-gray-200"
                  onClick={() => {
                    handleReject(request._id);
                    fetchData();
                  }}
                >
                  Reject
                </button>
                <button
                  className="btn btn-sm md:btn-md bg-[#007bfc] text-white"
                  onClick={() => {
                    handleAccept(request._id);
                  }}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
