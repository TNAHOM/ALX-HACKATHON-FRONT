import { X, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-800 p-2"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          <span className="ml-2 text-sm font-medium">Menu</span>
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-[#f8a4a9] flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <div className="ml-2">
              <h1 className="font-bold text-gray-800">KURIFTU</h1>
              <p className="text-sm text-gray-600">RESORTS</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-300">
            Sign Up
          </Button>
          <Button variant="outline" className="border-gray-300">
            Reserve
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
