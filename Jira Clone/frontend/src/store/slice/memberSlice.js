import { createSlice } from "@reduxjs/toolkit";

const memberSlice = createSlice({
  name: "member",
  initialState: {
    member: [],
  },
  reducers: {
    setMember: (state, action) => {
      state.member = action.payload;
    },
    clearMember: () => [],
  },
});

export const { setMember, clearMember } = memberSlice.actions;

export default memberSlice.reducer;
