  import { useState, useMemo, useCallback, useEffect } from 'react';
  import ProjectsHeader from '../project/ProjectsHeader';
  import SearchAndFilters from '../project/SearchAndFilters';
  import ProjectGrid from '../project/ProjectGrid';
  import Pagination from '../project/Pagination';
  import ProjectsSidebar from '../project/ProjectsSidebar';
  import { PROJECTS } from './projects';

  const PER_PAGE = 6;

  export default function Project() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [view, setView] = useState('grid');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

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
    useEffect(() => { setPage(1); }, [debouncedSearch, activeFilter]);

    const filteredProjects = useMemo(() => {
      return PROJECTS.filter((p) => {
        const matchesSearch =
          !debouncedSearch ||
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(debouncedSearch.toLowerCase());

        const matchesFilter =
          activeFilter === 'all' ||
          (activeFilter === 'high' && p.priority === 'high') ||
          (activeFilter === 'medium' && p.priority === 'medium') ||
          (activeFilter === 'low' && p.priority === 'low') ||
          activeFilter === 'archived'; /* no archived in mock data */

        return matchesSearch && matchesFilter;
      });
    }, [debouncedSearch, activeFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PER_PAGE));

    const pagedProjects = useMemo(
      () => filteredProjects.slice((page - 1) * PER_PAGE, page * PER_PAGE),
      [filteredProjects, page]
    );

    const handleSearch = useCallback((v) => setSearch(v), []);
    const handleFilter = useCallback((f) => setActiveFilter(f), []);
    const handleView = useCallback((v) => setView(v), []);
    const handlePage = useCallback((p) => setPage(p), []);

    return (
      <div
        className="min-h-screen relative"
        style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
      >
        {/* Background blobs */}
        {/* <div
          className="page-blob w-[500px] h-[500px]"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,.08), transparent)',
            top: '10%',
            right: '-10%',
            animationDelay: '0s',
          }}
        />
        <div
          className="page-blob w-[400px] h-[400px]"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,.06), transparent)',
            bottom: '20%',
            left: '-8%',
            animationDelay: '3s',
          }}
        /> */}

        <main className="relative z-10 pt-[80px] px-4 md:px-8 lg:px-10 max-w-[1440px] mx-auto pb-16">
          {/* Header */}
          <ProjectsHeader />

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
              />

              <ProjectGrid
                projects={pagedProjects}
                loading={loading}
                view={view}
              />

              {!loading && filteredProjects.length > 0 && (
                <Pagination
                  current={page}
                  total={totalPages}
                  onChange={handlePage}
                />
              )}
            </div>

            {/* Right: Sidebar */}
            <ProjectsSidebar
              total={filteredProjects.length}
              perPage={PER_PAGE}
              currentPage={page}
            />
          </div>
        </main>
      </div>
    );
  }
