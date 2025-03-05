
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, PieChart, Settings as SettingsIcon, BarChart3 } from "lucide-react";
import { useTheme } from "next-themes";
import SearchBar from "@/components/SearchBar";
import NotificationsPanel from "@/components/NotificationsPanel";
import ProfileSection from "@/components/ProfileSection";
import { toast } from "sonner";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const location = useLocation();

  // Fix dark mode by ensuring component is mounted before rendering theme-dependent elements
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    // In a real app, this would search through your data
    // For now, we'll simulate some results
    console.log("Searching for:", query);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        { id: 1, type: 'expense', title: 'Office Supplies', amount: 120.50 },
        { id: 2, type: 'report', title: 'Q2 Financial Report', date: '2023-06-30' },
        { id: 3, type: 'expense', title: 'Client Dinner', amount: 85.75 }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      
      toast(
        mockResults.length ? 
          `Found ${mockResults.length} results for "${query}"` : 
          `No results found for "${query}"`
      );
    }, 500);
  };

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
          <div className="w-full max-w-xl">
            <SearchBar onSearch={handleSearch} />
          </div>
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
          <ProfileSection />
        </div>
      </div>
      
      {/* Display search results if available */}
      {searchResults.length > 0 && (
        <div className="border-t px-4 py-3 sm:px-6 lg:px-8 bg-muted/30">
          <h3 className="text-sm font-medium mb-2">Search Results</h3>
          <div className="space-y-2">
            {searchResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-2 rounded-md border bg-card">
                <div>
                  <span className="text-sm font-medium">{result.title}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </span>
                </div>
                <div>
                  {result.type === 'expense' && (
                    <span className="text-sm font-medium">
                      ${result.amount.toFixed(2)}
                    </span>
                  )}
                  {result.type === 'report' && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
