import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Feed, Feeds } from "../types";

const initialState: Feeds = {
  feeds: [],
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeed: (state, action: PayloadAction<Feed[]>) => {
      state.feeds = [...state.feeds, ...action.payload];
    },
    removeFeed: (state) => {
      state.feeds = [];
    },
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
