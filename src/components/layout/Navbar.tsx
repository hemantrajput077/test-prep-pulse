
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl gradient-text">PrepMaster</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</Link>
            <Link to="/tests" className="transition-colors hover:text-foreground/80 text-foreground/60">Tests</Link>
            <Link to="/practice" className="transition-colors hover:text-foreground/80 text-foreground/60">Practice</Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Link to="/">
            <Button className="bg-brand-500 hover:bg-brand-600">
              Home
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
