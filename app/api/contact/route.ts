import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY

  if (!accessKey) {
    return NextResponse.json(
      { success: false, message: "Missing Web3Forms access key." },
      { status: 500 }
    )
  }

  let payload: {
    name?: string
    email?: string
    subject?: string
    message?: string
  }

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    )
  }

  const { name, email, subject, message } = payload

  if (!name || !email || !message) {
    return NextResponse.json(
      { success: false, message: "Name, email, and message are required." },
      { status: 400 }
    )
  }

  const emailSubject = subject || `Portfolio Contact from ${name}`
  const emailMessage = subject ? `Subject: ${subject}\n\n${message}` : message

  try {
    const origin = request.headers.get("origin")
    const referer = request.headers.get("referer")
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }

    if (origin) {
      headers["Origin"] = origin
    }
    if (referer) {
      headers["Referer"] = referer
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers,
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        subject: emailSubject,
        message: emailMessage,
        from_name: name,
        replyto: email,
      }),
    })

    const contentType = response.headers.get("content-type") || ""
    const data = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : null

    if (!response.ok || !data?.success) {
      const fallbackMessage = data
        ? "Failed to send message."
        : "Web3Forms returned an unexpected response. Check server logs for details."
      if (!data) {
        const responseText = await response.text().catch(() => "")
        console.error("Web3Forms non-JSON response:", response.status, responseText)
      }
      return NextResponse.json(
        { success: false, message: data?.message || fallbackMessage },
        { status: response.ok ? 400 : response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: data?.message || "Message sent successfully.",
    })
  } catch (error) {
    console.error("Web3Forms request failed:", error)
    return NextResponse.json(
      { success: false, message: "Failed to send message." },
      { status: 500 }
    )
  }
}
