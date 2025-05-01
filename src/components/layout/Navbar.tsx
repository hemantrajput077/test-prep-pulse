
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Tests", path: "/tests" },
    { name: "Practice", path: "/practice" },
  ];

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white font-bold">
            TP
          </div>
          <span className="font-bold text-xl">TestPrepPulse</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative py-2",
                isActive(link.path) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-600"></span>
              )}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex gap-1">
            <User className="w-4 h-4" />
            Sign In
          </Button>
          <Button size="sm" className="hidden md:flex bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700">
            Get Started
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
