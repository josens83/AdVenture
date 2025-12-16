export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          {/* Spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          {/* Inner pulse */}
          <div className="absolute inset-4 bg-blue-500/20 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-400 text-lg animate-pulse">로딩 중...</p>
      </div>
    </div>
  );
}
