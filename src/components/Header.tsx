
import { Button } from "@/components/ui/button";
import { PieChart, BarChart3, Settings as SettingsIcon } from "lucide-react";
import NotificationsPanel from "@/components/NotificationsPanel";
import ThemeToggle from "@/components/ThemeToggle";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-semibold text-lg flex items-center">
          <PieChart className="h-5 w-5 mr-2" />
          <span>Financial Dashboard</span>
        </Link>
        
        <div className="flex items-center mx-4 space-x-1">
          <Link to="/">
            <Button variant={location.pathname === '/' ? "secondary" : "ghost"} size="sm">
              Dashboard
            </Button>
          </Link>
          <Link to="/forecast">
            <Button variant={location.pathname === '/forecast' ? "secondary" : "ghost"} size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              AI Forecast
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant={location.pathname === '/settings' ? "secondary" : "ghost"} size="sm">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <NotificationsPanel />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
