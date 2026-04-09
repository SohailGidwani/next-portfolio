"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#f5efe7] text-[#1e293b]">
        <div className="max-w-md rounded-3xl border border-[#cdd5e0] bg-white/80 p-8 text-center shadow-xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#6b7280]">Something went wrong</p>
          <h1 className="mt-4 text-3xl font-bold">Unexpected Error</h1>
          <p className="mt-3 text-sm text-[#6b7280]">
            An error occurred in the application. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && error.message && (
            <pre className="mt-4 overflow-auto rounded-xl bg-[#f3f4f6] p-3 text-left text-xs text-red-600">
              {error.message}
            </pre>
          )}
          <button
            onClick={reset}
            className="mt-6 rounded-full bg-[#3d8b7a] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
