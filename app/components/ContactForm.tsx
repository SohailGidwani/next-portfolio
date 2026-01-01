"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Loader2, CheckCircle2, Clock } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import toast from "react-hot-toast"

// Rate limiting configuration
const RATE_LIMIT_KEY = "contact_form_submissions"
const RATE_LIMIT_WINDOW = 5 * 60 * 1000 // 5 minutes in milliseconds
const MAX_SUBMISSIONS = 3 // Maximum submissions per window

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [timeUntilReset, setTimeUntilReset] = useState(0)

  // Check rate limit on mount and set up timer
  useEffect(() => {
    checkRateLimit()
    const interval = setInterval(() => {
      checkRateLimit()
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  const checkRateLimit = () => {
    if (typeof window === 'undefined') return

    try {
      const storedData = localStorage.getItem(RATE_LIMIT_KEY)
      if (!storedData) {
        setIsRateLimited(false)
        setTimeUntilReset(0)
        return
      }

      const submissions: number[] = JSON.parse(storedData)
      const now = Date.now()

      // Filter out old submissions outside the time window
      const recentSubmissions = submissions.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
      )

      // Update localStorage with filtered submissions
      if (recentSubmissions.length !== submissions.length) {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions))
      }

      // Check if rate limited
      if (recentSubmissions.length >= MAX_SUBMISSIONS) {
        const oldestSubmission = Math.min(...recentSubmissions)
        const resetTime = oldestSubmission + RATE_LIMIT_WINDOW
        const timeLeft = Math.max(0, resetTime - now)

        setIsRateLimited(timeLeft > 0)
        setTimeUntilReset(Math.ceil(timeLeft / 1000))
      } else {
        setIsRateLimited(false)
        setTimeUntilReset(0)
      }
    } catch (error) {
      console.error('Rate limit check error:', error)
      setIsRateLimited(false)
    }
  }

  const recordSubmission = () => {
    if (typeof window === 'undefined') return

    try {
      const storedData = localStorage.getItem(RATE_LIMIT_KEY)
      const submissions: number[] = storedData ? JSON.parse(storedData) : []
      const now = Date.now()

      // Add current submission
      submissions.push(now)

      // Keep only recent submissions
      const recentSubmissions = submissions.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
      )

      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions))
    } catch (error) {
      console.error('Error recording submission:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    triggerHaptic()

    // Check rate limit
    if (isRateLimited) {
      toast.error(`Please wait ${formatTime(timeUntilReset)} before sending another message`)
      return
    }

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      // Format message with subject if provided
      const emailSubject = formData.subject || `Portfolio Contact from ${formData.name}`
      const emailMessage = formData.subject
        ? `Subject: ${formData.subject}\n\n${formData.message}`
        : formData.message

      // Call Web3Forms directly from client side
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          access_key: "5d372928-63ad-4c81-9874-9aa9b38e79df",
          name: formData.name,
          email: formData.email,
          subject: emailSubject,
          message: emailMessage,
          from_name: formData.name,
          replyto: formData.email,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send message")
      }

      // Success - record submission for rate limiting
      recordSubmission()
      checkRateLimit()

      setIsSuccess(true)
      toast.success("Message sent successfully! I'll get back to you soon.")

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" })
        setIsSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-border bg-card/80 p-6 shadow-[0_24px_60px_-50px_rgba(0,0,0,0.4)] sm:p-8"
    >
      <div className="space-y-2">
        <h3 className="font-display text-xl text-foreground">Send me a message</h3>
        <p className="text-sm text-muted-foreground">
          I'll get back to you within 24 hours
        </p>
      </div>

      <div className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
            className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        {/* Subject Field */}
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium text-foreground">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What's this about?"
            className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-foreground">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Tell me more about your project, question, or opportunity..."
            className="w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>
      </div>

      {/* Rate Limit Warning */}
      {isRateLimited && (
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Clock className="h-4 w-4" />
            <p className="font-medium">Rate limit reached</p>
          </div>
          <p className="mt-1 text-xs text-orange-600/80 dark:text-orange-400/80">
            Please wait {formatTime(timeUntilReset)} before sending another message. This helps prevent spam.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || isSuccess || isRateLimited}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRateLimited ? (
          <>
            <Clock className="h-4 w-4" />
            Wait {formatTime(timeUntilReset)}
          </>
        ) : isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Sent!
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        By submitting this form, you agree to be contacted via email.
      </p>
    </motion.form>
  )
}
