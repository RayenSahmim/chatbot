import { Button } from "@/components/ui/button";
import { Bot, Menu } from "lucide-react";
import React from "react";
import { ModeToggle } from "@/components/ModeToggle";

const Header = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean, setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <header className="bg-white dark:bg-gray-800 px-4 py-2 z-10 w-full  dark:border-gray-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 justify-start">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden dark:hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6 dark:text-gray-200" />
          </Button>
          <Bot className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">ChatBot</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;