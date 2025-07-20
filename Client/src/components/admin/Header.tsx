import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";

function AdminHeader({ setOpen }) {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden sm:block bg-yellow-600 text-black hover:bg-yellow-700 transition-colors"
      >
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
