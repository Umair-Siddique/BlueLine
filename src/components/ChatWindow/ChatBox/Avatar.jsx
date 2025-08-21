import { MessageCircle } from "lucide-react";
import React from "react";

const Avatar = ({ from }) => {
  if (from === "user") {
    return (
      <div 
        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0"
        style={{ backgroundColor: '#5BC0EB' }}
      >
        ME
      </div>
    );
  } else {
    return (
      <div 
        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
        style={{ 
          background: 'linear-gradient(135deg, #00C2A8 0%, #0074A2 100%)'
        }}
      >
        <MessageCircle size={16} />
      </div>
    );
  }
};

export default Avatar;
