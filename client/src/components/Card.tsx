import { useLocation } from "react-router-dom";
import { Feed } from "../types";
import { sendRequest } from "../requests/User";
import { useDispatch } from "react-redux";
import { removeFeed } from "../store/FeedSlice";

const Card = ({ user }: { user: Feed }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const handleRequest = async (userId: string, status: string) => {
    try {
      await sendRequest(userId, status);
      dispatch(removeFeed(userId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <div className="card bg-base-300 w-96 md:w-1/2 shadow-lg h-full text-gray-200">
      <figure className="pt-5 px-5 min-h-[278px] min-w-[278px]">
        <img
          className="rounded-md object-cover "
          src={
            user.photoUrl ||
            "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg"
          } // Placeholder URL if no image is provided
          alt="User"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-gray-200 font-bold">
          {user.firstName} {user.lastName}
        </h2>
        {user.age && (
          <p>
            {user.age}, {user.gender}
          </p>
        )}
        {/* Render user's name */}
        <p>{user.about}</p> {/* Render user's about */}
        <div>
          <span className="font-semibold">Skills : </span>
          {user.skills.map((skill, inde) => (
            <div className="badge badge-neutral m-1" key={inde}>
              {skill}
            </div>
          ))}
        </div>
        {pathname != "/profile" && (
          <div className="card-actions justify-center mt-10 mb-6 ">
            <button
              className="btn btn-primary"
              //@ts-ignore
              onClick={() => handleRequest(user._id, "ignored")}
            >
              Ignore
            </button>
            <button
              className="btn btn-secondary"
              //@ts-ignore
              onClick={() => handleRequest(user._id, "interested")}
            >
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
