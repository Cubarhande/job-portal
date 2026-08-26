import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="lg:pl-64">
        <Header setMobileOpen={setMobileOpen} />

        <main className="p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-20">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
