import React, { useState } from "react";
import {
  CheckCircle2,
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import Dashboard from "../Home/Dashboard";
import Project from "../Home/Project";
import Task from "../Home/Task";
import ProjectDetail from "../Home/Project/ProjectDetail";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "tasks", label: "My Tasks", icon: ListTodo },
  ];

  // Mock search data
  const mockSearchData = [
    {
      id: 1,
      type: "project",
      title: "Website Redesign",
      subtitle: "Design Team",
    },
    {
      id: 2,
      type: "project",
      title: "Mobile App Development",
      subtitle: "Development Team",
    },
    {
      id: 3,
      type: "task",
      title: "Fix authentication bug",
      subtitle: "In Progress • High Priority",
    },
    {
      id: 4,
      type: "task",
      title: "Design hero section",
      subtitle: "To Do • Design",
    },
    {
      id: 5,
      type: "task",
      title: "Implement dashboard",
      subtitle: "In Progress • Development",
    },
    {
      id: 6,
      type: "project",
      title: "Marketing Campaign",
      subtitle: "Marketing Team",
    },
  ];

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = mockSearchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">
                  TaskFlow
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
                        activeTab === item.id
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Bar - Desktop */}
              <div className="hidden lg:block relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search projects, tasks..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setIsSearchOpen(true)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                {/* Search Results Dropdown */}
                {isSearchOpen && searchResults.length > 0 && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsSearchOpen(false)}
                    />

                    {/* Results */}
                    <div className="absolute top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          {searchResults.length} Results
                        </p>
                      </div>

                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition group"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              result.type === "project"
                                ? "bg-blue-100 group-hover:bg-blue-200"
                                : "bg-purple-100 group-hover:bg-purple-200"
                            }`}
                          >
                            {result.type === "project" ? (
                              <FolderKanban
                                className={`w-4 h-4 ${
                                  result.type === "project"
                                    ? "text-blue-600"
                                    : "text-purple-600"
                                }`}
                              />
                            ) : (
                              <ListTodo className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                              {result.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {result.subtitle}
                            </p>
                          </div>
                        </button>
                      ))}

                      <div className="px-4 py-2 border-t border-gray-100 mt-1">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          View all results →
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* No Results */}
                {isSearchOpen && searchQuery && searchResults.length === 0 && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsSearchOpen(false)}
                    />
                    <div className="absolute top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 py-8 z-20">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          No results found
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Try searching with different keywords
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 transition hidden sm:block"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-600" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition hidden sm:block">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-9 h-9 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">SK</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    Sarah Kumar
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        Sarah Kumar
                      </p>
                      <p className="text-xs text-gray-500">sarah@example.com</p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Search */}
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search projects, tasks..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Mobile Search Results */}
              {searchQuery && (
                <div className="mt-2 bg-gray-50 rounded-lg p-2 max-h-64 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <>
                      <p className="text-xs font-medium text-gray-500 px-2 py-1 uppercase">
                        {searchResults.length} Results
                      </p>
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full flex items-start gap-3 px-2 py-2 hover:bg-white rounded-lg transition"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              result.type === "project"
                                ? "bg-blue-100"
                                : "bg-purple-100"
                            }`}
                          >
                            {result.type === "project" ? (
                              <FolderKanban className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ListTodo className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">
                              {result.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {result.subtitle}
                            </p>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No results found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "projects" &&
          (selectedProject ? (
            <ProjectDetail
              project={selectedProject}
              onBack={() => setSelectedProject(null)}
            />
          ) : (
            <Project onProjectClick={setSelectedProject} />
          ))}
        {activeTab === "tasks" && <Task />}
      </main>
    </div>
  );
}
