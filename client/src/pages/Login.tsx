import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { LoginData } from "../types";
import { login } from "../requests/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ButtonChange from "../components/ButtonChange";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    emailId: "",
    password: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await login(formData); // Pass the entire formData object
      toast.success(response.message); // Show success message
      dispatch(addUser(response.user));
      Navigate("/");
    } catch (error: any) {
      // console.log(error);
      toast.error(error.response?.data?.message || "Login failed!"); // Show error message
    }
  };

  return (
    <div className="md:max-w-md mx-auto mt-10 p-8 shadow-lg rounded-xl bg-base-300">
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-500 mb-4">Login</h2>

        <Input
          type="email"
          label="Email"
          placeholder="Enter your Email"
          onChange={handleInputChange}
          name="emailId"
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your Password"
          onChange={handleInputChange}
          name="password"
        />

        <Button
          label="Login"
          onClick={handleLogin}
          // className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        />

        <ButtonChange
          text="Don't have an Account ? "
          navigate="/signup"
          text2="Sign Up"
        />

        <ButtonChange
          text=" "
          navigate="/forget"
          text2="Forget Your Password"
        />
      </div>
    </div>
  );
};

export default Login;
