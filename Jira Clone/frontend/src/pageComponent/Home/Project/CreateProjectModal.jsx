import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  FolderPlus,
  FileText,
  Sparkles,
  Search,
  ChevronDown,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setMember } from "@/store/slice/memberSlice";

/* ─── Static data ─── */
const COLORS = [
  { name: "Purple", value: "#7c3aed" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Red", value: "#ef4444" },
  { name: "Black", value: "#1f2937" },
  { name: "Teal", value: "#14b8a6" },
];

/* ═══════════════════════════════════════════════
   ModalHeader
═══════════════════════════════════════════════ */
const ModalHeader = memo(function ModalHeader({ onClose }) {
  return (
    <div className="flex items-start justify-between gap-4 px-8 pt-8 pb-6">
      {/* Deco gradient */}
      <div
        className="modal-header-deco"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(139,92,246,.08), transparent 70%)",
        }}
      />

      {/* Left: icon + title */}
      <div className="flex items-start gap-4 relative z-20">
        <div className="modal-icon">
          <FolderPlus size={32} className="text-white" strokeWidth={2.2} />
          {/* Sparkle decoration */}
          <Sparkles
            size={14}
            className="absolute -top-1.5 -right-1.5 text-yellow-300"
            fill="#fde047"
            style={{ animation: "sparkleFloat 3s ease-in-out infinite" }}
          />
        </div>
        <div className="pt-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Create New Project
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Let's get your project set up and ready to go.
          </p>
        </div>
      </div>

      {/* Right: close */}
      <button
        className="modal-close relative z-20"
        onClick={onClose}
        aria-label="Close modal"
      >
        <X size={18} className="text-gray-500" />
      </button>
    </div>
  );
});

/* ═══════════════════════════════════════════════
   ProjectNameInput
═══════════════════════════════════════════════ */
const ProjectNameInput = memo(function ProjectNameInput({
  value,
  onChange,
  error,
}) {
  const count = value.length;
  return (
    <div>
      <label className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">
          Project Name <span className="text-red-400">*</span>
        </span>
        <span
          className={`text-xs tabular-nums ${count > 55 ? "text-orange-500" : "text-gray-400"}`}
        >
          {count} / 60
        </span>
      </label>
      <div
        className={`modal-input-wrap flex items-center gap-3 px-4 h-14 ${error ? "error-state" : ""}`}
      >
        <FileText size={18} className="text-gray-400 shrink-0" />
        <input
          className="modal-input h-full"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 60))}
          placeholder="Enter project name..."
          aria-label="Project name"
        />
      </div>
      {error && (
        <p
          className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"
          style={{ animation: "slideUp .2s ease both" }}
        >
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
});

