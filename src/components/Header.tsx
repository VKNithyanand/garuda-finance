
import { BellIcon, MenuIcon, SearchIcon, UserCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border bg-white/80 backdrop-blur-md z-10 sticky top-0">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon size={20} />
        </Button>
        <h1 className="text-xl font-medium hidden md:block">SmartExpense</h1>
      </div>
      
      <div className={`absolute left-0 right-0 mx-auto transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-[40%] opacity-100' : 'w-0 opacity-0'}`}>
        {isSearchOpen && (
          <div className="relative w-full">
            <Input
              className="w-full pl-10 pr-2 py-2 bg-muted border-0 rounded-full focus-visible:ring-primary"
              placeholder="Search expenses, vendors..."
              autoFocus
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="text-muted-foreground hover:text-foreground"
        >
          <SearchIcon size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <BellIcon size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <UserCircleIcon size={20} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
