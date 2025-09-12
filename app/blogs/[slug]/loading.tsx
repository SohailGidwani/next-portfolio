export default function LoadingBlog() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200 transition-colors duration-300">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-950 py-20">
        <div className="container mx-auto px-4">
          <div className="h-6 w-40 mb-6 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-10 md:h-16 w-3/4 md:w-2/3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
          <div className="h-6 w-1/2 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-gray-200 dark:bg-slate-800 animate-pulse" />
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-6 w-full bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-6 w-11/12 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-6 w-10/12 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-6 w-9/12 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-6 w-8/12 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

