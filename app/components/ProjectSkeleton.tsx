"use client"

import { motion } from "framer-motion"

export default function ProjectSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      {/* Header Skeleton */}
      <div className="border-b border-border bg-card/60 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-16 bg-muted rounded-2xl mb-6 max-w-2xl mx-auto"
            />
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="h-6 bg-muted rounded-xl mb-4 max-w-3xl mx-auto"
            />
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="h-6 bg-muted rounded-xl max-w-2xl mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Image Skeleton */}
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              className="h-96 bg-muted rounded-3xl mb-12"
            />

            {/* Title and Tags Skeleton */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                className="h-12 bg-muted rounded-xl mb-6 max-w-3xl"
              />
              <div className="flex flex-wrap gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 + i * 0.1 }}
                    className="h-8 w-20 bg-muted rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="space-y-4 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 + i * 0.1 }}
                  className={`h-4 bg-muted rounded-lg ${
                    i === 4 ? "max-w-2xl" : "w-full"
                  }`}
                />
              ))}
            </div>

            {/* Features Section Skeleton */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1.5 }}
                className="h-8 bg-muted rounded-xl mb-6 max-w-xs"
              />
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1.6 + i * 0.1 }}
                    className="p-6 bg-card/80 rounded-2xl border border-border"
                  >
                    <div className="h-6 bg-muted rounded-lg mb-3" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-4">
              <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 2 }}
                className="h-12 w-32 bg-muted rounded-full"
              />
              <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 2.2 }}
                className="h-12 w-32 bg-muted rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 