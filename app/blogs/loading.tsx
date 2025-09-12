export default function LoadingBlogsList() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200 transition-colors duration-300 overflow-x-hidden">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-950 py-20">
        <div className="container mx-auto px-4">
          <div className="h-6 w-40 mb-6 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-10 md:h-16 w-3/4 md:w-2/3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-600 bg-white dark:bg-slate-800">
              <div className="h-48 bg-gray-200 dark:bg-slate-700 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

