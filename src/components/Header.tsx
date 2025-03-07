
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, PieChart, Settings as SettingsIcon, BarChart3 } from "lucide-react";
import { useTheme } from "next-themes";
import NotificationsPanel from "@/components/NotificationsPanel";
import { toast } from "sonner";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  // Fix dark mode by ensuring component is mounted before rendering theme-dependent elements
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Changing theme from", theme, "to", newTheme);
    setTheme(newTheme);
    toast(`Theme changed to ${newTheme} mode`, {
      icon: newTheme === "dark" ? "🌙" : "☀️"
    });
  };

  return (
    <header className="border-b">
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
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              className="mr-2"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
