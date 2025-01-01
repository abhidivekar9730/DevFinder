import { Feed } from "../types";

const Card = ({ user }: { user: Feed }) => {
  return (
    <div className="card bg-base-300 w-96 md:w-1/2 shadow-lg  h-full text-gray-200">
      <figure className="pt-5 px-5">
        <img
          className="rounded-md"
          src={user.photoUrl} // Assuming `user.photoUrl` contains the image URL
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
          {user.skills.map((skill) => (
            <div className="badge badge-neutral m-1">{skill}</div>
          ))}
        </div>
        <div className="card-actions justify-center mt-10 mb-6 ">
          <button className="btn btn-primary">Ignore</button>
          <button className="btn btn-secondary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
