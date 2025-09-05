export default function StudentDashboardLoading() {
  return (
    <div className="min-h-screen" style={{
      background: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      {/* Header Skeleton */}
      <div className="border-b" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--border)'
      }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />
              <div>
                <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-20 bg-gray-300 rounded animate-pulse" />
              <div className="h-10 w-32 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs Skeleton */}
        <div className="flex space-x-1 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-300 rounded animate-pulse" />
          ))}
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-300 rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <div className="h-64 bg-gray-300 rounded-lg animate-pulse" />
          <div className="h-48 bg-gray-300 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
