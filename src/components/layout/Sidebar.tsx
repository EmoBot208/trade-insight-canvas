
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Upload,
  History,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-14 md:w-60 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="flex-1 py-6">
        <nav className="px-2 space-y-2">
          <NavLink to="/dashboard" className={({ isActive }) => 
            `flex items-center ${isActive ? 'text-primary' : 'text-sidebar-foreground'} p-2 rounded-md hover:bg-secondary transition group`
          }>
            <LayoutDashboard className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="hidden md:inline">Dashboard</span>
          </NavLink>
          
          <NavLink to="/upload" className={({ isActive }) =>
            `flex items-center ${isActive ? 'text-primary' : 'text-sidebar-foreground'} p-2 rounded-md hover:bg-secondary transition group`
          }>
            <Upload className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="hidden md:inline">Upload</span>
          </NavLink>
          
          <NavLink to="/history" className={({ isActive }) =>
            `flex items-center ${isActive ? 'text-primary' : 'text-sidebar-foreground'} p-2 rounded-md hover:bg-secondary transition group`
          }>
            <History className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="hidden md:inline">History</span>
          </NavLink>
        </nav>
      </div>
      
      <div className="p-4">
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Settings</span>
        </Button>
      </div>
    </aside>
  );
}
