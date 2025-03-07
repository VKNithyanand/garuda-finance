
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PieChart, BarChart3, Settings as SettingsIcon, Zap } from "lucide-react";
import NotificationsPanel from "@/components/NotificationsPanel";
import ThemeToggle from "@/components/ThemeToggle";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm shadow-sm">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-semibold text-lg flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-2">
            <PieChart className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-indigo-500 text-transparent bg-clip-text font-bold">
            Financial Dashboard
          </span>
        </Link>
        
        <div className="flex items-center mx-4 space-x-1">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? "secondary" : "ghost"} 
              size="sm"
              className="font-medium transition-all hover:bg-primary/10 hover:text-primary"
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/forecast">
            <Button 
              variant={location.pathname === '/forecast' ? "secondary" : "ghost"} 
              size="sm"
              className="font-medium transition-all hover:bg-primary/10 hover:text-primary"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              AI Forecast
            </Button>
          </Link>
          <Link to="/settings">
            <Button 
              variant={location.pathname === '/settings' ? "secondary" : "ghost"} 
              size="sm"
              className="font-medium transition-all hover:bg-primary/10 hover:text-primary"
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="bg-secondary/30 px-3 py-1.5 rounded-full text-xs font-medium text-primary flex items-center">
            <Zap className="h-3.5 w-3.5 mr-1 text-yellow-500" />
            AI Powered
          </div>
          <NotificationsPanel />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
