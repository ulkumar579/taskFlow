import { ChevronRight, Plus } from "lucide-react";
import KanbanBoard from "./KanbanBoard";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { setError, setLoading, setSelectedProject } from "@/store/slice/projectSlice";
const ProjectDetailPage = ({ onBack }) => {
  const { id } = useParams(); // ← e01ecd78-18c8-4ab7-bb71-75568ccd1a36
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { selectedProject, loading, error } = useSelector(
    (state) => state.projects,
  );

  useEffect(() => {
    const fetchProject = async () => {
      dispatch(setLoading(true));
      try {
        const res = await api.get(`/project/getProject/${id}`);
        dispatch(setSelectedProject(res.data.data));
      } catch (err) {
        dispatch(
          setError(err.response?.data?.message || "Failed to load project"),
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProject();
  }, [id, dispatch]); // ← refetch whenever id changes (or page loads/refreshes)

  if (loading)
    return <div className="p-8 text-gray-500">Loading project...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!selectedProject) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm mb-4">
          <span
            onClick={onBack}
            className="text-gray-500 hover:text-indigo-600 cursor-pointer font-medium"
          >
            Projects
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">{selectedProject?.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: selectedProject?.color + "22" }}
            >
              <div
                className="w-6 h-6 rounded-md"
                style={{ backgroundColor: selectedProject?.color }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedProject?.name}
              </h1>
              <p className="text-sm text-gray-500">{selectedProject?.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              {/* <Settings className="w-4 h-4" /> Settings */}
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 text-sm">
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>
      </div>

      <KanbanBoard />
    </div>
  );
};

export default ProjectDetailPage;
