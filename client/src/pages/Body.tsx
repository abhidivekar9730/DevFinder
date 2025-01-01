import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/userSlice";
import { fetchUserData } from "../requests/profile";
import { RootState } from "../store/store";

export const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData();
        dispatch(addUser(userData.user));
      } catch (error: any) {
        toast.error(error.response.data);
        navigate("/login");
      }
    };

    if (!user.emailId) {
      fetchData();
    }
  }, [dispatch]);

  return (
    <div>
      <ToastContainer />
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};
