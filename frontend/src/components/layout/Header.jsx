import {
  Search,
  Bell,
  UserCircle,
  Menu,
} from "lucide-react";

function Header({ setMobileOpen }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white lg:left-64">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-5 lg:px-6">

        {/* Mobile Menu */}

        <button
          onClick={() =>
            setMobileOpen(true)
          }
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        {/* Search */}

        <div className="relative hidden flex-1 sm:block sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search candidates, jobs..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Mobile Search */}

        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 sm:hidden">
          <Search size={20} />
        </button>

        {/* Right */}

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Bell size={20} />

            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-2">
            <UserCircle
              size={32}
              className="text-slate-400"
            />

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;