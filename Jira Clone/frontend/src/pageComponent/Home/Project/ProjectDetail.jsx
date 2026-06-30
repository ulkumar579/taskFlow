import { ChevronRight, Plus } from "lucide-react";
import KanbanBoard from "./KanbanBoard";

const ProjectDetailPage = ({ project, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm mb-4">
          <span onClick={onBack} className="text-gray-500 hover:text-indigo-600 cursor-pointer font-medium">
            Projects
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">{project.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: project.color + "22" }}>
              <div className="w-6 h-6 rounded-md" style={{ backgroundColor: project.color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-500">{project.description}</p>
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
}

export default ProjectDetailPage;