/* ═══════════════════════════════════════════════
   DescriptionInput
═══════════════════════════════════════════════ */
const DescriptionInput = memo(function DescriptionInput({ value, onChange }) {
  const taRef = useRef(null);
  const count = value.length;

  const autoResize = useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.max(140, ta.scrollHeight)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  return (
    <div>
      <label className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Description</span>
        <span
          className={`text-xs tabular-nums ${count > 270 ? "text-orange-500" : "text-gray-400"}`}
        >
          {count} / 300
        </span>
      </label>
      <div className="modal-input-wrap flex gap-3 px-4 py-3.5">
        <FileText size={18} className="text-gray-400 shrink-0 mt-0.5" />
        <textarea
          ref={taRef}
          className="modal-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 300))}
          onInput={autoResize}
          placeholder="Add a brief description of your project..."
          aria-label="Project description"
        />
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════
   ColorPicker
═══════════════════════════════════════════════ */
const ColorPicker = memo(function ColorPicker({ selected, onSelect }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Project Color
      </label>
      <div className="flex flex-wrap gap-3">
        {COLORS.map((c) => {
          const isSel = selected.toLowerCase() === c.value;
          return (
            <button
              key={c.value}
              type="button"
              className={`color-chip ${isSel ? "selected" : ""}`}
              style={{
                background: c.value,
                "--chip-color": c.value,
                "--pulse-color": `${c.value}80`,
              }}
              onClick={() => onSelect(c.value)}
              aria-label={`Color ${c.name}`}
              aria-pressed={isSel}
            >
              {isSel && (
                <Check
                  size={20}
                  className="text-white relative z-10"
                  strokeWidth={3}
                  style={{ animation: "drawCheck .3s ease both" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════
   MemberMultiSelect (dropdown + chips)
═══════════════════════════════════════════════ */
function HighlightedText({ text, query }) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="highlight-match">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

const MemberMultiSelect = memo(function MemberMultiSelect({
  selected,
  onToggle,
  onClearAll,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const teamMembers = useSelector((state) => state.items);

  const filtered = useMemo(
    () =>
      teamMembers?.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.email.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, teamMembers],
  );

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIdx(filtered?.length > 0 ? 0 : -1);
  }, [filtered?.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", handler, true);
    return () => document.removeEventListener("pointerdown", handler, true);
  }, [open]);

  // Focus search when opened
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((p) => Math.min(p + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((p) => Math.max(p - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIdx]) onToggle(filtered[activeIdx]);
      } else if (e.key === "Backspace" && query === "" && selected.length > 0) {
        onToggle(selected[selected.length - 1]);
      }
    },
    [open, filtered, activeIdx, query, selected, onToggle],
  );

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Team Members
      </label>

      {/* Input trigger */}
      <button
        type="button"
        className="modal-input-wrap w-full flex items-center gap-3 px-4 h-14 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <Search size={18} className="text-gray-400 shrink-0" />
        <span
          className={`flex-1 text-sm ${selected.length > 0 ? "text-gray-700" : "text-gray-400"}`}
        >
          {selected.length > 0
            ? `${selected.length} member${selected.length > 1 ? "s" : ""} selected`
            : "Search and select team members"}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="member-dropdown">
          {/* Search field */}
          <div className="flex items-center gap-2.5 px-4 h-12 border-b border-gray-100">
            <Search size={16} className="text-gray-400" />
            <input
              ref={searchRef}
              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
              placeholder="Search members..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Member list */}
          <div
            className="max-h-64 overflow-y-auto py-1.5"
            style={{ scrollbarWidth: "thin" }}
          >
            {filtered?.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                No members found
              </div>
            ) : (
              filtered?.map((m, i) => {
                const isSel = selected.some((s) => s.id === m.id);
                const isActive = i === activeIdx;
                return (
                  <div
                    key={m.id}
                    className={`member-row ${isSel ? "selected" : ""} ${isActive ? "bg-violet-50" : ""}`}
                    onClick={() => onToggle(m)}
                    onMouseEnter={() => setActiveIdx(i)}
                  >
                    <img
                      src={m.avatar}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        <HighlightedText text={m.name} query={query} />
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {m.email}
                      </p>
                    </div>
                    <div
                      className={`member-checkbox ${isSel ? "checked" : ""}`}
                    >
                      {isSel && (
                        <svg
                          className="check-svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {selected.map((m) => (
              <div key={m.id} className="member-chip">
                <img
                  src={m.avatar}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-violet-700">
                  {m.name}
                </span>
                <button
                  type="button"
                  className="chip-remove"
                  onClick={() => onToggle(m)}
                  aria-label={`Remove ${m.name}`}
                >
                  <X size={12} className="text-violet-500" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors shrink-0"
            onClick={onClearAll}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
});

/* ═══════════════════════════════════════════════
   FooterButtons
═══════════════════════════════════════════════ */
const FooterButtons = memo(function FooterButtons({
  onCancel,
  onCreate,
  loading,
  disabled,
}) {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    if (disabled || loading) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const d = Math.max(rect.width, rect.height);
    ripple.className = "btn-ripple";
    ripple.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onCreate();
  };

  return (
    <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-gray-100">
      <button type="button" className="cancel-btn" onClick={onCancel}>
        Cancel
      </button>
      <button
        ref={btnRef}
        type="button"
        className="create-btn"
        onClick={handleClick}
        disabled={disabled || loading}
      >
        <span className="btn-shine" />
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Create Project
          </>
        )}
      </button>
    </div>
  );
});

/* ═══════════════════════════════════════════════
   CreateProjectModal (main)
═══════════════════════════════════════════════ */
export default function CreateProjectModal({
  open,
  onClose,
  onCreate,
  name = "",
  description = "",
  color = "#7c3aed",
  members = [],
  setName = () => {},
  setDescription = () => {},
  setColor = () => {},
  setMembers = () => {},
  editingProjectId = null,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const triggerRef = useRef(null);
  const dispatch = useDispatch();
  const projectMode = useSelector((state) => state.projects.createProjectMode); // "create" or "edit"
  useEffect(() => {
    if (!open) return;

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
  }, [dispatch, open]);

  // Focus trap + ESC
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Return focus to trigger on close
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setName("");
      setDescription("");
      setColor("#7c3aed");
      setMembers([]);
      setError("");
      setLoading(false);
      onClose();
      triggerRef.current?.focus();
    }, 240);
  }, [onClose]);

  const toggleMember = useCallback((m) => {
    setMembers((prev) =>
      prev.some((s) => s.id === m.id)
        ? prev.filter((s) => s.id !== m.id)
        : [...prev, m],
    );
  }, []);

  const clearAll = useCallback(() => setMembers([]), []);

  const handleCreate = useCallback(async () => {
    if (name.trim().length < 3) {
      setError("Project name must be at least 3 characters");
      return;
    }
    setError("");
    setLoading(true);

    if (projectMode === "edit") {
      try {
        const res = await api
          .post(`/project/updateProject/${editingProjectId}`, {
            name,
            description,
            color,
            memberIds: members.map((member) => member.id),
          })
          .then((res) => {
            onCreate?.(res.data);
            setName("");
            setDescription("");
            setColor("#7c3aed");
            setMembers([]);
            setLoading(false);
            handleClose();
          });
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        const res = await api
          .post("/project/createProject", {
            name,
            description,
            color,
            memberIds: members.map((member) => member.id),
          })
          .then((res) => {
            onCreate?.(res.data);
            // reset form + close modal
            setName("");
            setDescription("");
            setColor("#7c3aed");
            setMembers([]);
          })
          .catch((err) => {
            throw new Error("Failed to create project", err);
          });
      } catch (err) {
        setError(err.message);
      } finally {
        handleClose();
      }
    }

    // setTimeout(() => {
    //   setLoading(false);
    //   onCreate?.({
    //     name: name.trim(),
    //     description: description.trim(),
    //     color,
    //     members,
    //   });
    //   handleClose();
    // }, 1200);
  }, [name, description, color, members, onCreate, handleClose]);

  if (!open) return null;

  return (
    <div
      className={`modal-overlay z-50 ${closing ? "closing" : ""}`}
      onMouseDown={handleClose}
    >
      <div
        className={`modal-panel z-50 ${closing ? "closing" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
      >
        <ModalHeader onClose={handleClose} />

        <div className="px-8 pb-2 flex flex-col gap-6">
          <ProjectNameInput value={name} onChange={setName} error={error} />
          <DescriptionInput value={description} onChange={setDescription} />
          <ColorPicker selected={color} onSelect={setColor} />
          <MemberMultiSelect
            selected={members}
            onToggle={toggleMember}
            onClearAll={clearAll}
          />
        </div>

        <FooterButtons
          onCancel={handleClose}
          onCreate={handleCreate}
          loading={loading}
          disabled={name.trim().length < 3}
        />
      </div>
    </div>
  );
}
