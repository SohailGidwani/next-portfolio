import { NextRequest, NextResponse } from 'next/server'

// ============================================================================
// EMAIL SERVICE OPTIONS - Choose one:
// ============================================================================
//
// OPTION 1: RESEND (Recommended - Best for Next.js)
// - Free tier: 3,000 emails/month, 100 emails/day
// - Setup: npm install resend
// - Get API key: https://resend.com
// - Code example below
//
// OPTION 2: WEB3FORMS (Easiest - No backend needed)
// - Completely free
// - No signup required for basic use
// - Get access key: https://web3forms.com
// - Just change the endpoint in the frontend
//
// OPTION 3: SENDGRID
// - Free tier: 100 emails/day
// - Setup: npm install @sendgrid/mail
// - Get API key: https://sendgrid.com
//
// OPTION 4: NODEMAILER + GMAIL
// - Free with your Gmail account
// - Setup: npm install nodemailer
// - Requires app password from Google
//
// ============================================================================

// Rate limiting map (in-memory, resets on server restart)
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const requests = rateLimitMap.get(ip) || []

  // Remove requests outside the time window
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW)

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Length validation
    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    // ============================================================================
    // OPTION 1: RESEND IMPLEMENTATION
    // ============================================================================
    // Uncomment this section after installing resend and setting RESEND_API_KEY
    /*
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Use your verified domain
      to: 'sohailgidwani15@gmail.com',
      replyTo: email,
      subject: subject || `Portfolio Contact from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
        <hr />
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    })
    */

    // ============================================================================
    // OPTION 2: WEB3FORMS IMPLEMENTATION (Server-side) - ACTIVE
    // ============================================================================
    const web3FormsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        name: name,
        email: email,
        subject: subject || `Portfolio Contact from ${name}`,
        message: message,
        from_name: name,
        replyto: email,
      }),
    })

    if (!web3FormsResponse.ok) {
      const errorData = await web3FormsResponse.json().catch(() => ({}))
      console.error('Web3Forms error:', errorData)
      console.error('Status:', web3FormsResponse.status)
      throw new Error(errorData.message || 'Failed to send email via Web3Forms')
    }

    // Check for successful response
    const result = await web3FormsResponse.json()
    console.log('Web3Forms response:', result)

    // ============================================================================
    // OPTION 3: SENDGRID IMPLEMENTATION
    // ============================================================================
    // Uncomment this section after installing @sendgrid/mail and setting SENDGRID_API_KEY
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    await sgMail.send({
      to: 'sohailgidwani15@gmail.com',
      from: 'your-verified-email@yourdomain.com', // Must be verified in SendGrid
      replyTo: email,
      subject: subject || `Portfolio Contact from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    })
    */

    // ============================================================================
    // OPTION 4: NODEMAILER + GMAIL IMPLEMENTATION
    // ============================================================================
    // Uncomment this section after installing nodemailer
    /*
    const nodemailer = require('nodemailer')

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // App password from Google
      },
    })

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'sohailgidwani15@gmail.com',
      replyTo: email,
      subject: subject || `Portfolio Contact from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    })
    */

    // Log successful submission
    console.log('📧 Contact form submitted successfully via Web3Forms')
    console.log('From:', name, '<' + email + '>')
    console.log('Subject:', subject || 'No subject')

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email directly.' },
      { status: 500 }
    )
  }
}
