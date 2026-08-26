import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Search,
  PhoneCall,
  CalendarDays,
  FileText,
  UserRoundCog,
  Settings,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
    end: true,
  },
  {
    name: "Candidates",
    icon: Users,
    path: "/admin/candidates",
  },
  {
    name: "Job Orders",
    icon: BriefcaseBusiness,
    path: "/admin/jobs",
  },
  {
    name: "Resume Search",
    icon: Search,
    path: "/admin/resume-search",
  },
  {
    name: "AI Calls",
    icon: PhoneCall,
    path: "/admin/ai-calls",
  },
  {
  name: "Call Scripts",
  icon: PhoneCall,
  path: "/admin/call-scripts",
},
  {
    name: "Interviews",
    icon: CalendarDays,
    path: "/admin/interviews",
  },
  {
    name: "Documents",
    icon: FileText,
    path: "/admin/documents",
  },
  {
    name: "Employees",
    icon: UserRoundCog,
    path: "/admin/employees",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

function Sidebar({ mobileOpen = false, setMobileOpen }) {
  return (
    <>
      {/* =========================
          Mobile Overlay
      ========================= */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            fixed inset-0 z-40
            bg-slate-950/60
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =========================
          Sidebar
      ========================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          bg-slate-950
          text-white
          shadow-xl

          transition-transform
          duration-300
          ease-in-out

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
        `}
      >
        {/* =========================
            Logo
        ========================= */}

        <div
          className="
            flex
            h-16
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-800
            px-5
          "
        >
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight">
              WorkPod
            </h1>

            {/* <p className="truncate text-xs text-slate-400">
              Recruitment Platform
            </p> */}
          </div>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =========================
            Navigation
        ========================= */}

        <nav
          className="
            flex-1
            overflow-y-auto
            p-3

            scrollbar-thin
            scrollbar-thumb-slate-700
            scrollbar-track-transparent
          "
        >
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                    group
                    flex
                    min-h-[42px]
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-indigo-600
                          text-white
                          shadow-md
                          shadow-indigo-950/30
                        `
                        : `
                          text-slate-300
                          hover:bg-slate-800
                          hover:text-white
                        `
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.4 : 2}
                        className="
                          shrink-0
                          transition-transform
                          duration-200
                          group-hover:scale-105
                        "
                      />

                      <span className="truncate">{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* =========================
            Bottom Section
        ========================= */}

        {/* <div
          className="
            shrink-0
            border-t
            border-slate-800
            p-3
          "
        >
          <div
            className="
              rounded-lg
              bg-slate-900
              px-3
              py-2.5
            "
          >
            <p className="text-xs font-medium text-slate-300">
              RecruitAI
            </p>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Recruitment Management
            </p>
          </div>
        </div> */}
      </aside>
    </>
  );
}

export default Sidebar;
