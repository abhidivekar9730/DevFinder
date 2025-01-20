import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../requests/auth";
import { toast } from "react-toastify";
import { removeUser } from "../store/userSlice";

const NavBar = () => {
  const user = useSelector((state: RootState) => state.user);
  const requestCount = useSelector((state: RootState) => state.requests.length);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      const res = await logout();
      toast.success(res.message);
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      dispatch(removeUser());
      navigate("/login");
    }
  };
  return (
    <div className="navbar bg-base-300 shadow-lg z-50">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl">
          🧑‍💻 DEV MATCH
        </Link>
      </div>
      {user.emailId && (
        <div className="flex-none">
          <p>Hello, {user.firstName}</p>
          <div className="dropdown dropdown-end mx-3 mr-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt={user.firstName} src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={"/profile"} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to={"/connections"}>Connections</Link>
              </li>

              <li>
                <Link to={"/requests"}>
                  Requests
                  <span className="badge badge-info">{requestCount}</span>
                </Link>
              </li>

              <li>
                <Link to={"/premium"}>Premium</Link>
              </li>
              <li>
                <p onClick={handleLogOut}>Logout</p>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
