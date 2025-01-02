import { Button } from "@/components/ui/button";
import { Bot, Menu } from "lucide-react";
import React from "react";

const Header = ({ isSidebarOpen , setIsSidebarOpen }: { isSidebarOpen: boolean , setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <header className="bg-white px-4 py-2   z-10  w-full ">
      <div className=" flex    ">
        <div className="flex items-center gap-2 justify-start">
          <Button
                  variant="ghost"
                  size="icon"
                  className="   md:hidden"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
          <Bot className="w-10 h-10 text-indigo-600" />
          <h1 className="text-xl font-semibold text-gray-900">ChatBot</h1>
        </div>
      
            
          
      </div>
    </header>
  );
};

export default Header;
