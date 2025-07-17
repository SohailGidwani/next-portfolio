import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found - Sohail Gidwani',
  description: 'The page you are looking for could not be found. Return to Sohail Gidwani\'s portfolio.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for could not be found. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go to Homepage
          </Link>
          <div className="text-sm text-gray-400">
            <p>Or navigate to:</p>
            <div className="mt-2 space-x-4">
              <Link href="/#about" className="hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/#projects" className="hover:text-blue-600 transition-colors">
                Projects
              </Link>
              <Link href="/#contact" className="hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 