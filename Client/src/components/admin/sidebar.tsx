import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Car,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "cars",
    label: "Cars",
    path: "/admin/cars",
    icon: <Car className="w-5 h-5" />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-gray-800 ${
              isActive
                ? "bg-yellow-600 text-black hover:bg-yellow-700"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {menuItem.icon}
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-64 bg-gray-900 border-gray-700 text-white"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-gray-700 pb-4">
              <SheetTitle className="flex items-center gap-3 mt-2 mb-2 text-white">
                <ChartNoAxesCombined size={32} className="text-yellow-600" />
                <h1 className="text-xl font-bold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-gray-700 bg-gray-900 p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-3 mb-8 hover:opacity-80 transition-opacity"
        >
          <ChartNoAxesCombined size={32} className="text-yellow-600" />
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        <MenuItems />

        {/* Footer section */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <BadgeCheck className="w-4 h-4 text-yellow-600" />
            <span>Admin Dashboard</span>
          </div>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
