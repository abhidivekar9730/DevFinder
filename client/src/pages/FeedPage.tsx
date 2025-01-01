import { useEffect, useState } from "react";
import { FeedUsers } from "../requests/User";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../store/FeedSlice";
import { RootState } from "../store/store";
import Card from "../components/Card";

const FeedPage = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store: RootState) => store.feed);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (feed.feeds.length !== 0) return; // Prevent fetching if feed is already populated
      try {
        const data = await FeedUsers(); // Assume this fetches `User[]`
        dispatch(addFeed(data.users)); // Dispatch action to add sanitized users to the Redux store
      } catch (error) {
        console.error("Error fetching feeds:", error);
      }
    };
    fetchData();
  }, [dispatch, feed.feeds.length]);

  const showNextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % feed.feeds.length);
  };

  const showPreviousCard = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + feed.feeds.length) % feed.feeds.length
    );
  };

  if (feed.feeds.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>{" "}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-center items-center "
      style={{ height: "calc(100vh - 120.5px)" }}
    >
      {/* Display only one card */}
      <div className="flex justify-center items-center">
        <Card user={feed.feeds[3]} />
      </div>

      {/* <div className="mt-5 flex justify-between w-full max-w-sm">
        <button onClick={showPreviousCard} className="btn btn-secondary">
          Previous
        </button>
        <button onClick={showNextCard} className="btn btn-primary">
          Next
        </button>
      </div> */}
    </div>
  );
};

export default FeedPage;
