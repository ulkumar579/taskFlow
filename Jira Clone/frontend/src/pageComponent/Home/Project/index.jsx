import React, { useEffect, useState } from "react";
import { Search, Filter, Plus, X, Users, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";
import { useForm } from "react-hook-form";

export default function Project({onProjectClick}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [member, setMember] = useState([]);
  // ✅ Replace formData useState with RHF
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      members: [],
    },
  });

  // ✅ Watch members in real-time (replaces formData.members)
  const watchedMembers = watch("members") || [];

  // const allTeamMembers = [
  //   { id: 1, name: "John Doe", initials: "JD", email: "john@example.com" },
  //   { id: 2, name: "Sarah Smith", initials: "SS", email: "sarah@example.com" },
  //   { id: 3, name: "Alex Johnson", initials: "AJ", email: "alex@example.com" },
  //   { id: 4, name: "Emma Wilson", initials: "EW", email: "emma@example.com" },
  //   { id: 5, name: "Michael Brown", initials: "MB", email: "michael@example.com" },
  //   { id: 6, name: "Lisa Davis", initials: "LD", email: "lisa@example.com" },
  // ];

  const projectColors = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#EF4444" },
    { name: "Green", value: "#10B981" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Orange", value: "#F59E0B" },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await api.get("/project/getProject");
      setProjects(res.data.data.resultset);
    };
    fetchProjects();
    const fetchMember = async () => {
      const res = await api.get("/members/getMember");
      setMember(res.data.data.resultset);
    };
    fetchMember();
  }, []);

  const searchQueryHandler = (query) => {
    if (query !== "") setIsTeamDropdownOpen(true);
    setTeamSearchQuery(query);
  };

  // ✅ Replace formData.members toggle with setValue
  const toggleMemberSelection = (member) => {
    const current = getValues("members") || [];
    const isSelected = current.some((m) => m.id === member.id);
    setValue(
      "members",
      isSelected
        ? current.filter((m) => m.id !== member.id)
        : [...current, member],
    );
  };

  // ✅ handleSubmit gives all values - call API here
  const onSubmit = async (data) => {
    try {
      const response = await api.post("/project/createProject", {
        name: data.name.trim(),
        description: data.description.trim(),
        color: selectedColor,
        memberIds: data.members.map((m) => m.id),
      });

      if (response.data.success) {
        handleCloseModal();
        const res = await api.get("/project/getProject");
        setProjects(res.data.data.resultset);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // ✅ Reset RHF + all local states on close
  const handleCloseModal = () => {
    reset();
    setSelectedColor("#3B82F6");
    setTeamSearchQuery("");
    setIsTeamDropdownOpen(false);
    setIsModalOpen(false);
  };

  const filteredTeamMembers = member.filter(
    (member) =>
      member.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(teamSearchQuery.toLowerCase()),
  );

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getMemberIntialName = (memberId = "") => {
    const memberById = member.find((mem) => mem.id === memberId);
    const splitName = memberById?.name?.split("");
    const intial = splitName?.[0]?.charAt(0) + "" + splitName?.[1]?.charAt(0);
    console.log(intial);
    return intial.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage all your projects in one place
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              New Project
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border-l-4"
              style={{ borderLeftColor: project.color }}
              onClick={()=>onProjectClick(project)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <span className="text-xs font-medium text-gray-600">
                      {project.status}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    {project.members?.map((member) => (
                      <div
                        key={member}
                        className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
                        style={{ backgroundColor: project.color }}
                      >
                        {getMemberIntialName(member)}
                      </div>
                    ))}
                  </div>
                  {project.extraMembers > 0 && (
                    <span className="text-xs text-gray-500">
                      +{project.extraMembers}
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Progress</span>
                    <span
                      className="font-semibold"
                      style={{ color: project.color }}
                    >
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {project.totalTasks} tasks
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Project
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* ✅ handleSubmit wraps onSubmit */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name", {
                      required: "Project name is required",
                      minLength: { value: 3, message: "Minimum 3 characters" },
                      maxLength: {
                        value: 50,
                        message: "Maximum 50 characters",
                      },
                    })}
                    type="text"
                    placeholder="Enter project name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500 bg-red-50"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      ⚠ {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Minimum 10 characters",
                      },
                      maxLength: {
                        value: 200,
                        message: "Maximum 200 characters",
                      },
                    })}
                    placeholder="Enter project description"
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition resize-none ${
                      errors.description
                        ? "border-red-500 focus:ring-red-500 bg-red-50"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      ⚠ {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Project Color - stays as useState, setValue not needed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Project Color
                  </label>
                  <div className="flex gap-3">
                    {projectColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-6 h-6 rounded-sm transition-all cursor-pointer ${
                          selectedColor === color.value
                            ? "ring-1 ring-offset-2 ring-indigo-700 scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Add Team Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Team Members
                    {/* ✅ watchedMembers replaces formData.members */}
                    {watchedMembers.length > 0 && (
                      <span className="ml-2 text-xs text-indigo-600 font-semibold">
                        ({watchedMembers.length} selected)
                      </span>
                    )}
                  </label>

                  <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                    {/* Search Input */}
                    <div className="flex items-center px-3 py-2 border-b border-gray-200 bg-gray-50">
                      <Search className="w-4 h-4 text-gray-400 flex-shrink-0 mr-2" />
                      <input
                        type="text"
                        placeholder="Search team members..."
                        value={teamSearchQuery}
                        onChange={(e) => searchQueryHandler(e.target.value)}
                        className="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setIsTeamDropdownOpen(!isTeamDropdownOpen)
                        }
                        className="ml-2 w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isTeamDropdownOpen ? "rotate-45" : "rotate-0"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Members List */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${isTeamDropdownOpen ? "max-h-52 overflow-y-auto" : "max-h-0"}`}
                    >
                      {filteredTeamMembers.length > 0 ? (
                        filteredTeamMembers.map((member, idx) => {
                          // ✅ watchedMembers replaces formData.members
                          const isSelected = watchedMembers.some(
                            (m) => m.id === member.id,
                          );
                          const avatarColors = [
                            "bg-indigo-100 text-indigo-600",
                            "bg-purple-100 text-purple-600",
                            "bg-blue-100 text-blue-600",
                            "bg-green-100 text-green-600",
                            "bg-pink-100 text-pink-600",
                            "bg-orange-100 text-orange-600",
                          ];
                          return (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => toggleMemberSelection(member)}
                              className={`w-full flex items-center gap-3 px-4 py-3 transition border-b border-gray-100 last:border-b-0 ${
                                isSelected ? "bg-indigo-50" : "hover:bg-gray-50"
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${avatarColors[idx % avatarColors.length]}`}
                              >
                                {member.initials}
                              </div>
                              <div className="flex-1 text-left">
                                <p
                                  className={`text-sm font-medium ${isSelected ? "text-indigo-700" : "text-gray-900"}`}
                                >
                                  {member.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {member.email}
                                </p>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${
                                  isSelected
                                    ? "bg-indigo-600 border-indigo-600"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            No members found
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer: Select All / Clear All */}
                    {member.length > 0 && isTeamDropdownOpen && (
                      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <button
                          type="button"
                          // ✅ setValue replaces setFormData
                          onClick={() => setValue("members", [...member])}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Select All
                        </button>
                        {watchedMembers.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setValue("members", [])}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected Chips */}
                  {/* ✅ watchedMembers replaces formData.members */}
                  {watchedMembers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {watchedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-1.5 pl-1 pr-2 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-sm"
                        >
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {member.initials}
                          </div>
                          <span className="text-indigo-700 font-medium text-xs">
                            {member.name.split(" ")[0]}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleMemberSelection(member)}
                            className="text-indigo-400 hover:text-indigo-700 ml-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  {/* ✅ type="submit" triggers handleSubmit → onSubmit */}
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
