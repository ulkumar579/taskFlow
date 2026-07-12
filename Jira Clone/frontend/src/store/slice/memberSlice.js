import { createSlice } from "@reduxjs/toolkit";

const memberSlice = createSlice({
  name: "member",
  initialState: [],
  reducers: {
    setMember: (state, action) => {
      if (Array.isArray(action.payload)) {
        return action.payload;
      }
      return state;
    },
    clearMember: () => [],
  },
});

export const { setMember, clearMember } = memberSlice.actions;

export default memberSlice.reducer;
