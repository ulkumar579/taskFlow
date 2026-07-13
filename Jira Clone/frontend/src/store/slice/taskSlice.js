// store/slices/taskSlice.js
import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
  },
  reducers: {
    setTasks: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setTasks } = taskSlice.actions;

export default taskSlice.reducer;
