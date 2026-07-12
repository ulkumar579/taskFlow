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
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [notifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard, path: "/dashboard" },
    { id: "projects", label: "Projects", icon: FolderKanban, path: "/projects" },
    { id: "tasks", label: "Tasks", icon: ListTodo, path: "/tasks" },
  ];

  // Mock search data
  const mockSearchData = [
    { id: 1, type: "project", title: "Website Redesign", subtitle: "Design Team" },
    { id: 2, type: "project", title: "Mobile App Development", subtitle: "Development Team" },
    { id: 3, type: "task", title: "Fix authentication bug", subtitle: "In Progress • High Priority" },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = mockSearchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  return (
    // Outer wrapper positions the floating pill
    <div className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none">
      
      {/* Light Glassmorphic Navbar */}
      <nav className="pointer-events-auto relative w-full  bg-white/80 backdrop-blur-xl border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-pink-400 rounded-full blur-[6px] opacity-60"></div>
            <div className="relative w-full h-full bg-gradient-to-tr from-cyan-400 to-pink-400 rounded-full border border-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold text-gray-800 hidden sm:block tracking-tight">
            TaskFlow
          </span>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/3 -translate-x-1/2 bg-gray-50/80 border border-gray-100 rounded-full p-1 shadow-inner ">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 group ${
                  isActive
                    ? "bg-white text-blue-600 shadow-md border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-100" : "scale-90 group-hover:scale-100"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3 lg:gap-4 relative z-10">
          
          {/* Search Bar - Desktop */}
          <div className="hidden xl:block relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setIsSearchOpen(true)}
              className="pl-9 pr-4 py-2 w-48 xl:w-60 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-inner"
            />

            {/* Light Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSearchOpen(false)} />
                <div className="absolute top-full mt-4 right-0 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {searchResults.length} Results
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition group text-left"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${result.type === "project" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                          {result.type === "project" ? <FolderKanban className="w-4 h-4" /> : <ListTodo className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600">{result.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{result.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Icon Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="relative p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
              )}
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white hover:scale-105 transition-transform shadow-[0_0_10px_rgba(139,92,246,0.3)]"
            >
              <span className="text-white text-sm font-semibold">SK</span>
            </button>

            {/* Light Profile Menu */}
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                <div className="absolute right-0 mt-4 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">Sarah Kumar</p>
                    <p className="text-xs text-gray-500">sarah@example.com</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => navigate("/setting")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                  </div>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Glowing CTA Button */}
          {/* <button className="hidden sm:block px-5 py-2 rounded-full font-bold text-sm text-white bg-gradient-to-r from-pink-400 to-orange-400 shadow-[0_4px_15px_rgba(244,114,182,0.4)] hover:shadow-[0_6px_20px_rgba(244,114,182,0.6)] hover:-translate-y-0.5 transition-all duration-300">
            Get Started
          </button> */}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown (Light Glass) */}
      {isMobileMenuOpen && (
        <div className="absolute top-[80px] left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-2xl overflow-hidden pointer-events-auto z-40">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">
              {/* <button className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-400 to-orange-400 shadow-[0_4px_15px_rgba(244,114,182,0.3)]">
                Get Started
              </button> */}
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}