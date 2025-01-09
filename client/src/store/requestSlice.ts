import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Requests } from "../types";

const initialState: Requests[] = []; // Initial state as an empty array of Requests

const requestSlice = createSlice({
  name: "Request",
  initialState,
  reducers: {
    //@ts-ignore
    addRequest: (state, action: PayloadAction<Requests[]>) => {
      return action.payload; // Overwrites the state with new connections
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      return state.filter((request) => request._id !== action.payload);
    },
  },
});

export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
