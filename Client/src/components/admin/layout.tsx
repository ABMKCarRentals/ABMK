import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./Header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gray-900">
      {/* Admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex flex-1 flex-col">
        {/* Admin header */}
        <AdminHeader setOpen={setOpenSidebar} />

        {/* Main content area */}
        <main className="flex-1 flex flex-col bg-gray-800 p-4 md:p-6 overflow-auto">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
