import { Bot } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <header className="bg-white px-4 py-2   z-10  w-full ">
      <div className=" flex   justify-between ">
        <div className="flex items-center gap-2 justify-start">
          <Bot className="w-10 h-10 text-indigo-600" />
          <h1 className="text-xl font-semibold text-gray-900">ChatBot</h1>
        </div>
      
            
          
      </div>
    </header>
  );
};

export default Header;
