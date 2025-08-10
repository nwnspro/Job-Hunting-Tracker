import { User, BookText, BarChart3 } from "lucide-react";

interface HeaderProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onAutoFill: () => void;
  onUserLogin: () => void;
  viewMode: "table" | "stats";
  setViewMode: (mode: "table" | "stats") => void;
}

export function Header({
  inputValue,
  setInputValue,
  onAutoFill,
  onUserLogin,
  viewMode,
  setViewMode,
}: HeaderProps) {
  return (
    <div className="relative">
      {/* User Login Icon - Top Right */}
      <div className="absolute top-0 right-2 z-10">
        <button
          onClick={onUserLogin}
          className="w-12 h-12 relative bg-gray-700 rounded-[100px] overflow-hidden flex items-center justify-center hover:bg-gray-700 transition-all duration-200"
        >
          <User className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Centered Title */}
      <div className="text-center mb-8">
        <h1 className="w-[831px] justify-start text-black text-5xl font-extralight font-['Onest'] italic mb-8">
          Hey, What new progress today?
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
      <div className="absolute top-24 right-4 z-10 flex items-center gap-5">
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
