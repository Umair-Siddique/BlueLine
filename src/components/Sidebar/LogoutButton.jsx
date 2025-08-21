import { LogOut } from "lucide-react";

const LogoutButton = ({ onLogout }) => {
  return (
    <div className="p-4 border-t" style={{ borderTopColor: "#1F1F1F" }}>
      <button
        onClick={onLogout}
        className={`logout-btn w-full flex items-center justify-center px-4 py-2 rounded-md bg-red-600 hover:bg-red-700`}
      >
        <LogOut size={16} className="mr-2" style={{ color: "#fff !important" }} />
        <span style={{ color: "#ffffff !important" }}>Logout</span>
      </button>
    </div>
  );
};

export default LogoutButton;