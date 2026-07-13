import { createSlice } from "@reduxjs/toolkit";

const memberSlice = createSlice({
  name: "member",
  initialState: {
    items: [],
  },
  reducers: {
    setMember: (state, action) => {
      state.items = action.payload;
    },
    clearMember: () => [],
  },
});

export const { setMember, clearMember } = memberSlice.actions;

export default memberSlice.reducer;
