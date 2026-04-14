import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Search, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "admin@lugadmin.com";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-2 sm:gap-4 border-b bg-card px-2 sm:px-4 shrink-0">
            {/* Mobile menu trigger - only visible on mobile */}
            <SidebarTrigger className="shrink-0 md:hidden" />

            {/* Search */}
            <div className="flex-1 flex items-center gap-2 max-w-md">
              <Search className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Input
                placeholder="Search..."
                className="h-8 border-0 bg-secondary focus-visible:ring-1 text-sm"
              />
            </div>

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
                  <Bell className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <p className="text-sm text-muted-foreground p-4 text-center">No notifications</p>
                </div>
              </PopoverContent>
            </Popover>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus:outline-none shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground overflow-hidden">
                    A
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="h-4 w-4 mr-2" />Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 overflow-auto p-3 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
