// store/slices/projectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    selectedProject: null,
    loading: false,
    error: null,
  },
  reducers: {
    setProjects: (state, action) => {
      state.items = action.payload;
    },
    addProject: (state, action) => {
      state.items.push(action.payload);
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProjects,
  addProject,
  setSelectedProject,
  clearSelectedProject,
  setLoading,
  setError,
} = projectSlice.actions;

export default projectSlice.reducer;