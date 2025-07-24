"use client"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-800 to-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto mb-6"></div>
        <p className="text-white text-lg font-medium">Loading 3D Gallery...</p>
        <p className="text-gray-400 text-sm mt-2">Preparing your immersive art experience</p>
      </div>
    </div>
  )
}
