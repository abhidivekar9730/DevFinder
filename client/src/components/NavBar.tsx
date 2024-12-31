import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../requests/auth";
import { toast } from "react-toastify";
import { removeUser } from "../store/userSlice";

const NavBar = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      const res = await logout();
      toast.success(res.message);
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
      dispatch(removeUser());
      navigate("/login");
    }
  };
  return (
    <div className="navbar bg-base-300 shadow-lg">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl">
          🧑‍💻 DEV MATCH
        </Link>
      </div>
      {user.emailId && (
        <div className="flex-none gap-2">
          <p>Hello, {user.firstName}</p>
          <div className="dropdown dropdown-end mx-5">
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
                <a>Settings</a>
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
