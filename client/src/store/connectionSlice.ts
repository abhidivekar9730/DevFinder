import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Connection } from "../types";

const initialState: Connection[] = []; // Initial state as an empty array

const connectionSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    //@ts-ignore
    addConnections: (state, action: PayloadAction<Connection[]>) => {
      return action.payload; // Overwrites the state with new connections
    },
    removeConnections: () => {
      return []; // Resets the state to an empty array
    },
  },
});

export const { addConnections, removeConnections } = connectionSlice.actions;
export default connectionSlice.reducer;
