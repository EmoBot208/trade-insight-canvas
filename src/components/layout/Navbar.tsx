
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-primary-foreground" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18"></path>
              <path d="M7 17 l0 -5"></path>
              <path d="M11 17 l0 -11"></path>
              <path d="M15 17 l0 -7"></path>
              <path d="M19 17 l0 -3"></path>
            </svg>
          </div>
          <span className="text-xl font-bold">TraderDash</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/upload" className="text-sm px-3 py-2 rounded-md hover:bg-secondary transition">
            Upload CSV
          </Link>
          <Link to="/history" className="text-sm px-3 py-2 rounded-md hover:bg-secondary transition">
            Upload History
          </Link>
        </nav>
      </div>
    </header>
  );
}
