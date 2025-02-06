import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeFeed } from '../store/FeedSlice';
import { sendRequest } from '../requests/User';
import { Feed } from '../types';

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
    <div className="w-full max-w-sm mx-auto bg-base-300 p-4 px-6 text-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Image Container with fixed aspect ratio */}
      <div className="relative w-full pt-[100%] overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
          src={user.photoUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"}
          alt={`${user.firstName} ${user.lastName}`}
        />
      </div>

      <div className="p-4 space-y-4">
        {/* Name and Age Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            {user.firstName} {user.lastName}
          </h2>
          {user.age && (
            <p className="text-gray-400 mt-1">
              {user.age}, {user.gender}
            </p>
          )}
        </div>

        {/* About Section */}
        {user.about && (
          <p className="text-gray-400 leading-relaxed">
            {user.about}
          </p>
        )}

        {/* Skills Section */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-400">Skills</h3>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full font-medium transition-all duration-200 hover:bg-gray-200 hover:text-gray-900 hover:border-b-2 hover:border-blue-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {pathname !== "/profile" && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => handleRequest(user._id || "", "ignored")}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-300"
            >
              Ignore
            </button>
            <button
              onClick={() => handleRequest(user._id || "", "interested")}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700"
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