import { useState } from 'react';
import {
  Search, Moon, Sun, Bell, ChevronDown,
  Home, FolderKanban, CheckSquare, Calendar, Users, BarChart2,
  Zap, X, Command,
} from 'lucide-react';

const navLinks = [
  { label: 'Home', icon: Home, href: '#' },
  { label: 'Projects', icon: FolderKanban, href: '#' },
  { label: 'Tasks', icon: CheckSquare, href: '#' },
  { label: 'Calendar', icon: Calendar, href: '#' },
  { label: 'Team', icon: Users, href: '#' },
  { label: 'Reports', icon: BarChart2, href: '#' },
];

export default function Navbar({ dark, onToggleDark }) {
  const [active, setActive] = useState('Home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  return (
    <header className="navbar fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center px-4 md:px-8 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
          <Zap size={16} className="text-white" fill="white" />
        </div>
        <span className="font-bold text-base tracking-tight" style={{ color: 'var(--color-text)' }}>
          TaskFlow
        </span>
      </div>

      {/* Nav links — hidden on mobile */}
      <nav className="hidden lg:flex items-center gap-1 ml-4">
        {navLinks.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`nav-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
              ${active === label
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/8'
              }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className={`search-bar flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 h-9 transition-all duration-300 ${searchOpen ? 'w-56' : 'w-44'}`}>
        <Search size={14} className="text-gray-400 shrink-0" />
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setSearchOpen(false)}
          placeholder="Search projects, tasks..."
          className="flex-1 text-xs bg-transparent outline-none placeholder-gray-400 text-[var(--color-text)]"
        />
        {searchVal ? (
          <button onClick={() => setSearchVal('')}>
            <X size={12} className="text-gray-400" />
          </button>
        ) : (
          <span className="hidden sm:flex items-center gap-0.5 text-[10px] text-gray-400 border border-gray-200 dark:border-gray-600 rounded px-1">
            <Command size={9} /> K
          </span>
        )}
      </div>

      {/* Theme toggle */}
      <button
        onClick={onToggleDark}
        className="theme-toggle w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 text-gray-500 dark:text-gray-400 transition-colors"
        aria-label="Toggle theme"
      >
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      {/* Notifications */}
      <button className="bell-btn relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 text-gray-500 dark:text-gray-400 transition-colors">
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
          8
        </span>
      </button>

      {/* Profile */}
      <button className="avatar flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 transition-colors">
        <img
          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"
          alt="John Doe"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200 dark:ring-indigo-800"
        />
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold leading-none" style={{ color: 'var(--color-text)' }}>John Doe</p>
          <p className="text-[10px] leading-none mt-0.5" style={{ color: 'var(--color-muted)' }}>Product Designer</p>
        </div>
        <ChevronDown size={13} className="text-gray-400 hidden md:block" />
      </button>
    </header>
  );
}
