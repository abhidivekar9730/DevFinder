import { useEffect, useState } from "react";
import { fetchConnections } from "../requests/User";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../store/connectionSlice";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store: RootState) => store.connection);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchConnections(); // Fetch connections data
        dispatch(addConnections(data.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (!loading && connections.length === 0) {
    return (
      <div className="flex justify-center my-10">
        <h1 className="font-bold text-2xl">No Connection Found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-10 w-full">
      <h1 className="font-bold text-2xl mb-6">Connections</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full px-4">
        {connections.map((connection) => (
          <div
            key={connection._id}
            className="card card-side bg-base-200 shadow-lg rounded-lg overflow-hidden flex items-center p-4"
          >
            <img
              src={
                connection.photoUrl ||
                "https://via.placeholder.com/150?text=No+Image"
              }
              alt="User"
              className="w-20 h-20 rounded-full object-cover border border-gray-300"
            />

            <div className="card-body ml-4">
              <h2 className="card-title text-lg font-semibold text-gray-200">
                {connection.firstName} {connection.lastName}
              </h2>
              {connection.age && (
                <p>
                  {connection.age}, {connection.gender}
                </p>
              )}

              <p className="text-gray-400">
                {connection.about || "No details available"}
              </p>
              <Link to={`/chat/${connection._id}`} className="flex justify-end">
                <button className=" bg-blue-500 text-white text-center py-2 rounded-md font-bold px-4">
                  Chat
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
