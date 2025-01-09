import { useEffect, useState } from "react";
import { FeedUsers } from "../requests/User";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../store/FeedSlice";
import { RootState } from "../store/store";
import Card from "../components/Card";

const FeedPage = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store: RootState) => store.feed);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (feed.feeds.length > 0) return; // Prevent fetching if feeds are already populated
      setLoading(true);
      try {
        const data = await FeedUsers(); // Assume this fetches `User[]`
        dispatch(addFeed(data.users)); // Dispatch action to add sanitized users to the Redux store
      } catch (error) {
        console.error("Error fetching feeds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, feed.feeds.length]); // Dependencies ensure correct behavior

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (!loading && feed.feeds.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No User Found..</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ height: "calc(100vh - 120.5px)" }}
    >
      <div className="flex justify-center items-center">
        {feed.feeds.length > 0 && <Card user={feed.feeds[0]} />}
      </div>
    </div>
  );
};

export default FeedPage;
