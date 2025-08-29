import { User, BookText, BarChart3, LogOut } from "lucide-react";
import { signInWithGoogle, signOut, getSession } from "../lib/auth.client";
import { useState, useEffect } from "react";

interface HeaderProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onAutoFill: () => void;
  viewMode: "table" | "stats";
  setViewMode: (mode: "table" | "stats") => void;
}

export function Header({
  inputValue,
  setInputValue,
  onAutoFill,
  viewMode,
  setViewMode,
}: HeaderProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await getSession();
      console.log("Session data:", session); // 调试信息
      console.log("User data:", session?.data?.user); // 调试信息
      setUser(session?.data?.user || null);
    } catch (error) {
      console.error("Failed to get session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Refresh session after login
      setTimeout(checkSession, 1000);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative">
      {/* User Login/Profile - Top Right */}
      <div className="absolute top-0 right-2 z-20">
        {loading ? (
          <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
        ) : user ? (
          <div className="relative group">
            <button className="w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:border-gray-300 transition-all duration-200">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || "User"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </button>
            {/* Dropdown Menu */}
            <div className="absolute top-14 right-0 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30">
              <div className="p-3 border-b">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="w-12 h-12 relative bg-gray-700 rounded-[100px] overflow-hidden flex items-center justify-center hover:bg-gray-600 transition-all duration-200"
          >
            <User className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Centered Title */}
      <div className="text-center mb-8">
        <h1 className="w-[831px] justify-start text-black text-5xl font-extralight font-['Onest'] italic mb-8">
          Hey, what's new progress today?
        </h1>
      </div>

      {/* Input and Auto Fill Section */}
      <div className="flex justify-start mb-8">
        <div className="w-[923px] h-12 px-2 py-3 bg-white/60 rounded-full outline outline-1 outline-offset-[-0.50px] outline-gray-200 inline-flex justify-start items-center gap-0">
          <input
            type="text"
            placeholder="    Paste URL here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 h-full bg-transparent text-black placeholder-gray-500 focus:outline-none border-none"
          />
          <button
            onClick={onAutoFill}
            className="w-26 h-9 px-5 py-4 bg-gray-700 rounded-[109px] inline-flex justify-center items-center gap-1 hover:bg-gray-900 transition-all duration-200"
          >
            <div className="justify-start text-white text-base font-normal font-['Onest'] leading-snug">
              Auto Fill
            </div>
          </button>
        </div>
      </div>

      {/* View Toggle Buttons - Right side below avatar */}
      <div className="absolute top-24 right-4 z-0 flex items-center gap-5">
        {/* Table Icon */}
        <button
          onClick={() => setViewMode("table")}
          className={`w-7 h-7 relative overflow-hidden flex items-center justify-center ${
            viewMode === "table" ? "bg-gray-200" : "bg-transparent"
          } rounded-md hover:bg-gray-100 transition-all duration-200`}
        >
          <BookText className="w-5 h-5 text-black" />
        </button>

        {/* Stats Icon */}
        <button
          onClick={() => setViewMode("stats")}
          className={`w-7 h-7 relative overflow-hidden flex items-center justify-center ${
            viewMode === "stats" ? "bg-gray-200" : "bg-transparent"
          } rounded-md hover:bg-gray-100 transition-all duration-200`}
        >
          <BarChart3 className="w-5 h-5 text-black" />
        </button>
      </div>
    </div>
  );
}
