
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import SearchBar from "@/components/SearchBar";
import NotificationsPanel from "@/components/NotificationsPanel";
import ProfileSection from "@/components/ProfileSection";
import { toast } from "sonner";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [searchResults, setSearchResults] = useState<any[]>([]);

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
      
      toast({
        description: mockResults.length ? 
          `Found ${mockResults.length} results for "${query}"` : 
          `No results found for "${query}"`
      });
    }, 500);
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="font-semibold text-lg">Financial Dashboard</div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-xl">
            <SearchBar onSearch={handleSearch} />
          </div>
          <NotificationsPanel />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            className="mr-2"
            onClick={() => {
              console.log("Changing theme from", theme, "to", theme === "dark" ? "light" : "dark");
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
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
