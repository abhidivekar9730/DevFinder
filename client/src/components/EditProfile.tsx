import { useState, useEffect } from "react";
import { EditData } from "../types";
import Input from "./Input";
import Button from "./Button";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { editProfile, fetchUserData } from "../requests/profile";
import { useNavigate } from "react-router-dom";
import { addUser } from "../store/userSlice";
import Card from "./Card";

const EditProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state

  const fetchData = async () => {
    try {
      const userData = await fetchUserData();
      dispatch(addUser(userData.user));
    } catch (error: any) {
      toast.error(error.response.data);
      navigate("/login");
    }
  };

  const [formData, setFormData] = useState<EditData>({
    firstName: "",
    lastName: "",
    about: "",
    age: "",
    photoUrl: "",
    skills: [],
    gender: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        about: user.about || "",
        age: user.age || "",
        photoUrl: user.photoUrl || "",
        skills: user.skills || [],
        gender: user.gender || "",
      });
      setLoading(false); // Set loading to false when user data is loaded
    } else {
      const timeout = setTimeout(() => {
        setLoading(false); // Stop loading after 4 seconds, even if user data is not available
      }, 4000);

      return () => clearTimeout(timeout); // Cleanup timeout on component unmount
    }
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "skills"
          ? value.split(",").map((skill) => skill.trim())
          : value, // Convert back to an array for skills
    }));
  };

  const handleEditProfile = async () => {
    try {
      const response = await editProfile(formData); // Pass the entire formData object

      toast.success(response.message); // Show success
      fetchData();
      navigate("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while editing the profile."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>{" "}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-around items-center gap-4 md:flex-row md:items-center p-4 mb-16">
      <div className="w-full max-w-xl mx-auto m-8 p-8 shadow-lg rounded-xl bg-base-300">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-500 mb-4">
              Edit Profile
            </h2>
            <img src={formData.photoUrl} width={55} className="rounded-lg" />
          </div>

          <div className=" w-full md:flex gap-3">
            <Input
              label="First Name"
              placeholder="Enter your First Name"
              onChange={handleInputChange}
              name="firstName"
              value={formData.firstName} // Pre-fill with existing value
            />

            <Input
              label="Last Name"
              placeholder="Enter your Last Name"
              onChange={handleInputChange}
              name="lastName"
              value={formData.lastName} // Pre-fill with existing value
            />
          </div>

          <div className=" w-full md:flex gap-3">
            <Input
              label="About"
              placeholder="Tell us about yourself"
              onChange={handleInputChange}
              name="about"
              value={formData.about} // Pre-fill with existing value
            />

            <Input
              label="Age"
              placeholder="Enter your age"
              onChange={handleInputChange}
              name="age"
              value={formData.age} // Pre-fill with existing value
            />
          </div>

          <div className=" w-full md:flex gap-3">
            <Input
              label="Photo URL"
              placeholder="Enter your photo URL"
              onChange={handleInputChange}
              name="photoUrl"
              value={formData.photoUrl} // Pre-fill with existing value
            />

            <Input
              label="Gender"
              placeholder="Enter your gender"
              onChange={handleInputChange}
              name="gender"
              value={formData.gender} // Pre-fill with existing value
            />
          </div>

          <Input
            label="Skills"
            placeholder="Enter your skills"
            onChange={handleInputChange}
            name="skills"
            value={formData.skills.join(",")}
          />

          <Button label="Save Changes" onClick={handleEditProfile} />
        </div>
      </div>

      {/* Display only one card */}
      <div className="flex justify-center items-center">
        <Card user={formData} />
      </div>
    </div>
  );
};

export default EditProfile;
