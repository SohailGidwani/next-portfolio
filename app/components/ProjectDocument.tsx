"use client"

import { motion } from "framer-motion"
import { Button } from "@/app/components/ui/button"
import { Download, FileText } from "lucide-react"

interface ProjectDocumentProps {
  title: string
  description: string
  url: string
  size: string
  delay?: number
}

export default function ProjectDocument({ 
  title, 
  description, 
  url, 
  size, 
  delay = 0 
}: ProjectDocumentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="mb-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-blue-900 dark:text-blue-400">
        Technical Documentation
      </h2>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 sm:p-6 lg:p-8 border border-blue-200 dark:border-slate-600">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2 break-words">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 mb-4 leading-relaxed">
              {description}
            </p>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-slate-400">
              <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>PDF • {size}</span>
            </div>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Button
              asChild
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base"
            >
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">Download</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
