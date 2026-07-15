import { useState, useMemo, useCallback, useEffect } from "react";
import ProjectsHeader from "../project/ProjectsHeader";
import SearchAndFilters from "../project/SearchAndFilters";
import ProjectGrid from "../project/ProjectGrid";
import Pagination from "../project/Pagination";
import ProjectsSidebar from "../project/ProjectsSidebar";
import { useDropdown } from "../hooks/useDropdown";
import { setError, setProjects, setLoading as setLoadingProject } from "@/store/slice/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import api from "@/utils/api";
import { setMember } from "@/store/slice/memberSlice";

const PER_PAGE = 6;

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("Recent");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#7c3aed");
  const [members, setMembers] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);

  // const [member, setMember] = useState([]);
  const dropdown = useDropdown();
  const { items: projects, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  /* Simulate loading */
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  /* Reset page when filter/search changes */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeFilter, sortBy]);

  useEffect(() => {
    const fetchProjects = async () => {
      // dispatch(setLoading(true));
      try {
        console.log("Fetching projects...");
        const res = await api.get("/project/getProject");
        dispatch(setProjects(res.data.data.resultset));
      } catch (err) {
        dispatch(setError(err.response?.data?.message || "Failed to fetch"));
      } finally {
        dispatch(setLoadingProject(false));
      }
    };

    fetchProjects();

    const fetchMembers = async () => {
      try {
        const res = await api.get("/members/getMember");
        if (res.status === 200) {
          const data = res.data.data.resultset ?? [];
          dispatch(setMember(data));
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };

    fetchMembers();
    // fetchTasks();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "high" && p.priority === "high") ||
        (activeFilter === "medium" && p.priority === "medium") ||
        (activeFilter === "low" && p.priority === "low") ||
        activeFilter === "archived"; /* no archived in mock data */

      return matchesSearch && matchesFilter;
    });
  }, [debouncedSearch, activeFilter, projects]);

  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    const priorityOrder = { high: 0, medium: 1, low: 2 };

    switch (sortBy) {
      case "Name A-Z":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "Progress":
        return list.sort((a, b) => b.progress - a.progress);
      case "Due Date":
        return list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      case "Priority":
        return list.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
        );
      case "Recent":
      default:
        return list.sort((a, b) => Number(b.id) - Number(a.id));
    }
  }, [filteredProjects, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / PER_PAGE));

  const pagedProjects = useMemo(
    () => sortedProjects.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [sortedProjects, page],
  );

  const handleSearch = useCallback((v) => setSearch(v), []);
  const handleFilter = useCallback((f) => setActiveFilter(f), []);
  const handleView = useCallback((v) => setView(v), []);
  const handlePage = useCallback((p) => setPage(p), []);
  const handleSort = useCallback((value) => setSortBy(value), []);

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* Background blobs */}
      <div
        className="page-blob w-[500px] h-[500px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,.08), transparent)",
          top: "10%",
          right: "-10%",
          animationDelay: "0s",
        }}
      />
      <div
        className="page-blob w-[400px] h-[400px]"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,.06), transparent)",
          bottom: "20%",
          left: "-8%",
          animationDelay: "3s",
        }}
      />

      <main className="relative z-10 pt-[80px] px-4 md:px-8 lg:px-10 max-w-[1440px] mx-auto pb-16">
        {/* Header */}
        <ProjectsHeader
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          name={name}
          description={description}
          color={color}
          members={members}
          setName={setName}
          setDescription={setDescription}
          setColor={setColor}
          setMembers={setMembers}
          editingProjectId={editingProjectId}
          setEditingProjectId={setEditingProjectId}
        />

        {/* Main 2-column layout */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* Left: Search + Grid + Pagination */}
          <div className="flex-1 min-w-0">
            <SearchAndFilters
              search={search}
              onSearch={handleSearch}
              activeFilter={activeFilter}
              onFilter={handleFilter}
              view={view}
              onView={handleView}
              sort={sortBy}
              onSort={handleSort}
              dropdown={dropdown}
            />

            <ProjectGrid
              projects={pagedProjects}
              loading={loading}
              view={view}
              dropdown={dropdown}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              name={name}
              description={description}
              color={color}
              members={members}
              setName={setName}
              setDescription={setDescription}
              setColor={setColor}
              setMembers={setMembers}
              editingProjectId={editingProjectId}
              setEditingProjectId={setEditingProjectId}
            />

            {!loading && sortedProjects.length > 0 && (
              <Pagination
                current={page}
                total={totalPages}
                onChange={handlePage}
              />
            )}
          </div>

          {/* Right: Sidebar */}
          <ProjectsSidebar
            total={sortedProjects.length}
            perPage={PER_PAGE}
            currentPage={page}
          />
        </div>
      </main>
    </div>
  );
}
