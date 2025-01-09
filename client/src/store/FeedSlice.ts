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
      state.feeds = [...state.feeds, ...action.payload]; // Append new feeds
    },
    removeFeed: (state, action: PayloadAction<string>) => {
      state.feeds = state.feeds.filter((feed) => feed._id !== action.payload); // Remove feed by _id
    },
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
