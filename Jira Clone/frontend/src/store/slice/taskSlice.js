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
    updateTaskStatus: (state, action) => {
      const { taskId, status } = action.payload;
      const index = state.items.findIndex((task) => task.id === taskId);
      if(index !== -1){
        state.items[index].status = status;
      }
    },
  },
});

export const { setTasks, updateTaskStatus } = taskSlice.actions;

export default taskSlice.reducer;
