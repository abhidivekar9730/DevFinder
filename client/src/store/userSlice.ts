import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

const initialState: User = {
  firstName: "",
  lastName: "",
  emailId: "",
  photoUrl: "",
  skills: [],
  about: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      // Replace the state with the new user data
      return { ...action.payload };
    },
    removeUser: () => {
      return {
        firstName: "",
        lastName: "",
        emailId: "",
        photoUrl: "",
        skills: [],
        about: "",
      };
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
