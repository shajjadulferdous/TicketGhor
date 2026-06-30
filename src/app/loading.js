export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F4F7F8] font-sans flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center max-w-sm w-full text-center">
        
        {/* Premium Dual-Ring Spinner */}
        <div className="relative w-16 h-16 mb-6">
          {/* Outer Track Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          {/* Inner Active Spinning Accent Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#35858E] border-r-[#35858E]/30 animate-spin" />
        </div>

        {/* Loading Text Hierarchy */}
        <h3 className="text-base font-bold text-gray-800 tracking-tight mb-1 animate-pulse">
          Preparing Your Journey
        </h3>
        <p className="text-xs font-medium text-gray-400 max-w-[240px]">
          Securing encrypted route channels and updating data terminals...
        </p>

        {/* Subtle Bottom Progress Track Decorator */}
        <div className="w-32 h-1 bg-gray-200 rounded-full mt-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#35858E]/40 to-[#35858E] w-12 rounded-full animate-[loading-bar_1.5s_infinite_ease-in-out]" />
        </div>

      </div>
    </div>
  );
}